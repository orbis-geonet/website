import { BASE_URL } from "@/lib/ts";
import { formatDateForSchema, getURL } from "..";

interface PARAMSTYPE {
  pagetitle: string;
  pagedescription: string;
  time: string;
  type: string;
  caption?: string;
  mediaSrc: string[];
}

export const getSharedContentSchema = async ({
  pagetitle,
  pagedescription,
  time,
  type,
  caption,
  mediaSrc,
}: PARAMSTYPE) => {
  switch (type) {
    case "TEXT":
      return {
        text: caption,
      };
    case "IMAGE":
      const imageUrl = mediaSrc[0]
        ? await getURL(mediaSrc[0])
        : `${BASE_URL}/logos/logo.webp`;
      if (caption) {
        return [
          {
            "@type": "ImageObject",
            url: imageUrl,
            contentUrl: imageUrl,
            width: 611,
            height: 440,
            caption: caption,
          },
          {
            text: caption,
          },
        ];
      } else {
        return {
          "@type": "ImageObject",
          url: imageUrl,
          contentUrl: imageUrl,
          width: 611,
          height: 440,
        };
      }
    case "VIDEO":
      const videoUrl = mediaSrc[0]
        ? await getURL(mediaSrc[0])
        : `${BASE_URL}/logos/logo.webp`;
      if (caption) {
        return [
          {
            "@type": "VideoObject",
            name: pagetitle,
            description: caption,
            thumbnailUrl: `${BASE_URL}/logos/logo.webp`,
            embedUrl: videoUrl,
            contentUrl: videoUrl,
            uploadDate: formatDateForSchema(time),
            encodingFormat: "video/mp4",
            potentialAction: {
              "@type": "WatchAction",
              target: videoUrl,
            },
            requiresSubscription: "False",
            isPartOf: {
              "@id": `${BASE_URL}/#website`,
            },
          },
          {
            text: caption,
          },
        ];
      } else {
        return {
          "@type": "VideoObject",
          name: pagetitle,
          description: pagedescription,
          thumbnailUrl: `${BASE_URL}/logos/logo.webp`,
          embedUrl: videoUrl,
          contentUrl: videoUrl,
          uploadDate: formatDateForSchema(time),
          encodingFormat: "video/mp4",
          potentialAction: {
            "@type": "WatchAction",
            target: videoUrl,
          },
          requiresSubscription: "False",
          isPartOf: {
            "@id": `${BASE_URL}/#website`,
          },
        };
      }
    case "AUDIO":
      const audioUrl = mediaSrc
        ? await getURL(mediaSrc[0])
        : `${BASE_URL}/logos/logo.webp`;
      if (caption) {
        return [
          {
            "@type": "VideoObject",
            name: pagetitle,
            description: caption,
            thumbnailUrl: `${BASE_URL}/logos/logo.webp`,
            embedUrl: audioUrl,
            contentUrl: audioUrl,
            uploadDate: formatDateForSchema(time),
            encodingFormat: "audio/mpeg",
            potentialAction: {
              "@type": "ListenAction",
              target: audioUrl,
            },
            requiresSubscription: "False",
            isPartOf: {
              "@id": `${BASE_URL}/#website`,
            },
          },
          {
            text: caption,
          },
        ];
      } else {
        return {
          "@type": "VideoObject",
          name: pagetitle,
          description: pagedescription,
          thumbnailUrl: `${BASE_URL}/logos/logo.webp`,
          embedUrl: audioUrl,
          contentUrl: audioUrl,
          uploadDate: formatDateForSchema(time),
          encodingFormat: "video/mp4",
          potentialAction: {
            "@type": "WatchAction",
            target: audioUrl,
          },
          requiresSubscription: "False",
          isPartOf: {
            "@id": `${BASE_URL}/#website`,
          },
        };
      }
  }
};
