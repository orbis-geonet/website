"use client";
import React from "react";
import { normalizeSolanaNetwork } from "./network-config";

const NetworkBadge = () => {
  const network = normalizeSolanaNetwork(process.env.NEXT_PUBLIC_SOLANA_NETWORK);
  const isMainnet = network === "mainnet-beta";
  const label = isMainnet ? "mainnet" : network;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 border font-mono text-[10px] uppercase tracking-[0.2em] [text-shadow:0_0_8px_#fff,0_0_16px_#fff] ${
      isMainnet
        ? "border-[#0A0A0A]/20 text-[#0A0A0A]"
        : "border-[#00E5B8]/70 text-[#00B892]"
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${isMainnet ? "bg-[#0A0A0A]" : "bg-[#00E5B8]"}`} />
      {label}
    </div>
  );
};

export default NetworkBadge;
