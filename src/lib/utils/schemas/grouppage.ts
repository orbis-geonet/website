import { BASE_URL, TUSER } from "@/lib/ts";
import { getURL, parseAddress } from "..";

export const getGroupPageSchema = async ({
  slug,
  image,
  name,
  description,
  membersCount,
}: {
  slug: string;
  image: string;
  name: string;
  description: string;
  membersCount: number;
}) => {
  const pageUrl = `${BASE_URL}/group/${slug}`;

  const imageUrl = image
    ? await getURL(`groupPictures/${image}`)
    : `${BASE_URL}/logos/logo.webp`;

  return {
    "@context": "https://schema.org/",
    "@type": "Organization",
    "@id": `${pageUrl}#group`,
    name: name,
    url: pageUrl,
    description: description
      ? description
      : "Grupos locais no mapa da sua região",
    logo: {
      "@type": "ImageObject",
      "@id": `${pageUrl}#grouplogo`,
      url: imageUrl,
      contentUrl: imageUrl,
      width: image ? 300 : 212,
      height: image ? 300 : 211,
      caption: name,
    },
    image: {
      "@id": `${pageUrl}#grouplogo`,
    },
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: membersCount,
    },
    areaServed: {
      "@type": "Country",
      address: {
        "@type": "PostalAddress",
        addressCountry: "BR",
      },
    },
    brand: {
      "@type": "Brand",
      name: name,
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "BR",
    },
    subjectOf: {
      "@id": `${pageUrl}#webpage`,
    },
    makesOffer: {
      "@type": "Offer",
      name: `Plan | ${name} | Orbis Rede Geo-Social`,
      url: `${BASE_URL}/plans/${slug}`,
    },
  };
};

export const getGroupMembersSchema = async ({
  url,
  members,
}: {
  url: string;
  members: TUSER[];
}) => {
  const memberItems = await Promise.all(
    members.map(async (member, index) => {
      const imageUrl = member.image
        ? await getURL(`profilePictures/${member.image}`)
        : `${BASE_URL}/default/user.svg`;
      return {
        "@type": "Person",
        "@id": `${url}#member-${index}`,
        name: member.name,
        url: `${BASE_URL}/user/${member.slug}`,
        image: imageUrl,
      };
    }),
  );

  return {
    "@context": "https://schema.org/",
    "@type": "Organization",
    "@id": `${url}#group`,
    member: memberItems,
  };
};

export const getGroupPlacesSchema = async ({
  url,
  places,
}: {
  url: string;
  places: {
    id: string;
    name: string;
    address: string;
  }[];
}) => {
  const locationItems = await Promise.all(
    places.map(async (place, index) => {
      const address = parseAddress(place.address);
      return {
        "@type": "PostalAddress",
        "@id": `${url}#location-${index}`,
        streetAddress: address.street,
        addressLocality: address.city,
        addressCountry: "BR",
      };
    }),
  );

  return {
    "@context": "https://schema.org/",
    "@type": "Organization",
    "@id": `${url}#group`,
    location: locationItems,
  };
};
