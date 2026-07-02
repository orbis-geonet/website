"use client";
import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Check, Copy } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, TooltipProps,
} from "recharts";
import { getOrbisDecimals, toOrbis, truncateAddress, GlobalConfig, CloneInfoAccount } from "./anchor-client";

const CHART_PAGE_SIZE = 12;
const TABLE_PAGE_SIZE = 10;
const SOL_BASE_FEE_LAMPORTS = 5000;
const LAMPORTS_PER_SOL = 1_000_000_000;

interface WalletBalance { sol: number; orbis: number; }

interface NetworkOverviewProps {
  config: GlobalConfig;
  clones: CloneInfoAccount[];
  cloneBalances: Record<string, WalletBalance | null>;
  treasuryBalance: WalletBalance;
  adminBalance: WalletBalance;
}

const clampDecimals = (decimals: number) => Math.min(Math.max(decimals, 0), 9);

const formatFixedAmount = (amount: number, decimals: number) =>
  amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const formatSolAmount = (amount: number) => formatFixedAmount(amount, 9);

const formatOrbisAmount = (amount: number) =>
  formatFixedAmount(amount, clampDecimals(getOrbisDecimals()));

const Panel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/80 backdrop-blur-md rounded-lg p-5 shadow-[0_2px_6px_rgba(0,0,0,0.08),0_8px_28px_rgba(0,0,0,0.07)] ring-1 ring-[#0A0A0A]/[0.06] ${className}`}>
    {children}
  </div>
);

const InfoTooltip = ({ text, dir = "up" }: { text: string; dir?: "up" | "down" }) => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  const handleEnter = () => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({
      x: r.left + r.width / 2,
      y: dir === "down" ? r.bottom + 8 : r.top - 8,
    });
  };

  const tooltip = pos ? createPortal(
    <span
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        transform: dir === "down" ? "translateX(-50%)" : "translateX(-50%) translateY(-100%)",
        zIndex: 9999,
        pointerEvents: "none",
        width: "14rem",
      }}
      className="bg-[#111111] text-[#D0D0D0] font-mono text-[11px] leading-relaxed px-3 py-2.5 rounded shadow-xl normal-case tracking-normal"
    >
      {text}
      {dir === "down"
        ? <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-[#111111]" />
        : <span className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#111111]" />
      }
    </span>,
    document.body
  ) : null;

  return (
    <span
      ref={ref}
      style={{ cursor: "default" }}
      className="relative inline-flex items-center ml-1.5"
      onMouseEnter={handleEnter}
      onMouseLeave={() => setPos(null)}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="h-3.5 w-3.5 rounded-full border border-[#0A0A0A]/25 inline-flex items-center justify-center font-sans text-[9px] leading-none text-[#666666] select-none" style={{ cursor: "default" }}>?</span>
      {tooltip}
    </span>
  );
};

const SectionLabel = ({ children, tip }: { children: React.ReactNode; tip?: string }) => (
  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#3D3D3D] mb-5 flex items-center">
    {children}
    {tip && <InfoTooltip text={tip} />}
  </p>
);

const copyTextToClipboard = async (text: string) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the textarea fallback below.
  }

  let textarea: HTMLTextAreaElement | null = null;
  try {
    textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea?.remove();
  }
};

const CopyButton = ({ value, label }: { value: string; label: string }) => {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const didCopy = await copyTextToClipboard(value);
    if (!didCopy) return;

    setCopied(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      title={copied ? "Copied" : `Copy ${label}`}
      className={`inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-[#666666] transition hover:bg-[#0A0A0A]/[0.04] hover:text-[#0A0A0A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A]/20 ${copied ? "text-[#0A0A0A]" : ""}`}
    >
      {copied ? <Check aria-hidden="true" size={14} strokeWidth={2.2} /> : <Copy aria-hidden="true" size={14} strokeWidth={2} />}
    </button>
  );
};

