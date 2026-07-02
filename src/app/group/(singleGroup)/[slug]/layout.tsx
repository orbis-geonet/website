import Image from "next/image";
import React from "react";
import { default as MapBg } from "@public/images/bg/map-bg.webp";
import { MapBanner, Noexistence } from "@components";
import { GroupDetails, GroupNavbar } from "@sections";
import { Metadata } from "next";
import { getAllPageSchema, getData, getGroupPageSchema, getURL } from "@utils";
import { BASE_URL } from "@/lib/ts";
import { getDictionary } from "@/lib/locales";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const data = await getData(`groups/slug/${params.slug}`);
  const { dictionary } = await getDictionary();
  if (data.error) {
    return {};
  }
  const image = await getURL(`groupPictures/${data.imageName}`);
  const title = data.name ? `${data.name}` : dictionary.groupPage.metaTitle;
  const description = data.description;
  return {
    title: title,
    openGraph: {
      title: title,
      description: description ? description : "",
      images: [image],
      type: "profile",
      url: `${BASE_URL}/group/${params.slug}`,
    },
  };
};

export default async function GroupPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const data = await getData(`groups/slug/${params.slug}`);
  const { dictionary } = await getDictionary();

  // if (data.error) return <Noexistence message={dictionary.errors.groupDoesntExist} />;

  if (data.error) return notFound();

  const groupDetails = {
    id: data.groupKey,
    slug: params.slug,
    color: data.strokeColorHex,
    image: `groupPictures/${data.imageName}`,
    name: data.name,
    description: data.description,
    membersCount: data.membersCount,
    offerActivated: data.isSubscriptionActivate,
  };

  const allPageSchemaOptions = {
    title: `${groupDetails.name} | Orbis Rede Geo-Social`,
    description: groupDetails.description
      ? groupDetails.description
      : "Grupos locais no mapa da sua região",
    url: `${BASE_URL}/group/${groupDetails.slug}`,
  };

  const allPageSchema = getAllPageSchema(allPageSchemaOptions);
  let groupPageSchema;
  try {
    groupPageSchema = await getGroupPageSchema(groupDetails);
  } catch (err) {
    // console.log(err);
  }

  return (
    <>
      {/* <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(allPageSchema),
                }}
            /> */}
      {groupPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(groupPageSchema),
          }}
        />
      )}
      <Image
        className="absolute top-0 right-0"
        src={MapBg}
        alt="bg-image"
        height={765}
        width={675}
        priority
      />
      <main className="relative z-10">
        <section className="relative z-10 mb-4 pt-7 pb-4 max-w-6xl mx-auto">
          <GroupDetails dictionary={dictionary} {...groupDetails} />
          <MapBanner className="mt-6 md:mt-12" allowClosing={false} />
        </section>
        <GroupNavbar dictionary={dictionary} />
        {children}
      </main>
    </>
  );
}
