import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  getOrbisPerSolRate,
  parsePythSolUsdPrice,
  PYTH_DELAYED_PRICE_MAX_AGE_SECONDS,
  PYTH_FRESH_PRICE_MAX_AGE_SECONDS,
  PYTH_RECEIVER_PROGRAM_ID,
  PYTH_SOL_USD_PRICE_ACCOUNT,
} from "@/lib/sections/ExchangePage/pyth-price";

type SolanaNetwork = "devnet" | "mainnet-beta" | "testnet";

const ALLOWED_NETWORKS = new Set<string>(["devnet", "mainnet-beta", "testnet"]);
const U64_MAX = (BigInt(1) << BigInt(64)) - BigInt(1);

function normalizeNetwork(value: string | undefined): SolanaNetwork {
  return value === "mainnet" ? "mainnet-beta" : (value ?? "devnet") as SolanaNetwork;
}

function toBaseUnits(amount: number, decimals: number, label: string): bigint {
  const units = Math.round(amount * Math.pow(10, decimals));
  if (!Number.isSafeInteger(units) || units <= 0) {
    throw new Error(`${label} amount is outside the supported range.`);
  }
  return BigInt(units);
}

function encodeU64(value: bigint): Buffer {
  if (value < BigInt(0) || value > U64_MAX) {
    throw new Error("Swap amount exceeds the contract limit.");
  }
  const encoded = Buffer.alloc(8);
  encoded.writeBigUInt64LE(value);
  return encoded;
}

function instructionDiscriminator(name: string): Buffer {
  return createHash("sha256").update(`global:${name}`).digest().subarray(0, 8);
}

