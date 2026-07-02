import {
  Connection,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  SendOptions,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { createSolanaClient } from "@metamask/connect-solana";

declare global {
  interface Window {
    phantom?: { solana?: SolanaProvider };
    trustwallet?: { solana?: SolanaProvider };
    solana?: SolanaProvider;
    ethereum?: { isMetaMask?: boolean };
  }
}

export type WalletType = "phantom" | "metamask" | "trustwallet";
export type SwapDirection = "buy" | "sell";
export type SolanaNetwork = "devnet" | "mainnet-beta" | "testnet";

const SOLANA_CAIP_CHAIN: Record<SolanaNetwork, string> = {
  "mainnet-beta": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
  devnet: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
  testnet: "solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z",
};

export interface SolanaProvider {
  publicKey: PublicKey | null;
  isPhantom?: boolean;
  connect: (opts?: Record<string, unknown>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signTransaction?: (tx: Transaction) => Promise<Transaction>;
  signAndSendTransaction?: (
    tx: Transaction,
    opts?: SendOptions
  ) => Promise<{ signature: string }>;
}

export interface ConnectedWallet {
  type: WalletType;
  address: string;
  publicKey: PublicKey;
  provider: SolanaProvider;
}

export interface SwapParams {
  wallet: ConnectedWallet;
  direction: SwapDirection;
  sendAmount: number;
  network: SolanaNetwork;
}

export interface WalletBalances {
  sol: number;
  orbis: number | null;
}

function getRpcEndpoint(network: SolanaNetwork): string {
  return process.env.NEXT_PUBLIC_RPC_URL ?? clusterApiUrl(network);
}

async function connectMetaMaskSolana(network: SolanaNetwork): Promise<ConnectedWallet> {
  const { getWallet } = await createSolanaClient({
    dapp: {
      name: "Orbis Exchange",
      url: window.location.origin,
    },
    api: {
      supportedNetworks: {
        mainnet: clusterApiUrl("mainnet-beta"),
        devnet: clusterApiUrl("devnet"),
        testnet: clusterApiUrl("testnet"),
      },
    },
  });

  const walletStd = getWallet();
  if (!walletStd) {
    throw new Error(
      "MetaMask not found. Please install MetaMask with Solana support enabled."
    );
  }

  if (!("standard:connect" in walletStd.features)) {
    throw new Error("MetaMask does not expose the standard:connect feature.");
  }

  const connectFeature = walletStd.features["standard:connect"] as {
    connect: (opts?: { silent?: boolean }) => Promise<{
      accounts: ReadonlyArray<{ address: string; publicKey: Uint8Array }>;
    }>;
  };

  const { accounts } = await connectFeature.connect();
  if (!accounts.length) throw new Error("No Solana accounts found in MetaMask.");

  const account = accounts[0];
  const publicKey = new PublicKey(account.publicKey);
  const chain = SOLANA_CAIP_CHAIN[network];

  const provider: SolanaProvider = {
    publicKey,
    connect: async () => ({ publicKey }),
    disconnect: async () => {
      const df = walletStd.features["standard:disconnect"] as
        | { disconnect: () => Promise<void> }
        | undefined;
      if (df) await df.disconnect();
    },
    signTransaction: async (tx: Transaction) => {
      if (!("solana:signTransaction" in walletStd.features)) {
        throw new Error("MetaMask does not support signTransaction for Solana.");
      }

      const signFeature = walletStd.features["solana:signTransaction"] as {
        signTransaction: (
          ...inputs: ReadonlyArray<{
            account: typeof account;
            transaction: Uint8Array;
            chain?: string;
          }>
        ) => Promise<ReadonlyArray<{ signedTransaction: Uint8Array }>>;
      };

      const serialized = new Uint8Array(
        tx.serialize({ requireAllSignatures: false, verifySignatures: false })
      );
      const [output] = await signFeature.signTransaction({
        account,
        transaction: serialized,
        chain,
      });
      return Transaction.from(output.signedTransaction);
    },
  };

  return { type: "metamask", address: publicKey.toString(), publicKey, provider };
}

function resolvePhantomOrTrustProvider(type: "phantom" | "trustwallet"): SolanaProvider {
  if (type === "phantom") {
    const p =
      window.phantom?.solana ??
      (window.solana?.isPhantom ? window.solana : null);
    if (!p) throw new Error("Phantom is not installed. Visit phantom.app to install.");
    return p;
  }

  const tw = window.trustwallet?.solana ?? null;
  if (!tw) {
    throw new Error(
      "Trust Wallet Solana provider not found. Please install the Trust Wallet extension."
    );
  }
  return tw;
}

export async function connectWallet(
  type: WalletType,
  network: SolanaNetwork = "devnet"
): Promise<ConnectedWallet> {
  if (typeof window === "undefined") {
    throw new Error("Wallet connection requires a browser environment.");
  }

  if (type === "metamask") return connectMetaMaskSolana(network);

  const provider = resolvePhantomOrTrustProvider(type);
  const response = await provider.connect();
  return {
    type,
    address: response.publicKey.toString(),
    publicKey: response.publicKey,
    provider,
  };
}

export async function disconnectWallet(wallet: ConnectedWallet): Promise<void> {
  await wallet.provider.disconnect();
}

export async function fetchBalances(
  wallet: ConnectedWallet,
  network: SolanaNetwork
): Promise<WalletBalances> {
  const connection = new Connection(getRpcEndpoint(network), "confirmed");
  const orbisMintStr = process.env.NEXT_PUBLIC_ORBIS_MINT;

  const solLamports = await connection.getBalance(wallet.publicKey);
  const sol = solLamports / LAMPORTS_PER_SOL;

  if (!orbisMintStr) return { sol, orbis: null };

  const orbisMint = new PublicKey(orbisMintStr);
  const orbisAta = await getAssociatedTokenAddress(orbisMint, wallet.publicKey);

  try {
    const tokenBalance = await connection.getTokenAccountBalance(orbisAta);
    return { sol, orbis: tokenBalance.value.uiAmount ?? 0 };
  } catch {
    return { sol, orbis: 0 };
  }
}

export async function fetchBalancesByAddress(
  address: string,
  network: SolanaNetwork
): Promise<WalletBalances> {
  const connection = new Connection(getRpcEndpoint(network), "confirmed");
  const orbisMintStr = process.env.NEXT_PUBLIC_ORBIS_MINT;
  const pubkey = new PublicKey(address);

  const solLamports = await connection.getBalance(pubkey);
  const sol = solLamports / LAMPORTS_PER_SOL;

  if (!orbisMintStr) return { sol, orbis: null };

  const orbisMint = new PublicKey(orbisMintStr);
  const orbisAta = await getAssociatedTokenAddress(orbisMint, pubkey);

  try {
    const tokenBalance = await connection.getTokenAccountBalance(orbisAta);
    return { sol, orbis: tokenBalance.value.uiAmount ?? 0 };
  } catch {
    return { sol, orbis: 0 };
  }
}

export async function executeSwap({
  wallet,
  direction,
  sendAmount,
  network,
}: SwapParams): Promise<string> {
  const connection = new Connection(getRpcEndpoint(network), "confirmed");
  const userPubkey = wallet.publicKey;

  const res = await fetch("/api/swap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ direction, userPubkey: userPubkey.toString(), sendAmount, network }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? "Failed to prepare swap. Please try again.");
  }

  const data = await res.json() as { transaction: string; lastValidBlockHeight: number };
  const decoded = atob(data.transaction);
  const tx = Transaction.from(Uint8Array.from(decoded, (c) => c.charCodeAt(0)));
  const blockhash = tx.recentBlockhash!;
  const lastValidBlockHeight = data.lastValidBlockHeight;

  if (!wallet.provider.signTransaction) {
    throw new Error("Connected wallet does not support transaction signing.");
  }

  const signed = await wallet.provider.signTransaction(tx);
  const signature = await connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: network !== "mainnet-beta",
    preflightCommitment: "confirmed",
  });

  const confirmation = await connection.confirmTransaction(
    { blockhash, lastValidBlockHeight, signature },
    "confirmed"
  );

  if (confirmation.value.err) {
    throw new Error(`Transaction failed on-chain: ${JSON.stringify(confirmation.value.err)}`);
  }

  return signature;
}