const CopyableText = ({
  value,
  label,
  children,
  className = "",
  textClassName = "",
}: {
  value: string;
  label: string;
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
}) => (
  <span className={`inline-flex min-w-0 items-center gap-1.5 ${className}`}>
    <span className={`min-w-0 truncate font-mono ${textClassName}`} title={value}>
      {children}
    </span>
    <CopyButton value={value} label={label} />
  </span>
);

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/90 backdrop-blur-sm border border-[#0A0A0A]/10 px-3 py-2 shadow-sm rounded">
      <p className="font-mono text-[11px] text-[#3D3D3D] mb-1">{label}</p>
      <p className="font-mono text-[15px] font-bold text-[#0A0A0A]">{payload[0].value?.toLocaleString()}</p>
    </div>
  );
};

const GenesisMarker = () => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  const handleEnter = () => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: r.top - 8 });
  };

  const tooltip = pos ? createPortal(
    <span
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        transform: "translateX(-50%) translateY(-100%)",
        zIndex: 9999,
        pointerEvents: "none",
        width: "15rem",
      }}
      className="bg-[#111111] text-[#D0D0D0] font-mono text-[11px] leading-relaxed px-3 py-2.5 rounded shadow-xl normal-case tracking-normal"
    >
      Genesis clone: holds all historical data in its database, and is queried as fallback when no delta batch is found.
      <span className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#111111]" />
    </span>,
    document.body
  ) : null;

  return (
    <span
      ref={ref}
      className="relative inline-flex h-3.5 w-3.5 items-center justify-center"
      onMouseEnter={handleEnter}
      onMouseLeave={() => setPos(null)}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="absolute h-3.5 w-3.5 rounded-full bg-[#00E5B8]/30 animate-ping" />
      <span className="relative h-2 w-2 rounded-full bg-[#00E5B8] shadow-[0_0_10px_rgba(0,229,184,0.95)]" />
      {tooltip}
    </span>
  );
};

type SortKey = "trustScore" | "totalSyncCount" | "flagCount";

const TrustBar = ({ score }: { score: number }) => {
  const pct = Math.min((score / 2000) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-px bg-[#0A0A0A]/10">
        <div className="h-px bg-[#00E5B8] transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[12px] text-[#3D3D3D] w-10 text-right tabular-nums">{score}</span>
    </div>
  );
};

const PageControls = ({
  page, totalPages, total, pageSize, onPrev, onNext,
}: {
  page: number; totalPages: number; total: number; pageSize: number; onPrev: () => void; onNext: () => void;
}) => {
  const from = page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);
  return (
    <div className="flex items-center justify-between pt-4 border-t border-[#0A0A0A]/6 mt-4">
      <span className="font-mono text-[12px] text-[#444444] tabular-nums">{from}–{to} of {total}</span>
      <div className="flex items-center gap-5">
        <button onClick={onPrev} disabled={page === 0}
          className="font-mono text-[12px] text-[#3D3D3D] hover:text-[#0A0A0A] disabled:opacity-20 disabled:cursor-not-allowed transition">
          ← prev
        </button>
        <span className="font-mono text-[12px] text-[#555555] tabular-nums">{page + 1}/{totalPages}</span>
        <button onClick={onNext} disabled={page >= totalPages - 1}
          className="font-mono text-[12px] text-[#3D3D3D] hover:text-[#0A0A0A] disabled:opacity-20 disabled:cursor-not-allowed transition">
          next →
        </button>
      </div>
    </div>
  );
};

