#!/usr/bin/env node

/**
 * Update the base URL for a registered Orbis clone.
 *
 * Usage:
 *   npm run update-clone -- ./clone-owner.json https://clone.example.com mainnet
 *   node scripts/update-clone-base-url.mjs --keypair ./clone-owner.json --url https://clone.example.com
 *   node scripts/update-clone-base-url.mjs --keypair ~/.config/solana/id.json --url https://clone.example.com --network mainnet
 *   node scripts/update-clone-base-url.mjs --secret-key "[1,2,...]" --url https://clone.example.com --rpc https://api.devnet.solana.com
 *
 * The script reads NEXT_PUBLIC_PROGRAM_ID, NEXT_PUBLIC_RPC_URL, and
 * NEXT_PUBLIC_SOLANA_NETWORK from the environment, .env.local, or .env.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AnchorProvider, Program, setProvider } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const idlPath = path.join(projectRoot, "src", "lib", "sections", "NetworkPage", "idl.json");
const usage = `
Usage:
  npm run update-clone -- <keypair-path> <new-base-url> [network]
  node scripts/update-clone-base-url.mjs --keypair <path> --url <new-base-url> [options]
  node scripts/update-clone-base-url.mjs --secret-key "[1,2,...]" --url <new-base-url> [options]

Options:
  --keypair <path>       Path to a Solana keypair JSON file for the clone owner.
  --secret-key <json>    Raw secret key JSON array for the clone owner.
  --url <url>            New clone base URL to store on-chain.
  --owner <pubkey>       Optional safety check; must match the keypair public key.
  --program-id <pubkey>  Program id. Defaults to NEXT_PUBLIC_PROGRAM_ID or the IDL address.
  --rpc <url>            RPC endpoint. Defaults to NEXT_PUBLIC_RPC_URL or Solana cluster URL.
  --network <cluster>    devnet, testnet, mainnet, or mainnet-beta. Defaults to env or devnet.
  --commitment <level>   processed, confirmed, or finalized. Defaults to confirmed.
  --help                 Show this help.

Examples:
  npm run update-clone -- ./clone-owner.json https://clone.example.com mainnet
  node scripts/update-clone-base-url.mjs --keypair ./clone-owner.json --url https://clone.example.com
  node scripts/update-clone-base-url.mjs --keypair ~/.config/solana/id.json --url https://clone.example.com --network mainnet
  node scripts/update-clone-base-url.mjs --keypair ./clone-owner.json --url https://clone.example.com --program-id x2HARL2kBx2jVHtgWvf8sX8zbZ3sBAvtHJeg8AgosqR
`;

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;

    const key = match[1];
    let value = match[2].trim();
    const quote = value[0];

    if ((quote === "\"" || quote === "'") && value.endsWith(quote)) {
      value = value.slice(1, -1);
    } else {
      value = value.replace(/\s+#.*$/, "").trim();
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function parseArgs(argv) {
  const result = {};
  const positionals = [];
  const knownFlags = new Set([
    "keypair",
    "secret-key",
    "url",
    "owner",
    "program-id",
    "rpc",
    "network",
    "commitment",
    "help",
  ]);

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "-h" || arg === "--help") {
      result.help = true;
      continue;
    }

    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }

    let flag = arg.slice(2);
    let value;
    const equalsIndex = flag.indexOf("=");
    if (equalsIndex !== -1) {
      value = flag.slice(equalsIndex + 1);
      flag = flag.slice(0, equalsIndex);
    }

    if (!knownFlags.has(flag)) {
      throw new Error(`Unknown option: --${flag}`);
    }

    if (flag === "help") {
      result.help = true;
      continue;
    }

    if (value === undefined) {
      value = argv[index + 1];
      index += 1;
    }

    if (value === undefined || value.startsWith("--")) {
      throw new Error(`Missing value for --${flag}`);
    }

    result[toCamelCase(flag)] = value;
  }

  if (positionals.length > 3) {
    throw new Error(`Too many positional arguments. Expected: <keypair-path> <new-base-url> [network].`);
  }

  if (!result.keypair && !result.secretKey && positionals[0]) {
    result.keypair = positionals[0];
  }
  if (!result.url && positionals[1]) {
    result.url = positionals[1];
  }
  if (!result.network && positionals[2]) {
    result.network = positionals[2];
  }

  return result;
}

function toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function normalizeNetwork(value) {
  const network = String(value ?? "devnet").trim().toLowerCase();
  if (network === "mainnet" || network === "mainnet-beta") return "mainnet-beta";
  if (network === "devnet" || network === "testnet") return network;
  throw new Error(`Unsupported network "${value}". Use devnet, testnet, mainnet, or mainnet-beta.`);
}

function normalizeCommitment(value) {
  const commitment = String(value ?? "confirmed").trim().toLowerCase();
  if (commitment === "processed" || commitment === "confirmed" || commitment === "finalized") {
    return commitment;
  }
  throw new Error(`Unsupported commitment "${value}". Use processed, confirmed, or finalized.`);
}

function resolveInputPath(filePath) {
  if (filePath === "~") return os.homedir();
  if (filePath.startsWith("~/") || filePath.startsWith("~\\")) {
    return path.join(os.homedir(), filePath.slice(2));
  }
  return path.resolve(process.cwd(), filePath);
}

function parseSecretKeyJson(rawValue, sourceLabel) {
  let parsed;
  try {
    parsed = JSON.parse(rawValue);
  } catch (error) {
    throw new Error(`Could not parse ${sourceLabel} as JSON: ${error.message}`);
  }

  const secretKey = Array.isArray(parsed)
    ? parsed
    : parsed?.secretKey ?? parsed?._keypair?.secretKey;

  if (!Array.isArray(secretKey)) {
    throw new Error(`${sourceLabel} must be a JSON array, or an object with a secretKey array.`);
  }

  for (const byte of secretKey) {
    if (!Number.isInteger(byte) || byte < 0 || byte > 255) {
      throw new Error(`${sourceLabel} contains an invalid secret-key byte: ${byte}`);
    }
  }

  return Keypair.fromSecretKey(Uint8Array.from(secretKey));
}

function loadKeypair(args) {
  if (args.keypair && args.secretKey) {
    throw new Error("Use either --keypair or --secret-key, not both.");
  }

  if (args.secretKey) {
    return parseSecretKeyJson(args.secretKey, "--secret-key");
  }

  if (!args.keypair) {
    throw new Error("Missing clone owner signer. Provide --keypair <path> or --secret-key <json-array>.");
  }

  const keypairPath = resolveInputPath(args.keypair);
  if (!fs.existsSync(keypairPath)) {
    throw new Error(`Keypair file not found: ${keypairPath}`);
  }

  const rawKeypair = fs.readFileSync(keypairPath, "utf8");
  return parseSecretKeyJson(rawKeypair, keypairPath);
}

function createAnchorWallet(keypair) {
  const sign = (transaction) => {
    if (typeof transaction.partialSign === "function") {
      transaction.partialSign(keypair);
      return transaction;
    }

    if (typeof transaction.sign === "function") {
      transaction.sign([keypair]);
      return transaction;
    }

    throw new Error("Unsupported transaction type returned by Anchor.");
  };

  return {
    publicKey: keypair.publicKey,
    signTransaction: async (transaction) => sign(transaction),
    signAllTransactions: async (transactions) => transactions.map((transaction) => sign(transaction)),
  };
}

function isMissingAccountError(error) {
  const message = String(error?.message ?? error ?? "");
  return message.includes("Account does not exist") || message.includes("has no data");
}

function explorerUrl(signature, network) {
  const cluster = network === "mainnet-beta" ? "" : `?cluster=${network}`;
  return `https://explorer.solana.com/tx/${signature}${cluster}`;
}

async function main() {
  loadEnvFile(path.join(projectRoot, ".env.local"));
  loadEnvFile(path.join(projectRoot, ".env"));

  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage.trim());
    return;
  }

  if (!args.url || !args.url.trim()) {
    throw new Error("Missing --url <new-base-url>.");
  }

  const newBaseUrl = args.url.trim();
  const keypair = loadKeypair(args);
  const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
  const programId = new PublicKey(args.programId ?? process.env.NEXT_PUBLIC_PROGRAM_ID ?? idl.address);
  const network = normalizeNetwork(args.network ?? process.env.NEXT_PUBLIC_SOLANA_NETWORK);
  const commitment = normalizeCommitment(args.commitment);
  const endpoint = args.rpc ?? process.env.NEXT_PUBLIC_RPC_URL ?? clusterApiUrl(network);

  if (args.owner) {
    const expectedOwner = new PublicKey(args.owner);
    if (!expectedOwner.equals(keypair.publicKey)) {
      throw new Error(
        `--owner ${expectedOwner.toString()} does not match keypair public key ${keypair.publicKey.toString()}.`
      );
    }
  }

  const [cloneInfoPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("clone_info"), keypair.publicKey.toBuffer()],
    programId
  );

  const connection = new Connection(endpoint, {
    commitment,
    disableRetryOnRateLimit: false,
  });
  const wallet = createAnchorWallet(keypair);
  const provider = new AnchorProvider(connection, wallet, {
    commitment,
    preflightCommitment: commitment,
  });
  setProvider(provider);

  const program = new Program({ ...idl, address: programId.toString() }, provider);

  console.log("Updating Orbis clone base URL");
  console.log(`  Network:    ${network}`);
  console.log(`  RPC:        ${endpoint}`);
  console.log(`  Program:    ${programId.toString()}`);
  console.log(`  Owner:      ${keypair.publicKey.toString()}`);
  console.log(`  Clone PDA:  ${cloneInfoPda.toString()}`);
  console.log(`  New URL:    ${newBaseUrl}`);

  let currentClone;
  try {
    currentClone = await program.account.cloneInfo.fetch(cloneInfoPda);
  } catch (error) {
    if (isMissingAccountError(error)) {
      throw new Error(`No clone_info account exists for owner ${keypair.publicKey.toString()}. Register the clone first.`);
    }
    throw error;
  }

  console.log(`  Old URL:    ${currentClone.baseUrl ?? ""}`);

  const signature = await program.methods
    .updateCloneBaseUrl(newBaseUrl)
    .accounts({
      cloneInfo: cloneInfoPda,
      owner: keypair.publicKey,
    })
    .rpc({ commitment });

  const updatedClone = await program.account.cloneInfo.fetch(cloneInfoPda);

  console.log("");
  console.log("Clone base URL updated.");
  console.log(`  Signature:  ${signature}`);
  console.log(`  Explorer:   ${explorerUrl(signature, network)}`);
  console.log(`  Updated:    ${updatedClone.baseUrl ?? ""}`);
}

main().catch((error) => {
  console.error("");
  console.error(`Update failed: ${error?.message ?? error}`);
  if (Array.isArray(error?.logs) && error.logs.length > 0) {
    console.error("");
    console.error("Program logs:");
    for (const log of error.logs) {
      console.error(`  ${log}`);
    }
  }
  console.error("");
  console.error(usage.trim());
  process.exitCode = 1;
});
