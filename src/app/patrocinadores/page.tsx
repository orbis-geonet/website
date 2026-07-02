// import Sponsor from "@public/logos/sponsor.png";
import { Metadata } from "next";
// import Image from "next/image";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Patrocinadores | Orbis.social",
  description: "Conheça os patrocinadores do projeto Orbis.social",
};

export default function PartnersPage() {
  redirect("/");
  // return <main className="max-w-xl mx-auto text-center px-4 flex flex-col gap-8 py-8">
  //     <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold">
  //         Nosso projeto é Patrocinado por
  //     </h1>
  //     <div className="flex items-center gap-2">
  //         <Image className="w-full" src={Sponsor} alt="Mato Grosso" priority />
  //     </div>
  // </main>
}
