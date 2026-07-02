"use client";

import { Addresscard, Spinner } from "@components";
import React, { useEffect, useState } from "react";
import { getData } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

const ClientPlacesOwned: React.FC<{
  groupslug: string;
}> = ({ groupslug }) => {
  const [places, setPlaces] = useState<
    {
      id: string;
      slug: string;
      name: string;
      address: string;
    }[]
  >([]);
  const [page, setPage] = useState(1);
  const [allResultsFetched, setAllResultsFetched] = useState(false);

  const { ref, inView } = useInView();

  const loadMorePlaces = async () => {
    if (allResultsFetched) return;

    try {
      const data = await getData(
        `/places?ownedByGroupSlug=${groupslug}&page=${page}`,
      );

      if (data.error) {
        return;
      }

      const newPlaces = data.map((place: any) => {
        return {
          id: place.placeKey,
          slug: place.slug,
          name: place.name,
          address: place.address,
        };
      });

      setPlaces((prevPlaces) => [...prevPlaces, ...newPlaces]);

      setPage((currentPage) => currentPage + 1);

      if (newPlaces.length < 100) setAllResultsFetched(true);
    } catch (error) {
      console.error("Error loading more Places:", error);
    }
  };

  useEffect(() => {
    if (allResultsFetched) return;
    if (inView) {
      loadMorePlaces();
    }
  }, [inView]);

  return (
    <>
      {places.map(
        (place: {
          id: string;
          slug: string;
          name: string;
          address: string;
        }) => (
          <Addresscard key={place.id} {...place} />
        ),
      )}
      {!allResultsFetched && (
        <div className="flex justify-center items-center flex-col gap-4 mt-4">
          <Spinner inviewref={ref} />
          <p>Loading more places...</p>
        </div>
      )}
    </>
  );
};

export default ClientPlacesOwned;
