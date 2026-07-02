import { Buffer } from "buffer";
if (typeof globalThis !== "undefined" && !(globalThis as any).Buffer) {
  (globalThis as any).Buffer = Buffer;
}

import { AnchorProvider, Program, setProvider } from "@coral-xyz/anchor";
import type { Idl } from "@coral-xyz/anchor";
import idlJson from "./idl.json";
import {
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { normalizeSolanaNetwork } from "./network-config";
import type { SolanaNetwork } from "./network-config";

export type { SolanaNetwork } from "./network-config";

const programIdStr = process.env.NEXT_PUBLIC_PROGRAM_ID;
if (!programIdStr) throw new Error("NEXT_PUBLIC_PROGRAM_ID env var is not set");
export const PROGRAM_ID = new PublicKey(programIdStr);

export interface GlobalConfig {
  admin: PublicKey;
  treasury: PublicKey;
  orbisMint: PublicKey;
  merkleTree: PublicKey;
  writeFee: number;
  feePerMb: number;
  minFee: number;
  registrationFee: number;
}

export interface CloneData {
  owner: PublicKey;
  baseUrl: string;
  trustScore: number;
  totalSyncCount: number;
  flagCount: number;
  isGenesis: boolean;
}

export interface CloneInfoAccount {
  publicKey: PublicKey;
  account: CloneData;
}

export interface EscrowData {
  requester: PublicKey;
  provider: PublicKey;
  amountLocked: number;
  amountClaimed: number;
  withdrawalRequestedAt: number;
}

export interface StreamingEscrowAccount {
  publicKey: PublicKey;
  account: EscrowData;
}

function toPubkey(val: any, label = "unknown"): PublicKey {
  console.log(`[toPubkey:${label}] input type=${typeof val} constructor=${val?.constructor?.name} value=`, val);
  if (!val) {
    console.warn(`[toPubkey:${label}] val is falsy, returning PublicKey.default`);
    return PublicKey.default;
  }
  if (val instanceof PublicKey) {
    console.log(`[toPubkey:${label}] already PublicKey instance, _bn=`, (val as any)._bn);
    return val;
  }
  try {
    if (typeof val === "string") {
      const pk = new PublicKey(val);
      console.log(`[toPubkey:${label}] from string OK:`, pk.toString());
      return pk;
    }
    if (val instanceof Uint8Array || Array.isArray(val)) {
      const pk = new PublicKey(Uint8Array.from(val));
      console.log(`[toPubkey:${label}] from Uint8Array/Array OK:`, pk.toString());
      return pk;
    }
    const pk = new PublicKey(val);
    console.log(`[toPubkey:${label}] from fallback OK:`, pk.toString());
    return pk;
  } catch (e) {
    console.error(`[toPubkey:${label}] FAILED:`, e, "val was:", val);
    return PublicKey.default;
  }
}

export function toSafeNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "bigint") return Number(val);
  if (typeof val === "number") return val;
  if (typeof val.toNumber === "function") return val.toNumber();
  return Number(val) || 0;
}

export function getNetwork(): SolanaNetwork {
  return normalizeSolanaNetwork(process.env.NEXT_PUBLIC_SOLANA_NETWORK);
}

async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const MAX_ATTEMPTS = 4;
  const BASE_DELAY = 800;
  let lastErr: unknown;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 25_000);
      const res = await fetch(input, { ...init, signal: controller.signal });
      clearTimeout(timer);
      if (res.status === 504 || res.status === 503 || res.status === 429) {
        lastErr = new Error(`RPC ${res.status} on attempt ${attempt + 1}`);
        console.warn(`[fetchWithRetry] ${res.status}, retrying in ${BASE_DELAY * (attempt + 1)}ms…`);
        await new Promise((r) => setTimeout(r, BASE_DELAY * (attempt + 1)));
        continue;
      }
      return res;
    } catch (e) {
      lastErr = e;
      if ((e as any)?.name === "AbortError") {
        console.warn(`[fetchWithRetry] timeout on attempt ${attempt + 1}, retrying…`);
      }
      await new Promise((r) => setTimeout(r, BASE_DELAY * (attempt + 1)));
    }
  }
  throw lastErr;
}

export function getConnection(): Connection {
  const network = getNetwork();
  const endpoint = process.env.NEXT_PUBLIC_RPC_URL ?? clusterApiUrl(network);
  console.log("[getConnection] network=", network, "endpoint=", endpoint);
  return new Connection(endpoint, {
    commitment: "confirmed",
    fetch: fetchWithRetry as any,
    disableRetryOnRateLimit: false,
  });
}

