import React from "react";
import { Noexistence, Postcard } from "@components";
import {
  getAllPageSchema,
  getData,
  getMediaSrc,
  getSinglePostPageSchema,
  getURL,
} from "@/lib/utils";
import { METAPROPS, TPOST } from "@interface";
import { Metadata } from "next";
import { BASE_URL } from "@/lib/ts";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  params,
}: METAPROPS): Promise<Metadata> => {
  const data = await getData(`posts/${params.id}`);

  if (data.error) {
    return {};
  }

  const imagePath =
    data.mediaUrls && data.mediaUrls[0]
      ? getMediaSrc(data.type, data.mediaUrls[0])
      : "";
  const image =
    imagePath && imagePath !== "" ? await getURL(imagePath) : "/favicon.ico";
  const title = data.user.displayName;
  const description = data.details;
  return {
    title: title,
    openGraph: {
      title: title,
      description: description ? description : "",
      images: [image ? image : "/favicon.ico"],
      url: `${BASE_URL}/post/${params.id}`,
      type: "article",
    },
  };
};

const SinglePostPage = async ({ params }: { params: { id: string } }) => {
  const data = await getData(`posts/${params.id}`);

  if (data.error) return notFound();

  const postData: TPOST = {
    postid: data.postKey,
    userid: data.user.userKey,
    userslug: data.user.slug,
    username: data.user.displayName,
    caption: data.details,
    time: data.createTimestamp,
    userprofile: data.user.imageName,
    mediaSrc:
      data.mediaUrls && data.mediaUrls.length !== 0
        ? data.mediaUrls.map((url: string) => getMediaSrc(data.type, url))
        : [],
    type: data.type,
    commentsCount: data.commentsCount,
    attendeesCount: data.confirmedCount,
    postedAsUser: data.group ? false : true,
    groupid: data.group?.groupKey,
    groupslug: data.group?.slug,
    groupname: data.group?.name,
    groupprofile: data.group?.imageName,
    placeid: data.place?.placeKey,
    placeslug: data.place?.slug,
    placename: data.place?.name,
  };

  const image =
    postData.type === "IMAGE" &&
    postData.mediaSrc &&
    postData.mediaSrc.length > 0 &&
    (await getURL(postData.mediaSrc[0]));

  const allPageSchemaOptions = {
    title: postData.username,
    description: postData.caption
      ? postData.caption
      : "Post | Orbis Rede Geo-Social",
    url: `${BASE_URL}/post/${postData.postid}`,
    mainImage: {
      url: image ? image : `${BASE_URL}/logos/logo.webp`,
      width: image ? 611 : 212,
      height: image ? 440 : 211,
    },
  };

  const allPageSchema = getAllPageSchema(allPageSchemaOptions);
  let singlePostPageSchema;
  try {
    singlePostPageSchema = await getSinglePostPageSchema(postData);
  } catch (err) {
    // console.log(err);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(allPageSchema),
        }}
      />
      {singlePostPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(singlePostPageSchema),
          }}
        />
      )}
      <Postcard {...postData} singlePostPage={true} />;
    </>
  );
};

export default SinglePostPage;
