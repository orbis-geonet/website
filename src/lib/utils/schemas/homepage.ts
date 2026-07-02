import { BASE_URL } from "@/lib/ts";

export const getHomepageSchema = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/#webpage`,
        url: `${BASE_URL}/`,
        name: "Orbis Rede Geo-Social",
        description:
          "Rede social feita para mapear as comunidades locais da sua região. Com o Orbis, você pode descobrir grupos sociais ao seu redor.",
        headline: "Grupos locais no mapa da sua região",
        inLanguage: "pt",
        primaryImageOfPage: {
          "@id": `${BASE_URL}/#primaryimage`,
        },
        image: {
          "@id": `${BASE_URL}/#primaryimage`,
        },
        thumbnailUrl: `${BASE_URL}/images/home/hero-section-mobile.webp`,
        potentialAction: [
          {
            "@type": "ReadAction",
            target: `${BASE_URL}/`,
          },
        ],
        usageInfo: [`${BASE_URL}/privacy`, `${BASE_URL}/tos`],
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: {
            "@type": "ListItem",
            position: 1,
            name: "Orbis",
            item: `${BASE_URL}/`,
          },
        },
        mainEntity: [
          {
            "@type": "VideoObject",
            name: "Crie ofertas no seu clube de membros no Orbis",
            description: "Baixe iOS & Android no www.orbis.social",
            thumbnailUrl: `${BASE_URL}/images/home/ytthumbnail1.jpg`,
            embedUrl: "https://youtu.be/csZCWXMIJoU",
            duration: "PT0M30S",
            uploadDate: "2023-08-15",
            encodingFormat: "video/mp4",
            about: {
              "@id": `${BASE_URL}/#MobileApplication`,
            },
            potentialAction: {
              "@type": "WatchAction",
              target: "https://youtu.be/csZCWXMIJoU",
            },
            inLanguage: "pt",
            requiresSubscription: "False",
            isPartOf: {
              "@id": `${BASE_URL}/#website`,
            },
          },
          {
            "@type": "VideoObject",
            name: "Descubra como usar o Orbis. Junte-se a comunidades locais.",
            description: "Baixe para iOS e Android no www.orbis.social",
            thumbnailUrl: `${BASE_URL}/images/home/ytthumbnail2.jpg`,
            embedUrl: "https://youtu.be/Ip8vAvPh1w0",
            duration: "PT0M35S",
            uploadDate: "2023-08-15",
            encodingFormat: "video/mp4",
            about: {
              "@id": `${BASE_URL}/#MobileApplication`,
            },
            potentialAction: {
              "@type": "WatchAction",
              target: "https://youtu.be/Ip8vAvPh1w0",
            },
            inLanguage: "pt",
            requiresSubscription: "False",
            isPartOf: {
              "@id": `${BASE_URL}/#website`,
            },
          },
          {
            "@type": "HowTo",
            name: "Orbis Rede Geo-Social",
            description:
              "Rede social feita para mapear as comunidades locais da sua região. Com o Orbis, você pode descobrir grupos sociais ao seu redor.",
            url: `${BASE_URL}/`,
            totalTime: "PT10M",
            tool: {
              "@type": "HowToTool",
              "@id": `${BASE_URL}/#MobileApplication`,
            },
            supply: {
              "@type": "HowToSupply",
              name: "time",
            },
            step: [
              {
                "@type": "HowToStep",
                url: `${BASE_URL}/`,
                name: "Step 1",
                image: `${BASE_URL}/images/home/feature1.svg`,
                text: "Crie ou participe de um grupo.",
              },
              {
                "@type": "HowToStep",
                url: `${BASE_URL}/`,
                name: "Step 2",
                image: `${BASE_URL}/images/home/feature2.svg`,
                text: "Faça check-in em lugares com seu grupo e marque seu território no mapa com o símbolo do grupo.",
              },
              {
                "@type": "HowToStep",
                url: `${BASE_URL}/`,
                name: "Step 3",
                image: `${BASE_URL}/images/home/feature3.svg`,
                text: "Compita pela posse de locais com outros grupos fazendo check-in.",
              },
              {
                "@type": "HowToStep",
                url: `${BASE_URL}/`,
                name: "Step 4",
                image: `${BASE_URL}/images/home/feature4.svg`,
                text: "Quanto mais check-ins houver em um lugar, maior será o círculo do grupo em torno dele. Então diga aos seus amigos para fazer check-in",
              },
              {
                "@type": "HowToStep",
                url: `${BASE_URL}/`,
                name: "Step 5",
                image: `${BASE_URL}/images/home/feature5.svg`,
                text: "Faça check-in em lugares com seu grupo e marque seu território no mapa com o símbolo do grupo.",
              },
              {
                "@type": "HowToStep",
                url: `${BASE_URL}/`,
                name: "Step 6",
                image: `${BASE_URL}/images/home/feature6.svg`,
                text: "Crie um clube de membros dentro do seu grupo e monetize seu uso do Orbis. Venda assinaturas, ingressos, benefícios e muito mais.",
              },
            ],
          },
        ],
        mentions: {
          "@id": `${BASE_URL}/#MobileApplication`,
        },
        isPartOf: {
          "@id": `${BASE_URL}/#website`,
        },
      },
      {
        "@type": "ImageObject",
        "@id": `${BASE_URL}/#primaryimage`,
        url: `${BASE_URL}/images/home/hero-section-mobile.webp`,
        contentUrl: `${BASE_URL}/images/home/hero-section-mobile.webp`,
        width: 1953,
        height: 1953,
        caption: "Orbis Rede Geo-Social",
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
          itemListElement: [
            {
              "@id": `${BASE_URL}/#MobileApplication`,
            },
            {
              "@type": "Service",
              name: "Monetize sua comunidade",
              description:
                "Venda assinaturas, ingressos, benefícios e pacotes parcelados para os membros do seu grupo.",
              url: "https://calendly.com/orbis-social/15min?month=2023-08",
            },
          ],
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
        mainEntityOfPage: {
          "@id": `${BASE_URL}/#webpage`,
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
