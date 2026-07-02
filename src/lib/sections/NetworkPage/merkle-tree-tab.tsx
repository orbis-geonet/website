"use client";
import React, { useState } from "react";
import { truncateAddress, MerkleTreeInfo } from "./anchor-client";
import type { ConfirmedSignatureInfo } from "@solana/web3.js";

const LEAF_COUNT = 22;

interface MerkleTreeProps {
  treeInfo: MerkleTreeInfo;
  txList: ConfirmedSignatureInfo[];
  network: string;
}

const Panel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/80 backdrop-blur-md rounded-lg p-5 shadow-[0_2px_6px_rgba(0,0,0,0.08),0_8px_28px_rgba(0,0,0,0.07)] ring-1 ring-[#0A0A0A]/[0.06] ${className}`}>
    {children}
  </div>
);

const InfoTooltip = ({ text }: { text: string }) => {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className="relative inline-flex items-center ml-1.5 cursor-default"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="h-3.5 w-3.5 rounded-full border border-[#0A0A0A]/25 inline-flex items-center justify-center font-sans text-[9px] leading-none text-[#666666] select-none cursor-default">?</span>
      {visible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-[#111111] text-[#D0D0D0] font-mono text-[11px] leading-relaxed px-3 py-2.5 rounded shadow-xl z-50 pointer-events-none normal-case tracking-normal">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#111111]" />
        </span>
      )}
    </span>
  );
};

