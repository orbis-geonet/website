import { BASE_URL, TCHECKIN, TEVENT, TEVENTPOST, TPOST } from "@/lib/ts";
import { getEventSchema, getSharedContentSchema } from ".";
import { formatDateForSchema, formatTimeForSchema, getURL } from "..";

export const getPostFeedSchema = async ({
  url,
  pagetitle,
  pagedescription,
  posts,
  id,
}: {
  url: string;
  pagetitle: string;
  pagedescription: string;
  posts: (TPOST | TEVENTPOST | { type: string; checkins: TCHECKIN[] })[];
  id?: string;
}) => {
  return {
    "@context": "https://schema.org/",
    "@type": "WebPage",
    "@id": `${url}/#${id ? id : "webpage"}`,
    mainEntity:
      posts &&
      (await Promise.all(
        posts.map(async (post) => {
          if (post.type === "CHECKIN") {
            const postWithCheckins = post as {
              type: string;
              checkins: TCHECKIN[];
            };
            const checkinsHolder = await Promise.all(
              postWithCheckins.checkins.map(async (checkin) => {
                return await getCheckinSchema(checkin);
              }),
            );
            return checkinsHolder;
          }

          if (post.type === "EVENT") {
            return await getEventSchema({ event: post as TEVENT });
          }

          const temp = post as TPOST;

          return {
            "@type": "SocialMediaPosting",
            url: `${BASE_URL}/post/${temp.postid}`,
            headline: temp.username,
            image: temp.userprofile
              ? await getURL(`profilePictures/${temp.userprofile}`)
              : `${BASE_URL}/default/user.svg`,
            datePublished: `${formatDateForSchema(
              temp.time,
            )}T${formatTimeForSchema(temp.time)}-03:00`,
            inLanguage: "pt",
            sharedContent: await getSharedContentSchema({
              caption: temp.caption,
              pagetitle: pagetitle,
              pagedescription: pagedescription,
              mediaSrc: temp.mediaSrc ? temp.mediaSrc : [""],
              type: temp.type,
              time: temp.time,
            }),
            interactionStatistic: {
              "@type": "InteractionCounter",
              interactionType: "https://schema.org/LikeAction",
              userInteractionCount: temp.attendeesCount,
              interactionService: {
                "@id": `${BASE_URL}/#website`,
              },
            },
            commentCount: temp.commentsCount,
            author: {
              "@type": "Person",
              "@id": `${url}/#person`,
              name: temp.username,
              url: `${BASE_URL}/user/${temp.userslug}`,
              image: temp.userprofile
                ? await getURL(`profilePictures/${temp.userprofile}`)
                : `${BASE_URL}/default/user.svg`,
            },
            publisher: {
              "@id": `${url}/#person`,
            },
            creator: {
              "@id": `${url}/#person`,
            },
            subjectOf: {
              "@id": `${BASE_URL}/#website`,
            },
            isPartOf: {
              "@id": `${BASE_URL}/#website`,
            },
          };
        }),
      )),
  };
};

const getCheckinSchema = async (checkin: TCHECKIN) => {
  const groupImg = checkin.groupprofile
    ? await getURL(`groupPictures/${checkin.groupprofile}`)
    : `${BASE_URL}/logos/logo.webp`;
  return {
    "@type": "Message",
    about: {
      "@type": "Organization",
      name: checkin.groupname,
      url: `${BASE_URL}/group/${checkin.groupslug}`,
      image: groupImg,
      logo: groupImg,
      potentialAction: {
        "@type": "CheckInAction",
        agent: {
          "@type": "Person",
          name: checkin.username,
          url: `${BASE_URL}/user/${checkin.userslug}`,
          image: checkin.userprofile
            ? await getURL(`profilePictures/${checkin.userprofile}`)
            : `${BASE_URL}/default/user.svg`,
        },
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
    },
  };
};
