import { BASE_URL, TNEARBYPLACE, TPLACE } from "@/lib/ts";
import { getDefaultPlaceImagePath, getURL, parseAddress } from "..";

export const getPlacePageSchema = async ({
  id,
  slug,
  name,
  description,
  coordinates,
  address,
  image,
  type,
  website,
  tel,
  rating,
  activeTime,
  groups,
}: TPLACE) => {
  const url = `${BASE_URL}/place/${slug}`;
  const metaTitle = name
    ? `${name} | Orbis Rede Geo-Social`
    : "Place | Orbis Rede Geo-Social";
  const metaDescription = description
    ? description
    : "Grupos locais no mapa da sua região";

  const logoUrl = image
    ? await getURL(`placePictures/${image}`)
    : `${BASE_URL}/${getDefaultPlaceImagePath(type)}`;

  const parsedAddress = parseAddress(address);

  const workingHours =
    activeTime && activeTime[0] && activeTime[0].time.split("-");
  const opens = workingHours && workingHours[0] ? workingHours[0] : "10:00";
  const closes = workingHours && workingHours[1] ? workingHours[1] : "05:00";

  return {
    "@context": "https://schema.org/",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${url}/#place`,
        name: name,
        url: website || url,
        description: description,
        logo: {
          "@type": "ImageObject",
          "@id": `${url}/#placelogo`,
          url: logoUrl,
          contentUrl: logoUrl,
          width: 100,
          height: 100,
          caption: name,
        },
        image: {
          "@id": `${url}/#placelogo`,
        },
        priceRange: "0",
        telephone: tel,
        address: {
          "@type": "PostalAddress",
          streetAddress: parsedAddress.street,
          addressLocality: parsedAddress.city,
          postalCode: parsedAddress.postal_code,
          addressCountry: "BR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "https://schema.org/Monday",
            "https://schema.org/Tuesday",
            "https://schema.org/Wednesday",
            "https://schema.org/Thursday",
            "https://schema.org/Friday",
            "https://schema.org/Saturday",
            "https://schema.org/Sunday",
          ],
          opens: opens,
          closes: closes,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rating,
          bestRating: 5,
          worstRating: 1,
          reviewCount: 237,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${url}/#groups`,
        name: metaTitle,
        description: metaDescription,
        itemListElement:
          groups &&
          (await Promise.all(
            groups.map(async (group) => {
              const image = group.image
                ? await getURL(`groupPictures/${group.image}`)
                : `${BASE_URL}/logos/logo.webp`;
              return {
                "@type": "Organization",
                name: group.name,
                url: `${BASE_URL}/group/${group.slug}`,
                image: image,
                logo: image,
                location: {
                  "@id": `${url}/#place`,
                },
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
                    "@id": `${BASE_URL}/#organization`,
                  },
                  {
                    "@id": `${BASE_URL}/#website`,
                  },
                ],
              };
            }),
          )),
      },
      {
        "@type": "WebPage",
        "@id": `${url}/#webpage`,
        mainEntity: [
          {
            "@id": `${url}/#groups`,
          },
          {
            "@id": `${url}/#places`,
          },
          {
            "@id": `${url}/#main`,
          },
        ],
      },
    ],
  };
};

export const getRelatedPlacesSchema = async ({
  placeslug,
  places,
}: {
  placeslug: string;
  places: TNEARBYPLACE[];
}) => {
  return {
    "@context": "https://schema.org/",
    "@type": "ItemList",
    "@id": `${BASE_URL}/place/${placeslug}/#places`,
    name: "Lugares que o grupo frequenta",
    itemListElement: await Promise.all(
      places.map(async (place, index) => {
        const address = parseAddress(place.address);
        const imageUrl = place.image
          ? await getURL(`placePictures/${place.image}`)
          : `${BASE_URL}/${getDefaultPlaceImagePath(place.type)}`;
        return {
          "@type": "LocalBusiness",
          position: index + 1,
          name: place.name,
          url: `${BASE_URL}/place/${place.slug}`,
          logo: imageUrl,
          image: imageUrl,
          priceRange: "0",
          address: {
            "@type": "PostalAddress",
            addressLocality: address.city,
            addressCountry: "BR",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: place.coordinates.latitude,
            longitude: place.coordinates.longitude,
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: place.rating,
            bestRating: 5,
            worstRating: 1,
            reviewCount: 237,
          },
        };
      }),
    ),
  };
};
