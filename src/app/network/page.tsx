import Image from "next/image";
import NetworkPageContent from "@/lib/sections/NetworkPage/network-page";
import { default as ExchangeBg } from "@public/images/bg/exchange-bg.png";

export const metadata = {
  title: "Network",
  description: "Live state of the Orbis Protocol network — registered clones, treasury balances, and streaming escrows.",
};

export default function NetworkPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <Image
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 lg:opacity-100"
        src={ExchangeBg}
        alt=""
        priority
      />
      <div className="relative z-10 mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-12 xl:px-16 pb-24 pt-8 lg:pt-10">
        <NetworkPageContent />
      </div>
    </main>
  );
}
