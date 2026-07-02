import Image from "next/image";
import { CoinIconsRow, ExchangeHeader, ExchangeWidget, GithubButton, HeroCopy, WalletsRow } from "@sections";
import { default as ExchangeBg } from "@public/images/bg/exchange-bg.png";

export const metadata = {
    title: "Exchange",
    description: "Swap Solana for Orbis tokens directly from your wallet.",
};

export default function ExchangePage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-white pt-32">
            <Image
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 lg:opacity-100"
                src={ExchangeBg}
                alt=""
                priority
            />
            <div className="relative z-10">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-14 pb-20 pt-4 lg:pt-10">
                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-x-16">
                        {/* Widget: first on mobile, right column on desktop spanning all rows */}
                        <div className="order-4 flex justify-center lg:order-none lg:col-start-2 lg:row-span-5 lg:justify-end lg:pt-16">
                            <ExchangeWidget />
                        </div>

                        {/* Wallets: second on mobile (inline pill + icons), last left-col row on desktop */}
                        <div className="order-5 lg:order-none lg:col-start-1 lg:row-start-5 lg:pt-4">
                            <WalletsRow layout="inline" className="lg:hidden" />
                            <WalletsRow className="hidden lg:block" />
                        </div>

                        {/* Coin icons row */}
                        <div className="order-1 flex justify-center lg:justify-start lg:order-none lg:col-start-1 lg:row-start-1">
                            <CoinIconsRow />
                        </div>

                        {/* Heading + body */}
                        <div className="order-2 text-center lg:text-left lg:order-none lg:col-start-1 lg:row-start-2">
                            <HeroCopy />
                        </div>

                        {/* Github button: full-width on mobile */}
                        <div className="order-3 flex justify-center lg:justify-start lg:order-none lg:col-start-1 lg:row-start-3">
                            <GithubButton className="w-full lg:w-auto" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