export function getOrbisDecimals(): number {
  return parseInt(process.env.NEXT_PUBLIC_ORBIS_DECIMALS ?? "6", 10);
}

export function toOrbis(rawAmount: number): number {
  return rawAmount / Math.pow(10, getOrbisDecimals());
}

export function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}

export async function createProgram(connection: Connection): Promise<Program> {
  console.log("[createProgram] starting...");
  const dummyKeypair = Keypair.generate();
  console.log("[createProgram] dummy wallet pubkey:", dummyKeypair.publicKey.toString());
  const dummyWallet = {
    publicKey: dummyKeypair.publicKey,
    signTransaction: async (tx: any) => tx,
    signAllTransactions: async (txs: any[]) => txs,
  };
  const provider = new AnchorProvider(connection, dummyWallet, {
    commitment: "confirmed",
  });
  setProvider(provider);

  const idl = { ...(idlJson as Idl), address: PROGRAM_ID.toString() };
  const program = new Program(idl as Idl, provider);
  console.log("[createProgram] Program created OK");
  return program;
}

export async function fetchGlobalConfig(
  program: Program
): Promise<GlobalConfig | null> {
  console.log("[fetchGlobalConfig] deriving PDA...");
  const [configPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("global_config")],
    PROGRAM_ID
  );
  console.log("[fetchGlobalConfig] configPda:", configPda.toString());

  let raw: any;
  try {
    raw = await (program.account as any).globalConfig.fetch(configPda);
  } catch (e: any) {
    if (e?.message?.includes("Account does not exist") || e?.message?.includes("has no data")) {
      console.warn("[fetchGlobalConfig] global_config account not initialized yet");
      return null;
    }
    throw e;
  }
  console.log("[fetchGlobalConfig] raw keys:", Object.keys(raw ?? {}));
  console.log("[fetchGlobalConfig] raw.admin type=", typeof raw?.admin, "constructor=", raw?.admin?.constructor?.name, "value=", raw?.admin);
  console.log("[fetchGlobalConfig] raw.treasury type=", typeof raw?.treasury, "constructor=", raw?.treasury?.constructor?.name, "value=", raw?.treasury);
  console.log("[fetchGlobalConfig] raw.orbisMint type=", typeof raw?.orbisMint, "constructor=", raw?.orbisMint?.constructor?.name, "value=", raw?.orbisMint);
  console.log("[fetchGlobalConfig] raw.merkleTree type=", typeof raw?.merkleTree, "constructor=", raw?.merkleTree?.constructor?.name, "value=", raw?.merkleTree);
  console.log("[fetchGlobalConfig] raw.writeFee type=", typeof raw?.writeFee, "value=", raw?.writeFee);

  return {
    admin: toPubkey(raw.admin, "admin"),
    treasury: toPubkey(raw.treasury, "treasury"),
    orbisMint: toPubkey(raw.orbisMint, "orbisMint"),
    merkleTree: toPubkey(raw.merkleTree, "merkleTree"),
    writeFee: toSafeNumber(raw.writeFee),
    feePerMb: toSafeNumber(raw.feePerMb),
    minFee: toSafeNumber(raw.minFee),
    registrationFee: toSafeNumber(raw.registrationFee),
  };
}

export async function fetchAllClones(
  program: Program
): Promise<CloneInfoAccount[]> {
  console.log("[fetchAllClones] fetching all cloneInfo accounts...");
  const raw = await (program.account as any).cloneInfo.all();
  console.log("[fetchAllClones] count:", raw?.length);
  if (raw?.length > 0) {
    const first = raw[0];
    console.log("[fetchAllClones] first item publicKey type=", typeof first?.publicKey, "constructor=", first?.publicKey?.constructor?.name);
    console.log("[fetchAllClones] first item account keys:", Object.keys(first?.account ?? {}));
    console.log("[fetchAllClones] first item account.owner type=", typeof first?.account?.owner, "constructor=", first?.account?.owner?.constructor?.name);
  }
  return raw.map((item: any) => ({
    publicKey: toPubkey(item.publicKey, "clone.publicKey"),
    account: {
      owner: toPubkey(item.account.owner, "clone.owner"),
      baseUrl: item.account.baseUrl ?? "",
      trustScore: toSafeNumber(item.account.trustScore),
      totalSyncCount: toSafeNumber(item.account.totalSyncCount),
      flagCount: toSafeNumber(item.account.flagCount),
      isGenesis: Boolean(item.account.isGenesis),
    },
  }));
}

