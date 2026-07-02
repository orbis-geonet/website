"use client";
import React, { useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import {
  connectWallet,
  disconnectWallet,
  fetchBalances,
} from "../ExchangePage/wallet-connector";
import type { ConnectedWallet, WalletType } from "../ExchangePage/wallet-connector";
import WalletModal from "../ExchangePage/wallet-modal";
import {
  createProgram,
  fetchCloneForWallet,
  fetchAllEscrows,
  getConnection,
  toOrbis,
  truncateAddress,
  CloneData,
  StreamingEscrowAccount,
} from "./anchor-client";
import { PhantomIcon, MetaMaskIcon, TrustWalletIcon } from "../ExchangePage/icons";

type Status = "idle" | "loading" | "error" | "success";

const CardShell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl bg-[linear-gradient(110deg,#0d0d0d_0%,#202020_55%,#131313_100%)] ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.3)] p-5 ${className}`}
  >
    {children}
  </div>
);

const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-2xl bg-zinc-300/40 ${className}`} />
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const EscrowTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-zinc-900 ring-1 ring-white/15 px-3 py-2 text-xs text-white shadow-lg">
      <p className="text-white/40 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="font-bold" style={{ color: p.color }}>
          {p.name}: {(p.value as number).toLocaleString()} $ORBIS
        </p>
      ))}
    </div>
  );
};

const TrustRing = ({ score }: { score: number }) => {
  const pct = Math.min(score / 2000, 1);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const color = score >= 1000 ? "#6FECC2" : score >= 500 ? "#F59E0B" : "#EF4444";
  return (
    <div className="relative flex items-center justify-center h-16 w-16">
      <svg width="64" height="64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <span className="absolute text-sm font-bold text-white">{score}</span>
    </div>
  );
};

interface WalletData {
  sol: number;
  orbis: number | null;
  clone: CloneData | null;
  requesterEscrows: StreamingEscrowAccount[];
  providerEscrows: StreamingEscrowAccount[];
}

const WalletTab = () => {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [connectLoading, setConnectLoading] = useState<WalletType | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);

  const [dataStatus, setDataStatus] = useState<Status>("idle");
  const [dataError, setDataError] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [copied, setCopied] = useState(false);

  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? "devnet") as any;

  const loadWalletData = useCallback(async (w: ConnectedWallet) => {
    setDataStatus("loading");
    setDataError(null);
    try {
      const connection = getConnection();
      const [balances, program] = await Promise.all([
        fetchBalances(w, network),
        createProgram(connection),
      ]);
      const [clone, allEscrows] = await Promise.all([
        fetchCloneForWallet(program, w.publicKey),
        fetchAllEscrows(program),
      ]);
      const addr = w.publicKey.toString();
      const requesterEscrows = allEscrows.filter(
        (e) => e.account.requester.toString() === addr
      );
      const providerEscrows = allEscrows.filter(
        (e) => e.account.provider.toString() === addr
      );
      setWalletData({ sol: balances.sol, orbis: balances.orbis, clone, requesterEscrows, providerEscrows });
      setDataStatus("success");
    } catch (e: any) {
      setDataError(e?.message ?? "Failed to load wallet data.");
      setDataStatus("error");
    }
  }, [network]);

  const handleWalletSelect = async (type: WalletType) => {
    setConnectLoading(type);
    setConnectError(null);
    try {
      const connected = await connectWallet(type, network);
      setWallet(connected);
      setModalOpen(false);
      await loadWalletData(connected);
    } catch (e: any) {
      setConnectError(e?.message ?? "Connection failed.");
    } finally {
      setConnectLoading(null);
    }
  };

  const handleDisconnect = async () => {
    if (!wallet) return;
    await disconnectWallet(wallet).catch(() => {});
    setWallet(null);
    setWalletData(null);
    setDataStatus("idle");
  };

  const handleCopy = () => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet.address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!wallet) {
    return (
      <>
        <div className="flex flex-col items-center justify-center gap-8 py-12">
          <div className="text-center space-y-2">
            <p className="text-lg font-bold text-neutral-900">Connect Your Wallet</p>
            <p className="text-sm text-neutral-500 max-w-xs">
              View your balances, clone node status, and streaming escrow activity.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <PhantomIcon size={40} />
            <MetaMaskIcon size={40} />
            <TrustWalletIcon size={40} />
          </div>
          <button
            onClick={() => { setConnectError(null); setModalOpen(true); }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6FECC2] via-[#79B3F0] to-[#BF5CE2] px-8 py-3.5 text-sm font-bold text-black transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          >
            Connect Wallet
          </button>
        </div>
        <WalletModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSelect={handleWalletSelect}
          loading={connectLoading}
          error={connectError}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500 ring-4 ring-green-500/20" />
            <span className="font-mono text-sm text-neutral-600">
              {truncateAddress(wallet.address, 8)}
            </span>
            <button
              onClick={handleCopy}
              className="text-neutral-400 hover:text-neutral-700 transition"
              title="Copy address"
            >
              {copied ? (
                <span className="text-[11px] text-green-600 font-medium">Copied</span>
              ) : (
                <CopyIcon />
              )}
            </button>
          </div>
          <button
            onClick={handleDisconnect}
            className="text-xs text-neutral-400 hover:text-neutral-700 transition"
          >
            Disconnect
          </button>
        </div>

        {dataStatus === "loading" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <SkeletonBlock className="h-24" />
              <SkeletonBlock className="h-24" />
            </div>
            <SkeletonBlock className="h-36" />
            <SkeletonBlock className="h-44" />
          </div>
        )}

        {dataStatus === "error" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-sm text-neutral-500">{dataError}</p>
            <button
              onClick={() => loadWalletData(wallet)}
              className="rounded-xl bg-neutral-100 ring-1 ring-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-200 transition"
            >
              Retry
            </button>
          </div>
        )}

        {dataStatus === "success" && walletData && (
          <WalletDataView data={walletData} />
        )}
      </div>
      <WalletModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleWalletSelect}
        loading={connectLoading}
        error={connectError}
      />
    </>
  );
};

const WalletDataView = ({ data }: { data: WalletData }) => {
  const { sol, orbis, clone, requesterEscrows, providerEscrows } = data;

  const escrowChartData = requesterEscrows.map((e, i) => ({
    label: `Escrow ${i + 1}`,
    locked: toOrbis(e.account.amountLocked),
    claimed: toOrbis(e.account.amountClaimed),
    remaining: Math.max(0, toOrbis(e.account.amountLocked) - toOrbis(e.account.amountClaimed)),
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <CardShell>
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">SOL</p>
          <p className="text-3xl font-bold text-white">{sol.toFixed(4)}</p>
        </CardShell>
        <CardShell>
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Orbis</p>
          <p className="text-3xl font-bold text-white">
            {orbis !== null ? orbis.toLocaleString() : "—"}
          </p>
        </CardShell>
      </div>

      <CardShell>
        <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
          Clone Node
        </p>
        {clone ? (
          <div className="flex items-start gap-5">
            <TrustRing score={clone.trustScore} />
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <p className="text-[11px] text-white mb-0.5">Total Syncs</p>
                  <p className="font-bold text-white">{clone.totalSyncCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[11px] text-white mb-0.5">Flags</p>
                  <p className="font-bold text-white">{clone.flagCount}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] text-white mb-0.5">Base URL</p>
                  <p className="text-[12px] font-mono text-white/55 break-all">{clone.baseUrl || "—"}</p>
                </div>
              </div>
              <div className="h-px bg-white/8" />
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  clone.trustScore >= 500
                    ? "bg-green-500/15 ring-1 ring-green-500/30 text-green-400"
                    : "bg-red-500/15 ring-1 ring-red-500/30 text-red-400"
                }`}
              >
                <span className={`h-1 w-1 rounded-full ${clone.trustScore >= 500 ? "bg-green-400" : "bg-red-400"}`} />
                {clone.trustScore >= 500 ? "Eligible to claim payments" : "Trust score too low"}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-white/30 py-4">
            Not registered as a clone node.
          </p>
        )}
      </CardShell>

      {requesterEscrows.length > 0 && (
        <CardShell>
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
            Streaming Escrows (as Requester)
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={escrowChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<EscrowTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
              <Bar dataKey="locked" name="Locked" fill="rgba(111,236,194,0.25)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="claimed" name="Claimed" fill="#6FECC2" radius={[3, 3, 0, 0]} />
              <Bar dataKey="remaining" name="Remaining" fill="#79B3F0" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {requesterEscrows.map((e) => {
              const locked = toOrbis(e.account.amountLocked);
              const claimed = toOrbis(e.account.amountClaimed);
              const remaining = Math.max(0, locked - claimed);
              return (
                <div key={e.publicKey.toString()} className="flex items-center justify-between py-2 border-t border-white/8">
                  <div>
                    <p className="text-xs font-mono text-white/40">
                      {truncateAddress(e.account.provider.toString())}
                    </p>
                    {e.account.withdrawalRequestedAt > 0 && (
                      <span className="text-[11px] text-amber-400">Withdrawal pending</span>
                    )}
                  </div>
                  <div className="text-right text-xs space-y-0.5">
                    <p className="text-white/40">Locked: <span className="text-white font-medium">{locked.toLocaleString()}</span></p>
                    <p className="text-white/40">Claimed: <span className="text-[#6FECC2] font-medium">{claimed.toLocaleString()}</span></p>
                    <p className="text-white/40">Left: <span className="text-[#79B3F0] font-medium">{remaining.toLocaleString()}</span></p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardShell>
      )}

      {providerEscrows.length > 0 && (
        <CardShell>
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
            Streaming Escrows (as Provider)
          </p>
          <div className="space-y-2">
            {providerEscrows.map((e) => {
              const claimed = toOrbis(e.account.amountClaimed);
              const locked = toOrbis(e.account.amountLocked);
              const pct = locked > 0 ? Math.min((claimed / locked) * 100, 100) : 0;
              return (
                <div key={e.publicKey.toString()} className="py-3 border-t border-white/8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-white/40">
                      {truncateAddress(e.account.requester.toString())}
                    </span>
                    <span className="text-sm font-bold text-[#6FECC2]">
                      +{claimed.toLocaleString()} $ORBIS
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-[#6FECC2] to-[#79B3F0]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-white/25">
                    {claimed.toLocaleString()} of {locked.toLocaleString()} $ORBIS claimed
                  </p>
                </div>
              );
            })}
          </div>
        </CardShell>
      )}

      {requesterEscrows.length === 0 && providerEscrows.length === 0 && (
        <CardShell>
          <p className="text-center text-white/30 py-4 text-sm">
            No streaming escrows found for this wallet.
          </p>
        </CardShell>
      )}
    </div>
  );
};

export default WalletTab;
