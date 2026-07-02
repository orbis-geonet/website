export type SolanaNetwork = "devnet" | "mainnet-beta" | "testnet";

export function normalizeSolanaNetwork(value?: string | null): SolanaNetwork {
  const network = (value ?? "devnet").trim().toLowerCase();
  if (network === "mainnet" || network === "mainnet-beta") return "mainnet-beta";
  if (network === "testnet") return "testnet";
  return "devnet";
}