export async function fetchCloneForWallet(
  program: Program,
  walletPubkey: PublicKey
): Promise<CloneData | null> {
  console.log("[fetchCloneForWallet] wallet:", walletPubkey.toString());
  const [clonePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("clone_info"), walletPubkey.toBuffer()],
    PROGRAM_ID
  );
  console.log("[fetchCloneForWallet] clonePda:", clonePda.toString());
  try {
    const raw = await (program.account as any).cloneInfo.fetch(clonePda);
    console.log("[fetchCloneForWallet] found clone for wallet");
    return {
      owner: toPubkey(raw.owner, "cloneForWallet.owner"),
      baseUrl: raw.baseUrl ?? "",
      trustScore: toSafeNumber(raw.trustScore),
      totalSyncCount: toSafeNumber(raw.totalSyncCount),
      flagCount: toSafeNumber(raw.flagCount),
      isGenesis: Boolean(raw.isGenesis),
    };
  } catch (e) {
    console.log("[fetchCloneForWallet] no clone found (expected if not registered):", (e as any)?.message);
    return null;
  }
}

export async function fetchAllEscrows(
  program: Program
): Promise<StreamingEscrowAccount[]> {
  console.log("[fetchAllEscrows] fetching all streamingEscrow accounts...");
  const raw = await (program.account as any).streamingEscrow.all();
  console.log("[fetchAllEscrows] count:", raw?.length);
  return raw.map((item: any) => ({
    publicKey: toPubkey(item.publicKey, "escrow.publicKey"),
    account: {
      requester: toPubkey(item.account.requester, "escrow.requester"),
      provider: toPubkey(item.account.provider, "escrow.provider"),
      amountLocked: toSafeNumber(item.account.amountLocked),
      amountClaimed: toSafeNumber(item.account.amountClaimed),
      withdrawalRequestedAt: toSafeNumber(item.account.withdrawalRequestedAt),
    },
  }));
}

export async function fetchSolBalance(
  connection: Connection,
  pubkey: PublicKey
): Promise<number> {
  console.log("[fetchSolBalance] pubkey:", pubkey?.toString?.() ?? "INVALID");
  const lamports = await connection.getBalance(pubkey);
  return lamports / LAMPORTS_PER_SOL;
}

export interface MerkleTreeInfo {
  address: PublicKey;
  maxDepth: number;
  maxBufferSize: number;
  canopyDepth: number;
  authority: PublicKey;
  sequenceNumber: number;
  leavesUsed: number;
  creationSlot: number;
}

export async function fetchMerkleTreeInfo(
  connection: Connection,
  treeAddress: PublicKey
): Promise<MerkleTreeInfo> {
  console.log("[fetchMerkleTreeInfo] fetching tree:", treeAddress.toString());
  const { ConcurrentMerkleTreeAccount } = await import("@solana/spl-account-compression");
  const account = await ConcurrentMerkleTreeAccount.fromAccountAddress(connection, treeAddress);
  const seq = account.getCurrentSeq();
  console.log("[fetchMerkleTreeInfo] decoded OK maxDepth=", account.getMaxDepth(), "canopy=", account.getCanopyDepth());
  return {
    address: treeAddress,
    maxDepth: account.getMaxDepth(),
    maxBufferSize: account.getMaxBufferSize(),
    canopyDepth: account.getCanopyDepth(),
    authority: toPubkey(account.getAuthority(), "treeAuthority"),
    sequenceNumber: toSafeNumber(seq),
    leavesUsed: toSafeNumber(seq),
    creationSlot: toSafeNumber(account.getCreationSlot()),
  };
}

export async function fetchOrbisBalance(
  connection: Connection,
  pubkey: PublicKey,
  orbisMint: PublicKey
): Promise<number> {
  console.log("[fetchOrbisBalance] pubkey:", pubkey?.toString?.() ?? "INVALID", "mint:", orbisMint?.toString?.() ?? "INVALID");
  try {
    const ata = await getAssociatedTokenAddress(orbisMint, pubkey);
    const balance = await connection.getTokenAccountBalance(ata);
    return balance.value.uiAmount ?? 0;
  } catch {
    return 0;
  }
}
