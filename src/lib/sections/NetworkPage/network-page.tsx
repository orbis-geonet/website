"use client";
import React, { useEffect, useState, useCallback } from "react";
import { FaGithub } from "react-icons/fa";
import * as Tabs from "@radix-ui/react-tabs";
import NetworkOverviewTab from "./network-overview-tab";
import MerkleTreeTab from "./merkle-tree-tab";
import NetworkBadge from "./network-badge";
import {
  createProgram,
  fetchGlobalConfig,
  fetchAllClones,
  fetchMerkleTreeInfo,
  fetchSolBalance,
  fetchOrbisBalance,
  getConnection,
  truncateAddress,
  GlobalConfig,
  CloneInfoAccount,
  MerkleTreeInfo,
} from "./anchor-client";
import { normalizeSolanaNetwork } from "./network-config";
import type { ConfirmedSignatureInfo } from "@solana/web3.js";

interface WalletBalance {
  sol: number;
  orbis: number;
}

interface PageData {
  config: GlobalConfig | null;
  clones: CloneInfoAccount[];
  cloneBalances: Record<string, WalletBalance | null>;
  treasuryBalance: WalletBalance | null;
  adminBalance: WalletBalance | null;
  treeInfo: MerkleTreeInfo | null;
  txList: ConfirmedSignatureInfo[];
}

type Status = "idle" | "loading" | "error" | "success";

const DOT_GRID = {
  backgroundImage: "radial-gradient(circle, rgba(10,10,10,0.07) 1px, transparent 1px)",
  backgroundSize: "18px 18px",
} as const;

const Loader = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-28">
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1 w-1 rounded-full bg-[#0A0A0A]/50 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
    <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#444444]">{message}</p>
  </div>
);

