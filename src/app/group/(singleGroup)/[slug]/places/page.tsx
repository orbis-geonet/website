import { getDictionary } from "@/lib/locales";
import { BASE_URL } from "@/lib/ts";
import { getData, getGroupPlacesSchema } from "@/lib/utils";
import { Addresscard, ClientPlacesOwned, Noexistence } from "@components";
import React from "react";

const Places = async ({ params }: { params: { slug: string } }) => {
  const data = await getData(`places?ownedByGroupSlug=${params.slug}&page=0`);
  const { dictionary } = await getDictionary();

  if (data.error)
    return (
      <main className="max-w-6xl mx-auto p-10 font-bold text-2xl">
        <Noexistence message="Something went wrong" />
      </main>
    );

  const places = data.map((place: any) => {
    return {
      slug: place.slug,
      id: place.placeKey,
      name: place.name,
      address: place.address,
    };
  });

  let groupPlacesSchema;

  try {
    groupPlacesSchema = await getGroupPlacesSchema({
      url: `${BASE_URL}/group/${params.slug}`,
      places: places,
    });
  } catch (err) {
    // console.log(err);
  }

  return (
    <>
      {groupPlacesSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(groupPlacesSchema),
          }}
        />
      )}

      <section className="space-y-4 md:space-y-8 max-w-6xl mx-auto px-4 md:px-0">
        {places.map(
          (place: {
            slug: string;
            id: string;
            name: string;
            address: string;
          }) => (
            <Addresscard key={place.id} {...place} />
          ),
        )}
        {places.length === 0 ? (
          <Noexistence message={dictionary.errors.groupHasNoPlace} />
        ) : (
          places.length === 100 && <ClientPlacesOwned groupslug={params.slug} />
        )}
      </section>
    </>
  );
};

export default Places;
