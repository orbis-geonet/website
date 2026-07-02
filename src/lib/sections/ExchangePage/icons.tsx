import React from "react";
import Image, { StaticImageData } from "next/image";
import solanaCoin from "@public/images/exchange/solana-coin.png";
import orbisCoin from "@public/images/exchange/orbis-coin.png";
import metamask from "@public/images/exchange/metamask.png";
import trustWallet from "@public/images/exchange/trust-wallet.png";
import phantom from "@public/images/exchange/phantom.png";

export const ArrowLeftRightIcon = ({
  className = "",
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7 7 H20" />
    <path d="M17 4 L20 7 L17 10" />
    <path d="M17 17 H4" />
    <path d="M7 14 L4 17 L7 20" />
  </svg>
);

export const OrbisIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fill="currentColor"
      d="M16 1 L19.2 12.8 L31 16 L19.2 19.2 L16 31 L12.8 19.2 L1 16 L12.8 12.8 Z"
    />
  </svg>
);

const makePngIcon = (src: StaticImageData, alt: string) => {
  const Component = ({
    className = "",
    size = 40,
  }: {
    className?: string;
    size?: number;
  }) => (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
  Component.displayName = alt;
  return Component;
};

export const SolanaCoin = makePngIcon(solanaCoin, "Solana");
export const OrbisCoin = makePngIcon(orbisCoin, "Orbis");
export const MetaMaskIcon = makePngIcon(metamask, "MetaMask");
export const TrustWalletIcon = makePngIcon(trustWallet, "Trust Wallet");
export const PhantomIcon = makePngIcon(phantom, "Phantom");

export const SolanaIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="sol-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00FFA3" />
        <stop offset="100%" stopColor="#DC1FFF" />
      </linearGradient>
    </defs>
    <g fill="url(#sol-grad)">
      <path d="M5 7.5 L17.5 7.5 L19 6 L6.5 6 Z" />
      <path d="M5 12.75 L17.5 12.75 L19 11.25 L6.5 11.25 Z" />
      <path d="M5 18 L17.5 18 L19 16.5 L6.5 16.5 Z" />
    </g>
  </svg>
);