export async function POST(request: Request) {
  try {
    const programIdStr = process.env.NEXT_PUBLIC_EXCHANGE_PROGRAM_ID ?? process.env.NEXT_PUBLIC_PROGRAM_ID;
    const orbisMintStr = process.env.NEXT_PUBLIC_ORBIS_MINT;
    const orbisDecimals = parseInt(process.env.NEXT_PUBLIC_ORBIS_DECIMALS ?? "6", 10);
    const configuredNetwork = normalizeNetwork(
      process.env.NEXT_PUBLIC_EXCHANGE_NETWORK ?? process.env.NEXT_PUBLIC_SOLANA_NETWORK
    );

    if (!programIdStr || !orbisMintStr || !Number.isInteger(orbisDecimals) || orbisDecimals < 0) {
      return NextResponse.json({ error: "Exchange contract is not configured on server." }, { status: 500 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Request body must be an object." }, { status: 400 });
    }

    const { userPubkey: userPubkeyStr, sendAmount, network, direction } = body as Record<string, unknown>;
    const isSell = direction === "sell";

    if (direction !== "buy" && direction !== "sell") {
      return NextResponse.json({ error: "direction must be buy or sell." }, { status: 400 });
    }

    if (typeof network !== "string" || !ALLOWED_NETWORKS.has(network)) {
      return NextResponse.json(
        { error: `network must be one of: ${Array.from(ALLOWED_NETWORKS).join(", ")}.` },
        { status: 400 }
      );
    }

    if (network !== configuredNetwork) {
      return NextResponse.json(
        { error: `Exchange is configured for ${configuredNetwork}, not ${network}.` },
        { status: 400 }
      );
    }

    if (typeof sendAmount !== "number" || !Number.isFinite(sendAmount) || sendAmount <= 0) {
      return NextResponse.json({ error: "sendAmount must be a positive finite number." }, { status: 400 });
    }

    if (typeof userPubkeyStr !== "string" || !userPubkeyStr.trim()) {
      return NextResponse.json({ error: "userPubkey is required." }, { status: 400 });
    }

    let userPubkey: PublicKey;
    let programId: PublicKey;
    let orbisMint: PublicKey;
    let solUsdPriceAccount: PublicKey;
    let pythReceiverProgramId: PublicKey;
    try {
      userPubkey = new PublicKey(userPubkeyStr);
      programId = new PublicKey(programIdStr.trim());
      orbisMint = new PublicKey(orbisMintStr.trim());
      solUsdPriceAccount = new PublicKey(PYTH_SOL_USD_PRICE_ACCOUNT);
      pythReceiverProgramId = new PublicKey(PYTH_RECEIVER_PROGRAM_ID);
    } catch {
      return NextResponse.json({ error: "Exchange configuration or user public key is invalid." }, { status: 400 });
    }

    if (!PublicKey.isOnCurve(userPubkey.toBytes())) {
      return NextResponse.json({ error: "Invalid user public key (off-curve)." }, { status: 400 });
    }

    const rpcEndpoint = process.env.NEXT_PUBLIC_EXCHANGE_RPC_URL ?? clusterApiUrl(configuredNetwork);
    const connection = new Connection(rpcEndpoint, "confirmed");
    const [solVault] = PublicKey.findProgramAddressSync([Buffer.from("exchange_sol_vault")], programId);
    const [solPaymentConfig] = PublicKey.findProgramAddressSync([Buffer.from("sol_payment_config")], programId);
    const [reserveVault] = PublicKey.findProgramAddressSync(
      [Buffer.from("sol_orbis_reserve_vault")],
      programId
    );
    const [config] = PublicKey.findProgramAddressSync([Buffer.from("global_config")], programId);
    const userOrbisAta = await getAssociatedTokenAddress(orbisMint, userPubkey);

    const [priceAccount, userAtaInfo, { blockhash, lastValidBlockHeight }] = await Promise.all([
      connection.getAccountInfo(solUsdPriceAccount),
      connection.getAccountInfo(userOrbisAta),
      connection.getLatestBlockhash(),
    ]);

    if (!priceAccount || !priceAccount.owner.equals(pythReceiverProgramId)) {
      return NextResponse.json({ error: "Pyth SOL/USD price account is unavailable." }, { status: 503 });
    }

    const maxPriceAge = configuredNetwork === "devnet"
      ? PYTH_DELAYED_PRICE_MAX_AGE_SECONDS
      : PYTH_FRESH_PRICE_MAX_AGE_SECONDS;
    const pythPrice = parsePythSolUsdPrice(priceAccount.data, undefined, maxPriceAge);
    const orbisPerSolRate = getOrbisPerSolRate(pythPrice, isSell);
    if (orbisPerSolRate === BigInt(0)) {
      return NextResponse.json({ error: "Pyth SOL/USD price is too small." }, { status: 503 });
    }

    const tx = new Transaction({ feePayer: userPubkey, recentBlockhash: blockhash });
    let inputAmount: bigint;
    let minimumOutput: bigint;
    let instructionName: "buy_orbis" | "sell_orbis";

    if (isSell) {
      if (!userAtaInfo) {
        return NextResponse.json({ error: "Connected wallet has no ORBIS token account." }, { status: 400 });
      }
      inputAmount = toBaseUnits(sendAmount, orbisDecimals, "ORBIS");
      minimumOutput = inputAmount * BigInt(LAMPORTS_PER_SOL) / orbisPerSolRate;
      instructionName = "sell_orbis";
    } else {
      inputAmount = toBaseUnits(sendAmount, 9, "SOL");
      minimumOutput = (inputAmount * orbisPerSolRate + BigInt(LAMPORTS_PER_SOL - 1)) / BigInt(LAMPORTS_PER_SOL);
      instructionName = "buy_orbis";
      tx.add(
        createAssociatedTokenAccountIdempotentInstruction(
          userPubkey,
          userOrbisAta,
          userPubkey,
          orbisMint
        )
      );
    }

    if (minimumOutput <= BigInt(0)) {
      return NextResponse.json({ error: "Computed swap output is too small." }, { status: 400 });
    }

    tx.add(
      new TransactionInstruction({
        programId,
        keys: [
          { pubkey: userPubkey, isSigner: true, isWritable: true },
          { pubkey: userOrbisAta, isSigner: false, isWritable: true },
          { pubkey: solVault, isSigner: false, isWritable: true },
          { pubkey: solPaymentConfig, isSigner: false, isWritable: false },
          { pubkey: reserveVault, isSigner: false, isWritable: true },
          { pubkey: config, isSigner: false, isWritable: false },
          { pubkey: solUsdPriceAccount, isSigner: false, isWritable: false },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: Buffer.concat([
          instructionDiscriminator(instructionName),
          encodeU64(inputAmount),
          encodeU64(minimumOutput),
        ]),
      })
    );

    const serialized = tx.serialize({ requireAllSignatures: false, verifySignatures: false });
    return NextResponse.json({
      transaction: Buffer.from(serialized).toString("base64"),
      lastValidBlockHeight,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Swap preparation failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
