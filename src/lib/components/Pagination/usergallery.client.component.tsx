"use client";

import { Spinner } from "@components";
import React, { useEffect, useState } from "react";
import { TPHOTO } from "@interface";
import { getData } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { SingleImage } from "@/lib/sections";
import { BASE_URL } from "@/lib/ts";

const ClientUserGallery: React.FC<{
  userslug: string;
}> = ({ userslug }) => {
  const [images, setImages] = useState<TPHOTO[]>([]);
  const [page, setPage] = useState(1);
  const [allResultsFetched, setAllResultsFetched] = useState(false);

  const { ref, inView } = useInView();

  const loadMoreImages = async () => {
    if (allResultsFetched) return;
    try {
      let data: any = [];
      await Promise.all([
        fetch(
          `${BASE_URL}/api/profile/slug/${userslug}/pictures?page=${page}`,
          {
            cache: "force-cache",
          },
        ),
        fetch(
          `${BASE_URL}/api/profile/slug/${userslug}/igpictures?page=${page}`,
          {
            cache: "force-cache",
          },
        ),
      ])
        .then(async ([res1, res2]) => {
          const pictures = await res1.json();
          const igpictures = await res2.json();
          if (Array.isArray(pictures) && Array.isArray(igpictures)) {
            data = pictures.concat(igpictures);
          }

          if (Array.isArray(pictures) && Array.isArray(igpictures)) {
            data = pictures.concat(igpictures);
          } else if (Array.isArray(pictures)) {
            data = pictures;
          } else if (Array.isArray(igpictures)) {
            data = pictures;
          }

          const newImages: TPHOTO[] = data.map((photo: any) => {
            return {
              id: photo.pictureKey,
              image: photo.pictureUrl[0],
              type: photo.type,
            };
          });

          setImages((prevImages) => [...prevImages, ...newImages]);

          setPage((currentPage) => currentPage + 1);

          if (newImages.length < 20) setAllResultsFetched(true);
        })
        .catch(() => {
          return;
        });
    } catch (error) {
      console.error("Error loading more images:", error);
    }
  };

  useEffect(() => {
    if (allResultsFetched) return;

    if (inView) {
      loadMoreImages();
    }
  }, [inView]);

  return (
    <>
      {images.map((image: TPHOTO, index: number) => (
        <SingleImage key={image.id} {...image} index={index} />
      ))}
      {!allResultsFetched && (
        <div className="flex justify-center items-center flex-col gap-4 mt-4">
          <Spinner inviewref={ref} />
          <p>Loading more images...</p>
        </div>
      )}
    </>
  );
};

export default ClientUserGallery;
