import { BASE_URL, TPHOTO, TUSER, TUSERGROUP } from "@/lib/ts";
import { formatDateForSchema, getURL } from "..";

export const getUserPageSchema = async ({ id, slug, image, name }: TUSER) => {
  const url = `${BASE_URL}/user/${slug}`;
  const imageUrl = image
    ? await getURL(`profilePictures/${image}`)
    : `${BASE_URL}/default/user.svg`;

  return {
    "@context": "https://schema.org/",
    "@type": "Person",
    "@id": `${url}#person`,
    name: name,
    url: url,
    description: "Grupos locais no mapa da sua região",
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      contentUrl: imageUrl,
      width: 100,
      height: 100,
      caption: name,
    },
  };
};

export const getUserGallerySchema = async ({
  userslug,
  images,
}: {
  userslug: string;
  images: TPHOTO[];
}) => {
  const pageUrl = `${BASE_URL}/user/${userslug}/`;

  const imageItems =
    images &&
    (await Promise.all(
      images.map(async (image, index) => {
        let imageUrl = `${BASE_URL}/logos/logo.webp`;
        if (image.image) {
          if (image.type === "INSTAGRAM") {
            imageUrl = image.image;
          } else {
            imageUrl = await getURL(`user/pictures/${image.image}`);
          }
        }

        return {
          "@type": "ImageObject",
          "@id": `${pageUrl}image-${index}`,
          url: imageUrl,
          contentUrl: imageUrl,
          width: 200,
          height: 200,
          requiresSubscription: "False",
          uploadDate: formatDateForSchema(image.timestamp),
          creditText: "Orbis - Copyright",
          copyrightNotice: "Orbis - Copyright",
          acquireLicensePage: `${BASE_URL}/tos`,
          license: `${BASE_URL}/tos`,
          author: {
            "@id": `${pageUrl}#person`,
          },
          publisher: {
            "@id": `${pageUrl}#person`,
          },
          creator: {
            "@id": `${pageUrl}#person`,
          },
          subjectOf: {
            "@id": `${BASE_URL}#website`,
          },
          isPartOf: {
            "@id": `${BASE_URL}#website`,
          },
        };
      }),
    ));

  return {
    "@context": "https://schema.org/",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    mainEntity: [
      {
        "@type": "ImageGallery",
        "@id": `${pageUrl}#ImageGallery`,
        name: "Orbis Rede Geo-Social",
        url: pageUrl,
        description: "Grupos locais no mapa da sua região",
        inLanguage: "pt",
        mainEntity: imageItems,
        author: {
          "@id": `${pageUrl}#person`,
        },
        publisher: {
          "@id": `${pageUrl}#person`,
        },
        creator: {
          "@id": `${pageUrl}#person`,
        },
        subjectOf: {
          "@id": `${BASE_URL}#website`,
        },
        isPartOf: {
          "@id": `${BASE_URL}#website`,
        },
      },
    ],
  };
};

export const getUsersGroupSchema = async ({
  userslug,
  groups,
}: {
  userslug: string;
  groups: TUSERGROUP[];
}) => {
  const pageUrl = `${BASE_URL}/user/${userslug}/`;

  const groupItems =
    groups &&
    (await Promise.all(
      groups.map(async (group, index) => {
        const imageUrl = group.image
          ? await getURL(`groupPictures/${group.image}`)
          : `${BASE_URL}/logos/logo.webp`;

        return {
          "@type": "Organization",
          "@id": `${pageUrl}#organization-${index}`,
          name: group.name,
          description: group.description,
          url: `${BASE_URL}/group/${group.slug}`,
          image: imageUrl,
          logo: imageUrl,
          address: {
            "@type": "PostalAddress",
            addressCountry: "BR",
          },
          areaServed: {
            "@type": "Country",
            address: {
              "@type": "PostalAddress",
              addressCountry: "BR",
            },
          },
          subjectOf: [
            {
              "@id": `${BASE_URL}#organization`,
            },
            {
              "@id": `${BASE_URL}#website`,
            },
          ],
        };
      }),
    ));

  return {
    "@context": "https://schema.org/",
    "@type": "Person",
    "@id": `${pageUrl}#person`,
    mainEntityOfPage: {
      "@id": `${pageUrl}#webpage`,
    },
    memberOf: groupItems,
  };
};