const NetworkOverviewTab = ({ config, clones, cloneBalances, treasuryBalance, adminBalance }: NetworkOverviewProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("trustScore");
  const [sortAsc, setSortAsc] = useState(false);
  const [chartPage, setChartPage] = useState(0);
  const [tablePage, setTablePage] = useState(0);

  const totalSyncCount = clones.reduce((sum, c) => sum + c.account.totalSyncCount, 0);
  const avgTrust = clones.length > 0
    ? Math.round(clones.reduce((sum, c) => sum + c.account.trustScore, 0) / clones.length)
    : 0;
  const totalFlags = clones.reduce((sum, c) => sum + c.account.flagCount, 0);

  const allChartData = clones
    .slice()
    .sort((a, b) => b.account.totalSyncCount - a.account.totalSyncCount)
    .map((c) => ({ label: truncateAddress(c.account.owner.toString()), syncs: c.account.totalSyncCount }));

  const chartTotalPages = Math.max(1, Math.ceil(allChartData.length / CHART_PAGE_SIZE));
  const chartData = allChartData.slice(chartPage * CHART_PAGE_SIZE, (chartPage + 1) * CHART_PAGE_SIZE);

  const sortedClones = clones.slice().sort((a, b) => {
    const aVal = sortKey === "totalSyncCount" ? a.account.totalSyncCount : sortKey === "flagCount" ? a.account.flagCount : a.account.trustScore;
    const bVal = sortKey === "totalSyncCount" ? b.account.totalSyncCount : sortKey === "flagCount" ? b.account.flagCount : b.account.trustScore;
    return sortAsc ? aVal - bVal : bVal - aVal;
  });

  const tableTotalPages = Math.max(1, Math.ceil(sortedClones.length / TABLE_PAGE_SIZE));
  const pageClones = sortedClones.slice(tablePage * TABLE_PAGE_SIZE, (tablePage + 1) * TABLE_PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(false); }
    setTablePage(0);
  };

  const SortIndicator = ({ col }: { col: SortKey }) =>
    sortKey === col ? <span className="ml-1 text-[#0A0A0A]">{sortAsc ? "↑" : "↓"}</span> : null;

  const stats = [
    { label: "Registered Clones", value: clones.length, tip: "Clone nodes that have staked the registration fee and joined the Orbis network on-chain." },
    { label: "Total Sync Count", value: totalSyncCount.toLocaleString(), tip: "Sum of the on-chain total_sync_count field across registered clone accounts. This is the protocol sync counter, not a reconstructed blockchain write count." },
    { label: "Avg Trust Score", value: avgTrust, sub: "/ 2 000", tip: "Mean trust score across all clones (0–2,000). Trust is earned through successful syncs and reduced by flags or downtime. Clones do not all begin at 2,000 because a max starting score would hide the difference between nodes that have proven correct sync behavior and nodes that have not." },
    { label: "Total Flags", value: totalFlags, tip: "Dispute flags raised against clone nodes by the network. High counts may trigger slashing." },
  ];

  const fees = [
    { label: "Write Fee", val: toOrbis(config.writeFee), unit: "$ORBIS", tip: "Fixed $ORBIS fee deducted from the requester's escrow for each data write." },
    { label: "Fee / MB", val: toOrbis(config.feePerMb), unit: "$ORBIS", tip: "Variable fee added per megabyte of payload, on top of the base write fee." },
    { label: "Min Fee", val: toOrbis(config.minFee), unit: "$ORBIS", tip: "Minimum fee floor — no write operation can cost less than this amount." },
    { label: "Registration Fee", val: toOrbis(config.registrationFee), unit: "$ORBIS", tip: "One-time $ORBIS fee paid by a clone node to register its on-chain identity." },
    { label: "SOL Base Fee", val: SOL_BASE_FEE_LAMPORTS / LAMPORTS_PER_SOL, unit: "SOL", tip: "Solana's flat network fee of 5,000 lamports (0.000005 SOL). Paid on every transaction, on top of the $ORBIS protocol fee." },
  ];

  const wallets = [
    { label: "Treasury", address: config.treasury.toString(), sol: treasuryBalance.sol, orbis: treasuryBalance.orbis, tip: "Protocol-owned wallet that collects write fees, registration fees, and other protocol revenue." },
    { label: "Admin", address: config.admin.toString(), sol: adminBalance.sol, orbis: adminBalance.orbis, tip: "Admin keypair authorized to update protocol parameters such as fees and the merkle tree address." },
  ];

  const columns: { label: string; col: SortKey | null; tip: string }[] = [
    { label: "Public Key", col: null, tip: "Owner public key for the registered clone node." },
    { label: "SOL", col: null, tip: "Current SOL balance for the clone owner's wallet." },
    { label: "$ORBIS", col: null, tip: "Current $ORBIS token balance for the clone owner's associated token account." },
    { label: "URL", col: null, tip: "Base URL the clone node advertises for API access." },
    { label: "Trust", col: "trustScore", tip: "Trust score (0–2,000). Trust is earned through successful syncs, not granted at the maximum by default. If every clone started at 2,000, the network could not distinguish nodes that have completed correct syncs from nodes that have not. Nodes below 500 are flagged AT RISK and may be slashed." },
    { label: "Sync Count", col: "totalSyncCount", tip: "The on-chain total_sync_count field on this clone info account. It reflects successful protocol syncs recorded for the clone, not transaction-history decoding." },
    { label: "Flags", col: "flagCount", tip: "Number of dispute flags raised against this clone by network participants." },
    { label: "Status", col: null, tip: "Node health based on trust score. Active nodes are in good standing. At-risk nodes have a low score and may be penalized." },
  ];

  return (
    <div className="space-y-4">
      <Panel>
        <div className="grid grid-cols-1 sm:grid-cols-4 divide-y divide-[#0A0A0A]/6 sm:divide-y-0 sm:divide-x">
          {stats.map(({ label, value, sub, tip }, i) => (
            <div key={label} className={`py-4 sm:py-0 ${i > 0 ? "sm:pl-6" : ""} ${i < 3 ? "sm:pr-6" : ""}`}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#3D3D3D] mb-3 flex items-center">
                {label}
                <InfoTooltip text={tip} />
              </p>
              <p className="font-mono text-[28px] sm:text-[37px] font-bold text-[#0A0A0A] leading-none">{value}</p>
              {sub && <p className="font-mono text-[11px] text-[#555555] mt-1.5">{sub}</p>}
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionLabel tip="On-chain wallet balances for the protocol treasury and admin keypair.">wallet balances</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {wallets.map(({ label, address, sol, orbis, tip }) => (
            <div key={label} className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#3D3D3D] flex items-center">
                  {label}
                  <InfoTooltip text={tip} />
                </p>
                <CopyableText
                  value={address}
                  label={`${label.toLowerCase()} address`}
                  className="max-w-[220px] justify-end"
                  textClassName="text-[12px] text-[#555555] text-right"
                >
                  {truncateAddress(address, 6)}
                </CopyableText>
              </div>
              <div className="h-px bg-[#0A0A0A]/6" />
              <div className="flex justify-between items-baseline gap-4">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#444444] shrink-0">SOL</span>
                <span className="font-mono text-[20px] sm:text-[25px] font-bold text-[#0A0A0A] text-right break-all leading-tight">{formatSolAmount(sol)}</span>
              </div>
              <div className="h-px bg-[#0A0A0A]/6" />
              <div className="flex justify-between items-baseline gap-4">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#444444] shrink-0">$ORBIS</span>
                <span className="font-mono text-[20px] sm:text-[25px] font-bold text-[#0A0A0A] text-right break-all leading-tight">{formatOrbisAmount(orbis)}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionLabel tip="Token amounts charged for various protocol operations.">fee configuration</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-5 divide-y divide-[#0A0A0A]/6 sm:divide-y-0 sm:divide-x">
          {fees.map(({ label, val, unit, tip }, i) => (
            <div key={label} className={`py-4 sm:py-0 ${i > 0 ? "sm:pl-6" : ""} ${i < fees.length - 1 ? "sm:pr-6" : ""}`}>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#3D3D3D] mb-2 flex items-center">
                {label}
                <InfoTooltip text={tip} />
              </p>
              <p className="font-mono text-[21px] font-bold text-[#0A0A0A]">
                {val.toLocaleString(undefined, { maximumFractionDigits: 8 })}
              </p>
              <p className="font-mono text-[11px] text-[#0A0A0A] mt-0.5">{unit}</p>
            </div>
          ))}
        </div>
      </Panel>

      {allChartData.length > 0 && (
        <Panel>
          <div className="flex items-center justify-between mb-5">
            <SectionLabel tip="On-chain total_sync_count per registered clone owner public key, sorted by volume. Paginate to see all nodes.">clone sync activity</SectionLabel>
            <span className="font-mono text-[11px] text-[#555555] tabular-nums">
              {Math.min((chartPage + 1) * CHART_PAGE_SIZE, allChartData.length)}/{allChartData.length}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,10,10,0.05)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "rgba(10,10,10,0.30)", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(10,10,10,0.30)", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(10,10,10,0.03)" }} />
              <Bar dataKey="syncs" fill="#0A0A0A" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {chartTotalPages > 1 && (
            <PageControls page={chartPage} totalPages={chartTotalPages} total={allChartData.length} pageSize={CHART_PAGE_SIZE} onPrev={() => setChartPage((p) => p - 1)} onNext={() => setChartPage((p) => p + 1)} />
          )}
        </Panel>
      )}

      <Panel>
        <div className="flex items-center justify-between mb-5">
          <SectionLabel tip="All clone nodes registered on-chain. Click column headers to sort.">registered clone nodes</SectionLabel>
          <span className="font-mono text-[11px] text-[#555555] tabular-nums">{clones.length} total</span>
        </div>
        {sortedClones.length === 0 ? (
          <p className="font-mono text-[15px] text-[#4D4D4D] py-10 text-center">no clone nodes registered yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#0A0A0A]/8">
                    {columns.map(({ label, col, tip }) => (
                      <th key={label} className="pb-3 pr-4 last:pr-0 text-left font-mono text-[11px] uppercase tracking-[0.15em] text-[#444444] font-normal">
                        <span className="inline-flex items-center gap-0.5">
                          <span
                            className={col ? "cursor-pointer hover:text-[#111111] select-none transition" : ""}
                            onClick={col ? () => toggleSort(col) : undefined}
                          >
                            {label}
                            {col && <SortIndicator col={col} />}
                          </span>
                          <InfoTooltip text={tip} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0A0A0A]/4">
                  {pageClones.map((c) => {
                    const isActive = c.account.trustScore >= 500;
                    const balance = cloneBalances[c.account.owner.toString()];
                    const ownerAddress = c.account.owner.toString();
                    const cloneUrl = c.account.baseUrl;
                    return (
                      <tr key={c.publicKey.toString()} className="hover:bg-[#0A0A0A]/[0.02] transition">
                        <td className="py-3.5 pr-4">
                          <span className="inline-flex items-center gap-2">
                            <CopyableText
                              value={ownerAddress}
                              label="clone address"
                              textClassName="text-[13px] text-[#0A0A0A]"
                            >
                              {truncateAddress(ownerAddress, 6)}
                            </CopyableText>
                            {c.account.isGenesis && <GenesisMarker />}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 font-mono tabular-nums text-[12px] text-[#0A0A0A] whitespace-nowrap">
                          {balance ? formatSolAmount(balance.sol) : "—"}
                        </td>
                        <td className="py-3.5 pr-4 font-mono tabular-nums text-[12px] text-[#0A0A0A] whitespace-nowrap">
                          {balance ? formatOrbisAmount(balance.orbis) : "—"}
                        </td>
                        <td className="py-3.5 pr-4">
                          {cloneUrl ? (
                            <CopyableText
                              value={cloneUrl}
                              label="clone URL"
                              className="max-w-[190px]"
                              textClassName="text-[13px] text-[#444444]"
                            >
                              {cloneUrl}
                            </CopyableText>
                          ) : (
                            <span className="font-mono text-[13px] text-[#444444]">—</span>
                          )}
                        </td>
                        <td className="py-3.5 pr-4 min-w-[140px]">
                          <TrustBar score={c.account.trustScore} />
                        </td>
                        <td className="py-3.5 pr-4 font-mono tabular-nums text-[13px] text-[#0A0A0A]">
                          {c.account.totalSyncCount.toLocaleString()}
                        </td>
                        <td className="py-3.5 pr-4 font-mono tabular-nums text-[13px] text-[#333333]">
                          {c.account.flagCount}
                        </td>
                        <td className="py-3.5">
                          <span className={`font-mono text-[12px] flex items-center gap-1.5 ${isActive ? "text-[#00E5B8]" : "text-[#555555]"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${isActive ? "bg-[#00E5B8]" : "bg-[#0A0A0A]/15"}`} />
                            {isActive ? "ACTIVE" : "AT RISK"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {tableTotalPages > 1 && (
              <PageControls page={tablePage} totalPages={tableTotalPages} total={sortedClones.length} pageSize={TABLE_PAGE_SIZE} onPrev={() => setTablePage((p) => p - 1)} onNext={() => setTablePage((p) => p + 1)} />
            )}
          </>
        )}
      </Panel>
    </div>
  );
};

export default NetworkOverviewTab;
