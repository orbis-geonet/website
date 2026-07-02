"use client";
import React from "react";
import { PhantomIcon, MetaMaskIcon, TrustWalletIcon } from "./icons";
import type { WalletType } from "./wallet-connector";
import useLocale from "@/hooks/useLocale";

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (wallet: WalletType) => void;
  loading: WalletType | null;
  error: string | null;
}

const WALLETS: { type: WalletType; label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { type: "phantom", label: "Phantom", Icon: PhantomIcon },
  { type: "metamask", label: "MetaMask", Icon: MetaMaskIcon },
  { type: "trustwallet", label: "Trust Wallet", Icon: TrustWalletIcon },
];

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white/50 ml-auto shrink-0"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const WalletModal = ({ open, onClose, onSelect, loading, error }: WalletModalProps) => {
  const { dictionary: { exchangeWidget: t } } = useLocale();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-[400px] bg-black rounded-2xl p-5 text-white shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold tracking-[0.04em]">{t.connectWallet}</h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/8 transition-colors focus:outline-none"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="13" y1="3" x2="3" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 ring-1 ring-red-500/20 px-4 py-3">
            <p className="text-[13px] text-red-400 leading-snug">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          {WALLETS.map(({ type, label, Icon }) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              disabled={loading !== null}
              className="w-full flex items-center gap-4 rounded-xl bg-[linear-gradient(110deg,#0d0d0d_0%,#202020_55%,#131313_100%)] px-4 py-4 ring-1 ring-white/10 hover:ring-white/30 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon size={36} className="shrink-0" />
              <span className="font-semibold text-[15px] text-white">{label}</span>
              {loading === type && <Spinner />}
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-[12px] text-white/30">
          {t.termsAgreement}
        </p>
      </div>
    </div>
  );
};

export default WalletModal;
