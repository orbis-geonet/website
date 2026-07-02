import { BASE_URL } from "@/lib/ts";

export const getAllPageSchema = ({
  title,
  description,
  url,
  mainImage,
}: {
  title?: string;
  description?: string;
  url: string;
  mainImage?: {
    url: string;
    height: number;
    width: number;
  };
}) => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}/#webpage`,
        url: `${url}/`,
        name: title ? title : "Orbis Rede Geo-Social",
        description: description
          ? description
          : "Grupos locais no mapa da sua região",
        headline: "Grupos locais no mapa da sua região",
        inLanguage: "pt",
        primaryImageOfPage: {
          "@id": `${url}/#primaryimage`,
        },
        image: {
          "@id": `${url}/#primaryimage`,
        },
        thumbnailUrl: mainImage ? mainImage.url : `${BASE_URL}/logos/logo.webp`,
        potentialAction: [
          {
            "@type": "ReadAction",
            target: `${url}/`,
          },
        ],
        usageInfo: [`${BASE_URL}/privacy`, `${BASE_URL}/tos`],
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Orbis",
              item: `${BASE_URL}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: title ? title : "Orbis Rede Geo-Social",
              item: url,
            },
          ],
        },
        mentions: {
          "@id": `${BASE_URL}/#MobileApplication`,
        },
        reviewedBy: {
          "@id": `${BASE_URL}/#organization`,
        },
        publisher: {
          "@id": `${BASE_URL}/#organization`,
        },
        copyrightHolder: {
          "@id": `${BASE_URL}/#organization`,
        },
        author: {
          "@id": `${BASE_URL}/#organization`,
        },
        creator: {
          "@id": `${BASE_URL}/#organization`,
        },
        provider: {
          "@id": `${BASE_URL}/#organization`,
        },
        isPartOf: {
          "@id": `${BASE_URL}/#website`,
        },
      },
      {
        "@type": "ImageObject",
        "@id": `${url}/#primaryimage`,
        url: mainImage ? mainImage.url : `${BASE_URL}/logos/logo.webp`,
        contentUrl: mainImage ? mainImage.url : `${BASE_URL}/logos/logo.webp`,
        width: mainImage ? mainImage.width : 212,
        height: mainImage ? mainImage.height : 211,
        caption: title ? title : "Orbis Rede Geo-Social",
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "Orbis",
        url: `${BASE_URL}/`,
        description:
          "Rede social feita para mapear as comunidades locais da sua região. Com o Orbis, você pode descobrir grupos sociais ao seu redor.",
        email: "info@orbis.social",
        areaServed: {
          "@type": "Country",
          address: {
            "@type": "PostalAddress",
            addressCountry: "BR",
          },
        },
        sameAs: [
          "instagram.com/orbis.rede.geo.social",
          "tiktok.com/orbis.social",
        ],
        logo: {
          "@id": `${BASE_URL}/#logo`,
        },
        image: {
          "@id": `${BASE_URL}/#logo`,
        },
        brand: {
          "@type": "Brand",
          name: "Orbis",
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: "BR",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          itemListElement: {
            "@id": `${BASE_URL}/#MobileApplication`,
          },
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Privacy Policy",
            url: `${BASE_URL}/privacy`,
          },
          {
            "@type": "PropertyValue",
            name: "Terms of Use",
            url: `${BASE_URL}/tos`,
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          "@id": `${BASE_URL}/#AggregateRating`,
          ratingValue: "4.1",
          reviewCount: "523",
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "ImageObject",
        "@id": `${BASE_URL}/#logo`,
        url: `${BASE_URL}/logos/logo.webp`,
        contentUrl: `${BASE_URL}/logos/logo.webp`,
        width: 212,
        height: 211,
        caption: "Orbis",
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: `${BASE_URL}/`,
        name: "Orbis",
        description:
          "Rede social feita para mapear as comunidades locais da sua região. Com o Orbis, você pode descobrir grupos sociais ao seu redor.",
        inLanguage: "pt",
        image: {
          "@id": `${BASE_URL}/#logo`,
        },
        usageInfo: [`${BASE_URL}/privacy`, `${BASE_URL}/tos`],
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        ],
        about: {
          "@id": `${BASE_URL}/#organization`,
        },
        publisher: {
          "@id": `${BASE_URL}/#organization`,
        },
        copyrightHolder: {
          "@id": `${BASE_URL}/#organization`,
        },
        author: {
          "@id": `${BASE_URL}/#organization`,
        },
        creator: {
          "@id": `${BASE_URL}/#organization`,
        },
        provider: {
          "@id": `${BASE_URL}/#organization`,
        },
        mentions: {
          "@id": `${BASE_URL}/#MobileApplication`,
        },
      },
      {
        "@type": "MobileApplication",
        "@id": `${BASE_URL}/#MobileApplication`,
        name: "Orbis",
        operatingSystem: ["Android", "iOS"],
        applicationCategory:
          "https://en.wikipedia.org/wiki/Social_networking_service",
        url: [
          "https://apps.apple.com/br/app/orbis-rede-geo-social/id1453025529",
          "https://play.google.com/store/apps/details?id=com.orbis.orbis&rdid=com.orbis.orbis",
        ],
        installUrl: [
          "https://apps.apple.com/br/app/orbis-rede-geo-social/id1453025529",
          "https://play.google.com/store/apps/details?id=com.orbis.orbis&rdid=com.orbis.orbis",
        ],
        image: {
          "@id": `${BASE_URL}/#logo`,
        },
        countriesSupported: "BR",
        offers: {
          "@type": "Offer",
          name: "Orbis",
          url: [
            "https://apps.apple.com/br/app/orbis-rede-geo-social/id1453025529",
            "https://play.google.com/store/apps/details?id=com.orbis.orbis&rdid=com.orbis.orbis",
          ],
          price: 0,
          priceCurrency: "USD",
          availability: "https://schema.org/OnlineOnly",
        },
        aggregateRating: {
          "@id": `${BASE_URL}/#AggregateRating`,
        },
      },
    ],
  };
};
