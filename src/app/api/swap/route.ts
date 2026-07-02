import { NextResponse } from "next/server";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import { getSolPriceUsd } from "@/lib/sections/ExchangePage/sol-price";

type SolanaNetwork = "devnet" | "mainnet-beta" | "testnet";

const ALLOWED_NETWORKS = new Set<string>(["devnet", "mainnet-beta", "testnet"]);

export async function POST(request: Request) {
  try {
    const privateKeyStr = process.env.ADMIN_WALLET_PRIVATE_KEY;
    const orbisMintStr = process.env.NEXT_PUBLIC_ORBIS_MINT;
    const orbisDecimals = parseInt(process.env.NEXT_PUBLIC_ORBIS_DECIMALS ?? "9", 10);
    const orbisPerSolUsd = parseFloat(process.env.NEXT_PUBLIC_ORBIS_RATE ?? "1");

    if (!privateKeyStr || !orbisMintStr) {
      return NextResponse.json(
        { error: "Exchange not configured on server." },
        { status: 500 }
      );
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

    if (typeof network !== "string" || !ALLOWED_NETWORKS.has(network)) {
      return NextResponse.json(
        { error: `network must be one of: ${Array.from(ALLOWED_NETWORKS).join(", ")}.` },
        { status: 400 }
      );
    }

    if (typeof sendAmount !== "number" || !Number.isFinite(sendAmount) || Number.isNaN(sendAmount) || sendAmount <= 0) {
      return NextResponse.json({ error: "sendAmount must be a positive finite number." }, { status: 400 });
    }

    if (typeof userPubkeyStr !== "string" || !userPubkeyStr.trim()) {
      return NextResponse.json({ error: "userPubkey is required." }, { status: 400 });
    }

    let userPubkey: PublicKey;
    try {
      userPubkey = new PublicKey(userPubkeyStr);
    } catch {
      return NextResponse.json({ error: "Invalid user public key." }, { status: 400 });
    }

    if (!PublicKey.isOnCurve(userPubkey.toBytes())) {
      return NextResponse.json({ error: "Invalid user public key (off-curve)." }, { status: 400 });
    }

    let adminKeypair: Keypair;
    try {
      let secretKey: Uint8Array;
      const trimmed = privateKeyStr.trim();
      if (trimmed.startsWith("[")) {
        secretKey = Uint8Array.from(JSON.parse(trimmed) as number[]);
      } else {
        const bs58 = await import("bs58");
        secretKey = bs58.decode(trimmed);
      }
      adminKeypair = Keypair.fromSecretKey(secretKey);
    } catch (e) {
      console.error("[swap] keypair load failed:", e);
      return NextResponse.json(
        { error: "Server keypair misconfigured. ADMIN_WALLET_PRIVATE_KEY must be a JSON array [1,2,...] or a base58 string." },
        { status: 500 }
      );
    }

    const adminPubkey = adminKeypair.publicKey;
    const orbisMint = new PublicKey(orbisMintStr);

    let solPriceUsd: number;
    try {
      solPriceUsd = await getSolPriceUsd();
    } catch {
      return NextResponse.json({ error: "Unable to fetch SOL price. Please try again." }, { status: 503 });
    }
    const orbisPerSol = solPriceUsd / orbisPerSolUsd;

    const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_URL ?? clusterApiUrl(network as SolanaNetwork);
    const connection = new Connection(rpcEndpoint, "confirmed");

    const [adminOrbisAta, userOrbisAta] = await Promise.all([
      getAssociatedTokenAddress(orbisMint, adminPubkey),
      getAssociatedTokenAddress(orbisMint, userPubkey),
    ]);

    if (adminOrbisAta.equals(userOrbisAta)) {
      return NextResponse.json(
        { error: "The connected wallet is the exchange admin wallet and cannot swap with itself." },
        { status: 400 }
      );
    }

    const [adminAtaInfo, { blockhash, lastValidBlockHeight }] = await Promise.all([
      connection.getAccountInfo(adminOrbisAta),
      connection.getLatestBlockhash(),
    ]);

    const tx = new Transaction();
    tx.recentBlockhash = blockhash;
    tx.feePayer = userPubkey;

    if (isSell) {
      const orbisUnits = Math.round(sendAmount * Math.pow(10, orbisDecimals));
      const solLamports = Math.round((sendAmount / orbisPerSol) * LAMPORTS_PER_SOL);

      if (orbisUnits <= 0 || solLamports <= 0) {
        return NextResponse.json({ error: "Computed swap amounts are invalid." }, { status: 400 });
      }

      if (!adminAtaInfo) {
        tx.add(
          createAssociatedTokenAccountIdempotentInstruction(
            userPubkey,
            adminOrbisAta,
            adminPubkey,
            orbisMint
          )
        );
      }

      tx.add(createTransferInstruction(userOrbisAta, adminOrbisAta, userPubkey, orbisUnits));

      tx.add(
        SystemProgram.transfer({
          fromPubkey: adminPubkey,
          toPubkey: userPubkey,
          lamports: solLamports,
        })
      );
    } else {
      const solLamports = Math.round(sendAmount * LAMPORTS_PER_SOL);
      const orbisUnits = Math.round(sendAmount * orbisPerSol * Math.pow(10, orbisDecimals));

      if (solLamports <= 0 || orbisUnits <= 0) {
        return NextResponse.json({ error: "Computed swap amounts are invalid." }, { status: 400 });
      }

      if (!adminAtaInfo) {
        return NextResponse.json(
          { error: "Exchange wallet has no Orbis token account. Fund the admin wallet with Orbis tokens first." },
          { status: 503 }
        );
      }

      tx.add(
        SystemProgram.transfer({
          fromPubkey: userPubkey,
          toPubkey: adminPubkey,
          lamports: solLamports,
        })
      );

      tx.add(
        createAssociatedTokenAccountIdempotentInstruction(
          userPubkey,
          userOrbisAta,
          userPubkey,
          orbisMint
        )
      );

      tx.add(createTransferInstruction(adminOrbisAta, userOrbisAta, adminPubkey, orbisUnits));
    }

    tx.partialSign(adminKeypair);

    const serialized = tx.serialize({ requireAllSignatures: false, verifySignatures: false });
    const transaction = btoa(Array.from(serialized, (b) => String.fromCharCode(b)).join(""));
    return NextResponse.json({ transaction, lastValidBlockHeight });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Swap preparation failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