const Header = ({ withTabs = false, tabsSlot }: { withTabs?: boolean; tabsSlot?: React.ReactNode }) => {
  const programId = process.env.NEXT_PUBLIC_PROGRAM_ID;
  const network = normalizeSolanaNetwork(process.env.NEXT_PUBLIC_SOLANA_NETWORK);
  const explorerUrl = programId
    ? network === "mainnet-beta"
      ? `https://solscan.io/account/${programId}`
      : `https://solscan.io/account/${programId}?cluster=${network}`
    : null;

  return (
    <div className="pb-6 mb-8 border-b border-[#0A0A0A]/6" style={DOT_GRID}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="space-y-1.5">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#444444] [text-shadow:0_0_8px_#fff,0_0_16px_#fff]">Orbis Protocol</p>
          <h1 className="font-mono text-[25px] font-bold text-[#0A0A0A] leading-tight [text-shadow:0_0_10px_#fff,0_0_20px_#fff]">Network Dashboard</h1>
          {explorerUrl && programId && (
            <div className="flex items-center gap-2 pt-0.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#777777] [text-shadow:0_0_8px_#fff]">program</span>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[12px] text-[#00B892] hover:text-[#00E5B8] transition-colors flex items-center gap-1 [text-shadow:0_0_8px_#fff]"
              >
                {truncateAddress(programId, 6)}
                <span className="text-[10px] opacity-70">↗</span>
              </a>
              <a
                href="https://github.com/orbis-geonet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#555555] hover:text-[#0A0A0A] transition-colors [text-shadow:0_0_8px_#fff]"
              >
                <FaGithub className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>
        <div className="shrink-0">
          <NetworkBadge />
        </div>
      </div>
      {withTabs && tabsSlot}
    </div>
  );
};

const NetworkPageContent = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<PageData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadMsg, setLoadMsg] = useState("Connecting to Solana network…");
  const network = normalizeSolanaNetwork(process.env.NEXT_PUBLIC_SOLANA_NETWORK);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    setLoadMsg("Connecting to Solana network…");
    try {
      const connection = getConnection();
      setLoadMsg("Creating Anchor program client…");
      const program = await createProgram(connection);
      setLoadMsg("Fetching global configuration…");
      const config = await fetchGlobalConfig(program);
      if (!config) {
        setData({ config: null, clones: [], cloneBalances: {}, treeInfo: null, txList: [], treasuryBalance: null, adminBalance: null });
        setStatus("success");
        return;
      }
      setLoadMsg("Loading network data…");
      const [clones, treeInfo, txList, treasurySol, treasuryOrbis, adminSol, adminOrbis] =
        await Promise.all([
          fetchAllClones(program),
          fetchMerkleTreeInfo(connection, config.merkleTree),
          connection.getSignaturesForAddress(config.merkleTree, { limit: 50 }),
          fetchSolBalance(connection, config.treasury),
          fetchOrbisBalance(connection, config.treasury, config.orbisMint),
          fetchSolBalance(connection, config.admin),
          fetchOrbisBalance(connection, config.admin, config.orbisMint),
        ]);
      setLoadMsg("Fetching clone wallet balances…");
      const cloneBalanceEntries = await Promise.all(
        clones.map(async (clone) => {
          const owner = clone.account.owner;
          try {
            const [sol, orbis] = await Promise.all([
              fetchSolBalance(connection, owner),
              fetchOrbisBalance(connection, owner, config.orbisMint),
            ]);
            return [owner.toString(), { sol, orbis }] as const;
          } catch {
            return [owner.toString(), null] as const;
          }
        })
      );
      setData({
        config,
        clones,
        cloneBalances: Object.fromEntries(cloneBalanceEntries),
        treeInfo,
        txList,
        treasuryBalance: { sol: treasurySol, orbis: treasuryOrbis },
        adminBalance: { sol: adminSol, orbis: adminOrbis },
      });
      setStatus("success");
    } catch (e: any) {
      setError(e?.message ?? "Failed to load network data.");
      setStatus("error");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const RetryButton = () => (
    <button onClick={load}
      className="font-mono text-[12px] uppercase tracking-[0.15em] text-[#3D3D3D] border border-[#0A0A0A]/30 px-4 py-2 hover:text-[#0A0A0A] hover:border-[#0A0A0A]/25 transition">
      retry
    </button>
  );

  if (status === "idle" || status === "loading") {
    return (
      <div className="w-full">
        <Header />
        <Loader message={loadMsg} />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full">
        <Header />
        <div className="flex flex-col items-center gap-5 py-20 text-center">
          <p className="font-mono text-[13px] text-[#3D3D3D]">{error}</p>
          <RetryButton />
        </div>
      </div>
    );
  }

  if (!data) return null;

  if (!data.config) {
    return (
      <div className="w-full">
        <Header />
        <div className="flex flex-col items-center gap-5 py-20 text-center">
          <p className="font-mono text-[13px] text-[#3D3D3D]">
            program not yet initialized — global_config account has not been created on-chain.
          </p>
          <RetryButton />
        </div>
      </div>
    );
  }

  const tabsList = (
    <Tabs.List className="flex items-center gap-6">
      {[
        { value: "network", label: "Network" },
        { value: "merkle", label: "Merkle Tree" },
      ].map(({ value, label }) => (
        <Tabs.Trigger
          key={value}
          value={value}
          className="font-mono text-[12px] uppercase tracking-[0.15em] pb-0.5 border-b-2 border-transparent
            text-[#444444] hover:text-[#111111]
            data-[state=active]:text-[#0A0A0A] data-[state=active]:border-[#00E5B8]
            [text-shadow:0_0_8px_#fff,0_0_16px_#fff]
            transition-all focus-visible:outline-none"
        >
          {label}
        </Tabs.Trigger>
      ))}
    </Tabs.List>
  );

  return (
    <Tabs.Root defaultValue="network" className="w-full">
      <Header withTabs tabsSlot={tabsList} />

      <Tabs.Content value="network" className="focus-visible:outline-none">
        <NetworkOverviewTab
          config={data.config!}
          clones={data.clones}
          cloneBalances={data.cloneBalances}
          treasuryBalance={data.treasuryBalance!}
          adminBalance={data.adminBalance!}
        />
      </Tabs.Content>

      <Tabs.Content value="merkle" className="focus-visible:outline-none">
        <MerkleTreeTab
          treeInfo={data.treeInfo!}
          txList={data.txList}
          network={network}
        />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default NetworkPageContent;
