import { BASE_URL, TPLAN } from "@/lib/ts";
import { getData, getURL } from "..";

export const getSubscriptionPageSchema = async ({
  groupId,
  plans,
}: {
  groupId: string;
  plans: TPLAN[];
}) => {
  const pageUrl = `${BASE_URL}/plans/${groupId}`;
  const groupData = await getData(`groups/${groupId}`);

  let groupImage;
  let pagetitle = "Plan | Orbis Rede Geo-Social";
  let pagedescription = "Grupos locais no mapa da sua região";

  if (groupData.error) {
    groupImage = `${BASE_URL}/logos/logo.webp`;
  } else {
    groupImage = groupData.imageName
      ? await getURL(`groupPictures/${groupData.imageName}`)
      : `${BASE_URL}/logos/logo.webp`;
    (pagetitle = `Plan | ${groupData.name} | Orbis Rede Geo-Social`),
      (pagedescription = groupData.description);
  }

  const maxPrice = plans.reduce((max, { price }) => {
    return price > max ? price : max;
  }, plans[0].price);

  const minPrice = plans.reduce((min, { price }) => {
    return price < min ? price : min;
  }, plans[0].price);

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `${pageUrl}/#product`,
    url: pageUrl,
    name: pagetitle,
    description: pagedescription,
    image: groupImage,
    logo: groupImage,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: minPrice,
      highPrice: maxPrice,
      priceCurrency: "USD",
      offerCount: plans.length,
      areaServed: {
        "@type": "Country",
        address: {
          "@type": "PostalAddress",
          addressCountry: "BR",
        },
      },
      availability: "https://schema.org/OnlineOnly",
      offeredBy: {
        "@id": `${BASE_URL}/#organization`,
      },
      seller: {
        "@id": `${BASE_URL}/#organization`,
      },
      offers: plans.map((plan) => {
        return {
          "@type": "Offer",
          name: plan.title,
          description: plan.description,
          url: `${BASE_URL}/subscribe/${plan.id}`,
          price: plan.price,
          priceCurrency: plan.currency,
        };
      }),
    },
    mainEntityOfPage: {
      "@id": `${pageUrl}#webpage`,
    },
  };
};
