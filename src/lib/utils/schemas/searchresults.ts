import { BASE_URL, TSEARCHRESULTGROUP } from "@/lib/ts";
import { getURL } from "@utils";

export const getSearchResultsPageSchema = async (
  title: string,
  description: string,
  searchQuery: string,
  groups: TSEARCHRESULTGROUP[],
) => {
  const images = await Promise.all(
    groups.map(async (group) => {
      if (group.image) {
        return await getURL(`groupPictures/${group.image}`);
      } else {
        return `${BASE_URL}/logos/logo.webp`;
      }
    }),
  );

  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "@id": `${BASE_URL}/search?q=${searchQuery}/#webpage`,
    mainEntity: {
      "@type": "ItemList",
      name: title,
      description: description,
      itemListElement: images.map((image, index) => {
        const group = groups[index];
        return {
          "@type": "Organization",
          name: group.name,
          description: group.description,
          url: `${BASE_URL}/group/${group.slug}`,
          image: image,
          logo: image,
          numberOfEmployees: group.membersCount,
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
    },
  };
};