const SectionLabel = ({ children, tip }: { children: React.ReactNode; tip?: string }) => (
  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#3D3D3D] mb-5 flex items-center">
    {children}
    {tip && <InfoTooltip text={tip} />}
  </p>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

function timeAgo(unixTs: number | null | undefined): string {
  if (!unixTs) return "—";
  const diff = Math.floor(Date.now() / 1000) - unixTs;
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface TooltipState { leafIdx: number; cx: number; cy: number; sig: string | null; }

function TreeDiagram({ info, txList, network }: { info: MerkleTreeInfo; txList: ConfirmedSignatureInfo[]; network: string }) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const SVG_W = 700;
  const SVG_H = 330;
  const rootY = 34; const rootR = 16;
  const lv1Y = 95; const lv1R = 12;
  const lv2Y = 156; const lv2R = 9;
  const dotsY = 210;
  const leafY = 288; const leafR = 9;

  const filledCount = Math.min(info.leavesUsed, LEAF_COUNT);
  const leafSpacing = SVG_W / (LEAF_COUNT + 1);
  const leafCx = (i: number) => leafSpacing * (i + 1);
  const txForLeaf = (i: number): ConfirmedSignatureInfo | null => {
    if (i >= filledCount) return null;
    return txList[filledCount - 1 - i] ?? null;
  };
  const txUrl = (sig: string) =>
    network === "mainnet-beta" ? `https://solscan.io/tx/${sig}` : `https://solscan.io/tx/${sig}?cluster=${network}`;

  const lv1Xs = [SVG_W * 0.28, SVG_W * 0.72];
  const lv2Xs = [SVG_W * 0.14, SVG_W * 0.38, SVG_W * 0.62, SVG_W * 0.86];
  const inCanopy = (level: number) => level < info.canopyDepth;
  const tooltipW = 200; const tooltipH = 48;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-6 flex-wrap">
        {[
          { label: "empty leaf", fill: "rgba(0,229,184,0.08)", stroke: "rgba(0,229,184,0.45)" },
          { label: "filled leaf", fill: "rgba(0,160,110,0.20)", stroke: "rgba(0,140,95,0.65)" },
          { label: "canopy node", fill: "rgba(10,10,10,0.08)", stroke: "rgba(10,10,10,0.40)" },
        ].map(({ label, fill, stroke }) => (
          <span key={label} className="flex items-center gap-1.5 font-mono text-[11px] text-[#3D3D3D]">
            <span className="inline-block h-2 w-2 rounded-full flex-shrink-0" style={{ background: fill, boxShadow: `0 0 0 1px ${stroke}` }} />
            {label}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" style={{ minHeight: 260 }} onMouseLeave={() => setTooltip(null)}>
          {lv1Xs.map((x, i) => (
            <line key={i} x1={SVG_W / 2} y1={rootY + rootR} x2={x} y2={lv1Y - lv1R} stroke="rgba(10,10,10,0.10)" strokeWidth="1" />
          ))}
          {lv1Xs.map((px, pi) => [lv2Xs[pi * 2], lv2Xs[pi * 2 + 1]].map((cx, ci) => (
            <line key={`${pi}-${ci}`} x1={px} y1={lv1Y + lv1R} x2={cx} y2={lv2Y - lv2R} stroke="rgba(10,10,10,0.07)" strokeWidth="1" />
          )))}
          {lv2Xs.map((x, i) => (
            <line key={i} x1={x} y1={lv2Y + lv2R} x2={SVG_W / 2} y2={dotsY - 10} stroke="rgba(10,10,10,0.05)" strokeWidth="1" strokeDasharray="3 4" />
          ))}
          {[0, LEAF_COUNT - 1, Math.floor(LEAF_COUNT / 2)].map((li, i) => (
            <line key={i} x1={SVG_W / 2} y1={dotsY + 8} x2={leafCx(li)} y2={leafY - leafR} stroke="rgba(10,10,10,0.05)" strokeWidth="1" strokeDasharray="3 4" />
          ))}

          <circle cx={SVG_W / 2} cy={rootY} r={rootR}
            fill={inCanopy(0) ? "rgba(10,10,10,0.10)" : "rgba(10,10,10,0.04)"}
            stroke={inCanopy(0) ? "rgba(10,10,10,0.50)" : "rgba(10,10,10,0.18)"}
            strokeWidth="1.5" />
          <text x={SVG_W / 2} y={rootY + 4} textAnchor="middle" fontSize="9" fill="rgba(10,10,10,0.72)" fontFamily="monospace">root</text>

          {lv1Xs.map((x, i) => (
            <circle key={i} cx={x} cy={lv1Y} r={lv1R}
              fill={inCanopy(1) ? "rgba(10,10,10,0.08)" : "rgba(10,10,10,0.04)"}
              stroke={inCanopy(1) ? "rgba(10,10,10,0.45)" : "rgba(10,10,10,0.14)"}
              strokeWidth="1.5" />
          ))}
          {lv2Xs.map((x, i) => (
            <circle key={i} cx={x} cy={lv2Y} r={lv2R}
              fill={inCanopy(2) ? "rgba(10,10,10,0.06)" : "rgba(10,10,10,0.03)"}
              stroke={inCanopy(2) ? "rgba(10,10,10,0.38)" : "rgba(10,10,10,0.12)"}
              strokeWidth="1" />
          ))}

          <text x={SVG_W / 2} y={dotsY} textAnchor="middle" fontSize="14" fill="rgba(10,10,10,0.45)" letterSpacing="4">•••</text>
          <text x={SVG_W / 2} y={dotsY + 16} textAnchor="middle" fontSize="10" fill="rgba(10,10,10,0.58)" fontFamily="monospace">
            {`depth 3 → ${info.maxDepth}`}
          </text>

          {Array.from({ length: LEAF_COUNT }, (_, i) => {
            const filled = i < filledCount;
            const cx = leafCx(i);
            const tx = txForLeaf(i);
            const isHovered = tooltip?.leafIdx === i;
            return (
              <circle key={i} cx={cx} cy={leafY} r={isHovered ? leafR + 2 : leafR}
                fill={filled ? "rgba(0,160,110,0.20)" : "rgba(0,229,184,0.08)"}
                stroke={filled ? "rgba(0,140,95,0.65)" : "rgba(0,229,184,0.45)"}
                strokeWidth={isHovered ? 2 : 1.2}
                style={{ cursor: filled ? "pointer" : "default", transition: "r 0.1s" }}
                onMouseEnter={() => setTooltip({ leafIdx: i, cx, cy: leafY, sig: tx?.signature ?? null })}
                onMouseLeave={() => setTooltip(null)}
                onClick={() => { if (tx) window.open(txUrl(tx.signature), "_blank", "noopener,noreferrer"); }}
              />
            );
          })}

          {tooltip && tooltip.sig && (() => {
            const tW = tooltipW; const tH = tooltipH;
            const tx = tooltip.cx - tW / 2;
            const ty = tooltip.cy - leafR - tH - 10;
            const clampedTx = Math.max(4, Math.min(SVG_W - tW - 4, tx));
            return (
              <g style={{ pointerEvents: "none" }}>
                <rect x={clampedTx} y={ty} width={tW} height={tH} rx="2" fill="rgba(250,250,250,0.95)" stroke="rgba(10,10,10,0.10)" strokeWidth="1" />
                <text x={clampedTx + 10} y={ty + 17} fontSize="11" fill="rgba(10,10,10,0.72)" fontFamily="monospace">
                  {tooltip.sig.slice(0, 12)}…{tooltip.sig.slice(-8)}
                </text>
                <text x={clampedTx + 10} y={ty + 35} fontSize="11" fill="rgba(10,10,10,0.55)" fontFamily="monospace">
                  → view on solscan
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#3D3D3D]">leaf fill</span>
          <span className="font-mono text-[12px] text-[#3D3D3D] tabular-nums">
            {info.leavesUsed.toLocaleString()} / {Math.pow(2, info.maxDepth).toLocaleString()}
            {" "}({Math.min((info.leavesUsed / Math.pow(2, info.maxDepth)) * 100, 100).toFixed(2)}%)
          </span>
        </div>
        <div className="h-px bg-[#0A0A0A]/8">
          <div
            className="h-px bg-[#00E5B8] transition-all duration-700"
            style={{ width: `${Math.max(Math.min((info.leavesUsed / Math.pow(2, info.maxDepth)) * 100, 100), info.leavesUsed > 0 ? 0.5 : 0)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

const MerkleTreeTab = ({ treeInfo, txList, network }: MerkleTreeProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const acctUrl = (addr: string) =>
    network === "mainnet-beta" ? `https://solscan.io/account/${addr}` : `https://solscan.io/account/${addr}?cluster=${network}`;

  const txUrl = (sig: string) =>
    network === "mainnet-beta" ? `https://solscan.io/tx/${sig}` : `https://solscan.io/tx/${sig}?cluster=${network}`;

  const recentTx = txList.slice(0, 10);

  const treeStats = [
    { label: "Max Depth", value: treeInfo.maxDepth, tip: "Tree height. A depth of N yields 2^N total leaf slots for storing records." },
    { label: "Max Leaves", value: Math.pow(2, treeInfo.maxDepth).toLocaleString(), tip: "Total leaf capacity of the tree (2^maxDepth). Each leaf holds one committed data record." },
    { label: "Operations", value: treeInfo.sequenceNumber.toLocaleString(), tip: "Sequence number — total append and update operations since tree creation." },
    { label: "Canopy Depth", value: treeInfo.canopyDepth, tip: "Levels of the tree cached on-chain. Deeper canopy lowers compute units needed per write proof." },
  ];

  const treeIdentityRows = [
    {
      key: "Address",
      tip: "On-chain address of the concurrent merkle tree account storing all committed records.",
      value: (
        <div className="flex items-center gap-2">
          <a href={acctUrl(treeInfo.address.toString())} target="_blank" rel="noopener noreferrer"
            className="font-mono text-[14px] text-[#0A0A0A] hover:text-[#333333] transition">
            {truncateAddress(treeInfo.address.toString(), 10)}
          </a>
          <button onClick={() => handleCopy(treeInfo.address.toString())} className="text-[#555555] hover:text-[#222222] transition">
            {copied ? <span className="font-mono text-[12px] text-[#0A0A0A]">copied</span> : <CopyIcon />}
          </button>
        </div>
      ),
    },
    {
      key: "Authority",
      tip: "The program or keypair authorized to append and verify leaves in this tree.",
      value: (
        <a href={acctUrl(treeInfo.authority.toString())} target="_blank" rel="noopener noreferrer"
          className="font-mono text-[14px] text-[#2A2A2A] hover:text-[#333333] transition">
          {truncateAddress(treeInfo.authority.toString(), 10)}
        </a>
      ),
    },
    {
      key: "Created",
      tip: "Solana slot in which this merkle tree account was first initialized.",
      value: <span className="font-mono text-[14px] text-[#2A2A2A]">slot {treeInfo.creationSlot.toLocaleString()}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <Panel>
        <SectionLabel tip="On-chain identity and configuration of the concurrent merkle tree used by the Orbis protocol.">merkle tree</SectionLabel>
        <div className="space-y-0">
          {treeIdentityRows.map(({ key, tip, value }, i) => (
            <React.Fragment key={key}>
              {i > 0 && <div className="h-px bg-[#0A0A0A]/6" />}
              <div className="flex items-center justify-between py-3 gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#444444] w-24 shrink-0 flex items-center">
                  {key}
                  <InfoTooltip text={tip} />
                </span>
                <div className="min-w-0">{value}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="grid grid-cols-1 sm:grid-cols-4 divide-y divide-[#0A0A0A]/6 sm:divide-y-0 sm:divide-x">
          {treeStats.map(({ label, value, tip }, i) => (
            <div key={label} className={`py-4 sm:py-0 ${i > 0 ? "sm:pl-6" : ""} ${i < 3 ? "sm:pr-6" : ""}`}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#3D3D3D] mb-3 flex items-center">
                {label}
                <InfoTooltip text={tip} />
              </p>
              <p className="font-mono text-[28px] sm:text-[37px] font-bold text-[#0A0A0A] leading-none">{value}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionLabel tip="Visual of the concurrent merkle tree. Filled leaves hold committed records; empty leaves are available slots. Click a filled leaf to view its transaction on Solscan.">tree structure</SectionLabel>
        <TreeDiagram info={treeInfo} txList={txList} network={network} />
      </Panel>

      <Panel>
        <div className="flex items-center justify-between mb-5">
          <SectionLabel tip="Recent transactions on the merkle tree account. Each row represents an append or update operation. Click a row to view it on Solscan.">transaction log</SectionLabel>
          <span className="font-mono text-[11px] text-[#555555] tabular-nums">last {recentTx.length}</span>
        </div>
        {recentTx.length === 0 ? (
          <p className="font-mono text-[15px] text-[#4D4D4D] py-10 text-center">no transactions found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#0A0A0A]/8">
                {[
                  { label: "Signature", tip: "Transaction signature — click any row to view on Solscan." },
                  { label: "Age", tip: "Time elapsed since the transaction was confirmed on-chain." },
                  { label: "Status", tip: "CONFIRMED = transaction succeeded. FAILED = transaction reverted or errored." },
                ].map(({ label, tip }) => (
                  <th key={label} className="pb-3 pr-6 last:pr-0 text-left font-mono text-[11px] uppercase tracking-[0.15em] text-[#444444] font-normal">
                    <span className="inline-flex items-center">
                      {label}
                      <InfoTooltip text={tip} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0A0A0A]/4">
              {recentTx.map((tx) => {
                const ok = !tx.err;
                return (
                  <tr key={tx.signature}
                    onClick={() => window.open(txUrl(tx.signature), "_blank", "noopener,noreferrer")}
                    className="cursor-pointer hover:bg-[#0A0A0A]/[0.02] transition">
                    <td className="py-3.5 pr-6">
                      <span className="font-mono text-[13px] text-[#2A2A2A]">{truncateAddress(tx.signature, 8)}</span>
                    </td>
                    <td className="py-3.5 pr-6 font-mono text-[13px] text-[#444444] tabular-nums whitespace-nowrap">
                      {timeAgo(tx.blockTime)}
                    </td>
                    <td className="py-3.5">
                      <span className={`font-mono text-[12px] flex items-center gap-1.5 ${ok ? "text-[#00E5B8]" : "text-[#555555]"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${ok ? "bg-[#00E5B8]" : "bg-[#0A0A0A]/15"}`} />
                        {ok ? "CONFIRMED" : "FAILED"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
};

export default MerkleTreeTab;
