import React from "react";
import { default as MapBg } from "@public/images/bg/map-bg.webp";
import Image from "next/image";
import { PlaceDetails, PlacesOwnedByDominator, PlaceNavbar } from "@sections";
import { TPLACE } from "@interface";
import { Metadata } from "next";
import { MapBanner, Noexistence, ScrollToTop } from "@components";
import {
  getAllPageSchema,
  getData,
  getDefaultPlaceImage,
  getPlacePageSchema,
  getURL,
} from "@/lib/utils";
import { BASE_URL } from "@/lib/ts";
import { getDictionary } from "@/lib/locales";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const data = await getData(`places/slug/${params.slug}`);

  if (data.error) {
    return {};
  }

  const image = data.imageName
    ? await getURL(`placePictures/${data.imageName}`)
    : getDefaultPlaceImage(data.type);
  const title = data.name ? `${data.name}` : "Place";
  const description = data.description;

  return {
    title: title,
    openGraph: {
      title: title,
      description: description ? description : "",
      images: [image],
      url: `${BASE_URL}/place/${params.slug}`,
      type: "profile",
    },
  };
};

const Place = async ({
  params,
  children,
  map,
}: {
  params: { slug: string };
  children: React.ReactNode;
  map: React.ReactNode;
}) => {
  const data = await getData(`places/slug/${params.slug}`);
  const { dictionary } = await getDictionary();

  // if (data.error) return <Noexistence message={dictionary.errors.placeDoesntExist} />;
  if (data.error) notFound();

  const placeDetails: TPLACE = {
    id: data.placeKey,
    slug: data.slug,
    name: data.name,
    coordinates: data.coordinates,
    image: data.imageName,
    type: data.type,
    website: data.website,
    rating: data.averageRate,
    address: data.address,
    tel: data.phone,
    activeTime: data.workingHours,
    description: data.description,
    groups: data.competingGroups
      ? data.competingGroups.map((group: any) => {
          return {
            id: group.groupKey,
            slug: group.slug,
            name: group.name,
            image: group.imageName,
            percentage:
              data.competingGroups.length === 1 ? 100 : group.percentage,
            color: group.strokeColorHex ? group.strokeColorHex : "#d6ff00",
          };
        })
      : data.dominantGroup
        ? [
            {
              id: data.dominantGroup.groupKey,
              slug: data.dominantGroup.slug,
              name: data.dominantGroup.name,
              image: data.dominantGroup.imageName,
              percentage:
                data.competingGroups && data.competingGroups.length !== 0
                  ? data.dominantGroup.percentage
                  : 100,
              color: data.dominantGroup.strokeColorHex
                ? data.dominantGroup.strokeColorHex
                : "#d6ff00",
            },
          ]
        : [],
  };

  if (
    placeDetails.groups?.length == 0 ||
    (placeDetails.groups && !placeDetails.groups[0].id)
  ) {
    return <Noexistence message={dictionary.errors.placeDoesntExist} />;
  }

  const allPageSchemaOptions = {
    title: `${placeDetails.name} | Orbis Rede Geo-Social`,
    description: placeDetails.description
      ? placeDetails.description
      : "Grupos locais no mapa da sua região",
    url: `${BASE_URL}/place/${placeDetails.slug}`,
  };

  const allPageSchema = getAllPageSchema(allPageSchemaOptions);

  let placePageSchema = {};
  try {
    placePageSchema = await getPlacePageSchema(placeDetails);
  } catch (err) {
    console.log(err);
  }

  // console.log(JSON.stringify(placePageSchema, null, 2));

  return (
    <>
      {placePageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(placePageSchema),
          }}
        />
      )}

      <ScrollToTop />
      <Image
        className="absolute top-0 right-0"
        src={MapBg}
        alt="bg-image"
        height={765}
        width={675}
        priority
      />
      <main className="relative z-10">
        <MapBanner className="mb-4 max-w-6xl lg:mx-auto" />
        <section className="flex flex-col lg:flex-row gap-6 md:gap-10 lg:gap-14 max-w-6xl mx-auto pt-4">
          {map}
          <PlaceDetails dictionary={dictionary} details={placeDetails} />
        </section>
        <PlaceNavbar dictionary={dictionary} />
        {children}
        <PlacesOwnedByDominator
          dictionary={dictionary}
          placeslug={placeDetails.slug}
          groupid={placeDetails.groups && placeDetails.groups[0].id}
        />
      </main>
    </>
  );
};

export default Place;
