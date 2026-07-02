import { Heading } from "@/lib/components";
import { getDictionary } from "@/lib/locales";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not found | Orbis Rede Geo-Social",
};

export default async function NotFound() {
  const { dictionary } = await getDictionary();
  return (
    <div className="w-full flex flex-col space-y-4 items-center justify-center">
      <Heading>{dictionary.errors.pageNotFound}</Heading>
      <p className="">{dictionary.errors.unableToFindRequestedResource}</p>
      <a
        className="text-xs md:text-base  flex items-center justify-center font-medium text-white bg-primary
          py-3 px-8 rounded-md whitespace-nowrap mt-4"
        href="/"
      >
        {dictionary.common.goToHomepage}
      </a>
    </div>
  );
}
