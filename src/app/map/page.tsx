import { Metadata } from "next";
import MapPage from "./map-page";
import { getDictionary } from "@/lib/locales";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { city: string };
}): Promise<Metadata> {
  const { dictionary } = await getDictionary();
  const cityName = searchParams.city?.replaceAll("+", " ");

  return {
    title: cityName ? cityName : dictionary.common.map,
    openGraph: {
      title: cityName ? cityName : dictionary.common.map,
      images: ["https://orbis.social/favicon.ico"],
    },
  };
}

export default function Map() {
  return <MapPage />;
}
