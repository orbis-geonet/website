import React, { Suspense } from "react";
import { ClientUserGallery, Noexistence, LoadingComponent } from "@components";
import { SingleImage } from "@sections";
import { getUserGallerySchema } from "@/lib/utils";
import { BASE_URL, TPHOTO } from "@/lib/ts";
import { getDictionary } from "@/lib/locales";

interface GalleryPhoto {
  pictureKey: string;
  pictureUrl: string[];
  timestamp: string;
  type: string;
}

interface GalleryContentProps {
  params: {
    slug: string;
  };
}

const fetchPhotos = async (slug: string) => {
  const controller = new AbortController();
  const { signal } = controller;

  try {
    const results = await Promise.allSettled([
      fetch(`${BASE_URL}/api/profile/slug/${slug}/pictures`, {
        next: { revalidate: 3600 },
        signal,
      }),
      fetch(`${BASE_URL}/api/profile/slug/${slug}/igpictures`, {
        next: { revalidate: 3600 },
        signal,
      }),
    ]);

    const data: GalleryPhoto[] = [];

    for (const result of results) {
      if (result.status === "fulfilled" && result.value.ok) {
        const photos = await result.value.json();
        if (Array.isArray(photos)) {
          const processedPhotos = photos.map((photo) => ({
            pictureKey: photo.pictureKey,
            pictureUrl: [photo.pictureUrl[0]],
            timestamp: photo.timestamp,
            type: photo.type,
          }));
          data.push(...processedPhotos);
        }
      }
    }

    return data;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return [];
    }
    throw err;
  } finally {
    controller.abort();
  }
};

const GalleryContent = async ({ params }: GalleryContentProps) => {
  const [{ dictionary }, photos] = await Promise.all([
    getDictionary(),
    fetchPhotos(params.slug),
  ]);

  const images: TPHOTO[] = photos.map((photo) => ({
    id: photo.pictureKey,
    image: photo.pictureUrl[0],
    timestamp: photo.timestamp,
    type: photo.type,
  }));

  let userGallerySchema;
  try {
    userGallerySchema = await getUserGallerySchema({
      userslug: params.slug,
      images,
    });
  } catch (err) {
    console.error("Schema generation error:", err);
  }

  return (
    <>
      {userGallerySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(userGallerySchema),
          }}
        />
      )}
      <section
        className="max-w-[600px] grid grid-cols-3 gap-1 mx-auto"
        style={{
          viewTransitionName: "gallery-section",
          contain: "paint layout",
        }}
      >
        {images.map((image, index) => (
          <SingleImage
            key={image.id}
            {...image}
            index={index}
            priority={index < 6}
          />
        ))}
        {images.length === 0 ? (
          <Noexistence
            className="col-span-3"
            message={dictionary.errors.noPhotos}
          />
        ) : (
          images.length === 20 && <ClientUserGallery userslug={params.slug} />
        )}
      </section>
    </>
  );
};

const Gallery = ({ params }: GalleryContentProps) => (
  <Suspense
    fallback={
      <div className="max-w-[600px] grid grid-cols-3 gap-1 mx-auto animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded" />
        ))}
      </div>
    }
  >
    <GalleryContent params={params} />
  </Suspense>
);

export default Gallery;
