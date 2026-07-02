import { BASE_URL, TCOMMENTWITHREPLIES, TPOST } from "@/lib/ts";
import {
  formatDateForSchema,
  formatTimeForSchema,
  getSharedContentSchema,
  getURL,
} from "..";

interface PARAMSTYPE extends TPOST {}

export const getSinglePostPageSchema = async ({
  postid,
  userid,
  userslug,
  username,
  userprofile,
  caption,
  time,
  type,
  mediaSrc,
  commentsCount,
  attendeesCount,
}: PARAMSTYPE) => {
  const title = username;
  const description = caption ? caption : "Post | Orbis Rede Geo-Social";
  const url = `${BASE_URL}/post/${postid}`;
  const image = type === "IMAGE" && mediaSrc ? await getURL(mediaSrc[0]) : "";
  const userimage = userprofile
    ? await getURL(`profilePictures/${userprofile}`)
    : `${BASE_URL}/default/user.svg`;

  return {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    "@id": `${url}/#SocialMediaPosting`,
    name: title,
    url: url,
    description: description,
    headline: title,
    datePublished: `${formatDateForSchema(time)}T${formatTimeForSchema(
      time,
    )}-03:00`,
    inLanguage: "pt",
    image: image && image !== "" ? image : `${BASE_URL}/logos/logo.webp`,
    sharedContent: await getSharedContentSchema({
      caption: caption,
      pagetitle: title,
      pagedescription: description,
      mediaSrc: mediaSrc ? mediaSrc : [""],
      type: type,
      time: time,
    }),
    author: {
      "@type": "Person",
      "@id": `${url}/#author`,
      name: username,
      url: `${BASE_URL}/user/${userslug}`,
      image: userimage,
    },
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/LikeAction",
      userInteractionCount: attendeesCount,
      interactionService: {
        "@id": `${BASE_URL}/#website`,
      },
    },
    commentCount: commentsCount,
    mainEntityOfPage: {
      "@id": `${url}/#webpage`,
    },
    isPartOf: [
      {
        "@id": `${url}/#webpage`,
      },
      {
        "@id": `${BASE_URL}/#website`,
      },
    ],
    publisher: {
      "@id": `${url}/#author`,
    },
    creator: {
      "@id": `${url}/#author`,
    },
    subjectOf: {
      "@id": `${BASE_URL}/#website`,
    },
  };
};

export const getCommentsSchema = async ({
  postid,
  comments,
}: {
  postid: string;
  comments: TCOMMENTWITHREPLIES[];
}) => {
  return {
    "@context": "https://schema.org/",
    "@type": "SocialMediaPosting",
    "@id": `${BASE_URL}/post/${postid}/#SocialMediaPosting`,
    comment: await Promise.all(
      comments.map(async (comment) => {
        return {
          "@type": "Comment",
          text: comment.text,
          author: {
            "@type": "Person",
            name: comment.user.name,
            url: `${BASE_URL}/user/${comment.user.slug}`,
            image: comment.user.image
              ? await getURL(`profilePictures/${comment.user.image}`)
              : `${BASE_URL}/default/user.svg`,
          },
        };
      }),
    ),
  };
};
