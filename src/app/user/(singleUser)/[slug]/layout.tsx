import React from "react";
import { default as MapBg } from "@public/images/bg/map-fullwidth.webp";
import Image from "next/image";
import { UserDetails, UserNavbar } from "@sections";
import { MapBanner, Noexistence, ScrollToTop } from "@components";
import { Metadata } from "next";
import {
  getAllPageSchema,
  getData,
  getURL,
  getUserPageSchema,
} from "@/lib/utils";
import { BASE_URL } from "@/lib/ts";
import { getDictionary } from "@/lib/locales";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const data = await getData(`profile/slug/${params.slug}`);
  const { dictionary } = await getDictionary();
  const image = data.imageName
    ? await getURL(`profilePictures/${data.imageName}`)
    : "/default/user.png";
  const title = data.displayName ? data.displayName : dictionary.user.metaTitle;

  return {
    title: title,
    openGraph: {
      title: title,
      images: [image],
      url: `${BASE_URL}/user/${params.slug}`,
      type: "profile",
    },
  };
};

const UserProfileLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
  const data = await getData(`profile/slug/${params.slug}`);
  const { dictionary } = await getDictionary();
  // if (data.error)
  //     return (
  //         <main className="max-w-6xl mx-auto p-10 font-bold text-2xl">
  //             <Noexistence message={dictionary.errors.userDoesntExist} />;
  //         </main>
  //     );
  if (data.error) notFound();

  const userDetails = {
    id: data.userKey,
    slug: params.slug,
    name: data.displayName,
    image: data.imageName,
    providerImageUrl: data.providerImageUrl,
    groupsCount: data.followedGroups,
    followersCount: data.totalFollowers,
    followingsCount: data.totalFollowing,
  };

  const allPageSchemaOptions = {
    title: `${userDetails.name} | Orbis Rede Geo-Social`,
    description: "Grupos locais no mapa da sua região",
    url: `${BASE_URL}/user/${params.slug}`,
  };

  const allPageSchema = getAllPageSchema(allPageSchemaOptions);
  let userPageSchema;
  try {
    userPageSchema = await getUserPageSchema(userDetails);
  } catch (err) {
    console.log(err);
  }

  return (
    <>
      {/* <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(allPageSchema),
                }}
            /> */}
      {userPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(userPageSchema),
          }}
        />
      )}

      <ScrollToTop />

      <main className="max-w-6xl mx-auto">
        <Image
          className="absolute inset-0 bottom-auto"
          src={MapBg}
          alt="bg-image"
          priority
        />
        <MapBanner className="mt-4" />
        <section className="relative z-10 md:mb-14 pt-14 md:pb-4">
          <UserDetails dictionary={dictionary} {...userDetails} />
        </section>
        <UserNavbar dictionary={dictionary} />
        {children}
      </main>
    </>
  );
};

export default UserProfileLayout;
