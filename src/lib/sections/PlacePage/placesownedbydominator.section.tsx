import React from "react";
import { Nearbyplacecard } from "@components";
import { getData, getRelatedPlacesSchema } from "@/lib/utils";
import { TNEARBYPLACE } from "@/lib/ts";
import { Dictionary } from "@/lib/locales";

type PROPS = {
  dictionary: Dictionary;
  placeslug: string;
  groupid?: string;
};

const PlacesOwnedByDominator: React.FC<PROPS> = async ({
  dictionary,
  groupid,
  placeslug,
}) => {
  const data = await getData(`places?ownedByGroupKey=${groupid}&size=6`);

  const nearbyPlaces = data
    .filter((place: any) => place.slug !== placeslug)
    .map((place: any) => {
      const temp: TNEARBYPLACE = {
        id: place.placeKey,
        slug: place.slug,
        name: place.name,
        image: place.imageName,
        color: place.dominantGroup?.solidColorHex,
        rating: place.averageRate ? place.averageRate : 0,
        type: place.type,
        coordinates: place.coordinates,
      };
      return temp;
    });

  if (nearbyPlaces.length === 0) return;

  let relatedPlacesSchema;

  try {
    relatedPlacesSchema = await getRelatedPlacesSchema({
      placeslug: placeslug,
      places: nearbyPlaces,
    });
  } catch (err) {
    // console.log(err);
  }

  return (
    <>
      {relatedPlacesSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(relatedPlacesSchema),
          }}
        />
      )}
      <section className="max-w-6xl mx-auto space-y-6 mt-20">
        <h2 className="font-bold text-base px-4 lg:px-0 md:text-2xl">
          {dictionary.placePage.placesTheGroupFrequents}
        </h2>
        <div className="space-y-4 px-4 lg:px-0 sm:space-y-0 sm:grid grid-cols-2 min-[1152px]:grid-cols-3 gap-3 gap-y-4 min-[1152px]:gap-x-4 min-[1152px]:gap-y-8 max-w-6xl mx-auto">
          {nearbyPlaces.map((place: TNEARBYPLACE) => (
            <Nearbyplacecard key={place.id} {...place} />
          ))}
        </div>
      </section>
    </>
  );
};

export default PlacesOwnedByDominator;
