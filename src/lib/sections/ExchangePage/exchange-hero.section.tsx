"use client";
import React from "react";
import { Heading, Typography } from "@components";
import useLocale from "@/hooks/useLocale";
import { FaGithub } from "react-icons/fa";
import {
  ArrowLeftRightIcon,
  MetaMaskIcon,
  OrbisCoin,
  PhantomIcon,
  SolanaCoin,
  TrustWalletIcon,
} from "./icons";

export const CoinIconsRow = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <SolanaCoin size={44} />
    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100">
      <ArrowLeftRightIcon className="h-4 w-4 text-neutral-700" />
    </span>
    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100">
      <OrbisCoin size={44} />
    </span>
  </div>
);

export const HeroCopy = ({ className = "" }: { className?: string }) => {
  const { dictionary } = useLocale();
  return (
    <div className={`space-y-6 ${className}`}>
      <Heading className="mx-auto max-w-[520px] !leading-[1.05] lg:mx-0">
        {dictionary.exchange.heroCopyHeading}
      </Heading>
      <Typography className="mx-auto max-w-[520px] text-neutral-600 lg:mx-0">
        {dictionary.exchange.heroCopyBody}
      </Typography>
    </div>
  );
};

export const GithubButton = ({ className = "" }: { className?: string }) => (
  <a
    href="https://github.com/orbis-geonet"
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center justify-center gap-3 rounded-2xl bg-black px-7 py-4 text-base font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 ${className}`}
  >
    <FaGithub className="h-5 w-5" />
    <span>Github</span>
  </a>
);

export const WalletsRow = ({
  className = "",
  layout = "default",
}: {
  className?: string;
  layout?: "default" | "inline";
}) => {
  if (layout === "inline") {
    return (
      <div
        className={`flex items-center justify-between gap-4 rounded-full bg-neutral-100 px-5 py-3 ${className}`}
      >
        <span className="text-sm font-semibold text-neutral-800">Wallets</span>
        <div className="flex items-center gap-4">
          <MetaMaskIcon size={36} />
          <TrustWalletIcon size={36} />
          <PhantomIcon size={36} />
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <span className="inline-block rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-semibold text-neutral-700">
        Wallets
      </span>
      <div className="flex items-center gap-4">
        <MetaMaskIcon size={40} />
        <TrustWalletIcon size={40} />
        <PhantomIcon size={40} />
      </div>
    </div>
  );
};

const ExchangeHero = () => {
  return (
    <section className="space-y-8">
      <CoinIconsRow />
      <HeroCopy />
      <GithubButton />
      <div className="pt-14">
        <WalletsRow />
      </div>
    </section>
  );
};

export default ExchangeHero;
