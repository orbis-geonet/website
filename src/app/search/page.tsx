import {
  Breadcrumbs,
  ClientSearchResults,
  DownloadButton,
  Groupcard,
  Noexistence,
} from "@components";
import React from "react";
import { default as AppStoreIconSrc } from "@public/icons/appstore.svg";
import { default as PlayStoreIconSrc } from "@public/icons/playstore.svg";
import { default as MapBg } from "@public/images/bg/map-fullwidth.webp";
import Image from "next/image";
import { Metadata } from "next";
import {
  getAllPageSchema,
  getData,
  getSearchResultsPageSchema,
  searchResultsMapper,
} from "@/lib/utils";
import { TSEARCHRESULTGROUP } from "@/lib/ts";
import { BASE_URL } from "@/lib/ts";
import { getDictionary } from "@/lib/locales";

type PROPS = {
  searchParams: {
    q: string;
  };
};

export const generateMetadata = ({ searchParams }: PROPS): Metadata => {
  const title = `${searchParams.q}`;
  return {
    title: title,
    openGraph: {
      title: title,
      description: `Search results for ${searchParams.q}`,
      url: `${BASE_URL}/search?q=${searchParams.q}`,
      type: "website",
    },
  };
};

const Search = async ({ searchParams }: PROPS) => {
  const data = await getData(`/groups?name=${searchParams.q}&page=0`);
  const metaTitle = `${searchParams.q} | Orbis Rede Geo-Social`;
  const metaDescription = `Search results for ${searchParams.q}`;
  const { dictionary } = await getDictionary();

  const pathList = [
    {
      text: dictionary.common.home,
      href: "/",
    },
    {
      text: dictionary.common.searchResults,
      href: "#",
    },
  ];

  const allPageSchemaOptions = {
    title: metaTitle,
    description: metaDescription,
    url: `${BASE_URL}/search?q=${searchParams.q}`,
  };

  if (data.error)
    return (
      <main className="max-w-6xl mx-auto p-10 font-bold text-2xl">
        {dictionary.errors.noMatchingResultsFound}
      </main>
    );

  const groups: TSEARCHRESULTGROUP[] = searchResultsMapper(data);

  const allPageSchema = getAllPageSchema(allPageSchemaOptions);

  let searchResultsPageSchema;
  try {
    searchResultsPageSchema = await getSearchResultsPageSchema(
      metaTitle,
      metaDescription,
      searchParams.q,
      groups,
    );
  } catch (err) {
    // console.log(err);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(allPageSchema),
        }}
      />
      {searchResultsPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(searchResultsPageSchema),
          }}
        />
      )}
      <Image
        className="absolute inset-0 bottom-auto"
        alt="wide-map-bg"
        src={MapBg}
        priority
      />
      <section className="pt-10 md:pt-20 relative z-10 max-w-6xl px-4 lg:px-0 lg:mx-auto">
        <Breadcrumbs pathList={pathList} />
        <div className="flex flex-col-reverse gap-6 md:flex-row md:items-center justify-between py-6">
          <h1 className="font-bold text-2xl md:text-4xl">{searchParams.q}</h1>
          <div className="hidden md:flex flex-row items-center gap-6">
            <DownloadButton
              icon={AppStoreIconSrc}
              href={dictionary.homePage.appStoreURL}
            >
              App Store
            </DownloadButton>
            <DownloadButton
              icon={PlayStoreIconSrc}
              href="https://play.google.com/store/apps/details?id=com.orbis.orbis&rdid=com.orbis.orbis"
            >
              Google Play
            </DownloadButton>
          </div>
        </div>
        <div className="space-y-4 md:space-y-6">
          {groups.map((group) => (
            <Groupcard key={group.id} {...group} />
          ))}
        </div>
        {groups.length === 0 ? (
          <Noexistence message={dictionary.errors.noMatchingResultsFound} />
        ) : (
          groups.length == 20 && <ClientSearchResults query={searchParams.q} />
        )}
      </section>
    </>
  );
};

export default Search;
