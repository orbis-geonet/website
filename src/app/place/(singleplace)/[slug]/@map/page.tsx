import { Noexistence, PlaceMap } from "@/lib/components";
import { TPLACE } from "@/lib/ts";
import { getData } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const page = async ({ params }: { params: { slug: string } }) => {
  const data = await getData(`places/slug/${params.slug}`);

  if (data.error) return <Noexistence message="Lugar não existe" />;

  const details = {
    coordinates: data.coordinates,
    image: data.imageName,
    type: data.type,
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

  return (
    <>
      <Link
        className="w-full h-[300px] lg:hidden"
        href={`http://maps.google.com/?ie=UTF8&hq=&ll=${details.coordinates.latitude},${details.coordinates.longitude}&z=18`}
      >
        <PlaceMap
          className="h-full w-full lg:rounded-xl object-cover"
          image={details.image}
          type={details.type}
          latitude={details.coordinates.latitude}
          longitude={details.coordinates.longitude}
          color={
            details.groups && details.groups[0].color
              ? details.groups[0].color
              : "#d6ff00"
          }
        />
      </Link>
      <aside className="hidden lg:block h-[550px] w-[400px] min-w-[400px]">
        <PlaceMap
          className="h-full w-full lg:rounded-xl object-cover"
          image={details.image}
          type={details.type}
          latitude={details.coordinates.latitude}
          longitude={details.coordinates.longitude}
          color={
            details.groups && details.groups[0].color
              ? details.groups[0].color
              : "#d6ff00"
          }
        />
      </aside>
    </>
  );
};

export default page;
