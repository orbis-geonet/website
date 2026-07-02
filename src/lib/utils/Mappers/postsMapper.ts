import { getMediaSrc } from "..";
import { TCHECKIN, TEVENTPOST, TPOST } from "../../ts";

export const postsMapper = (data?: any) => {
  if (!data) return [];
  const posts: (TPOST | TEVENTPOST | { type: string; checkins: TCHECKIN[] })[] =
    data?.content?.map(
      ({ type, post, slider }: { type: string; post: any; slider: any }) => {
        if (type === "SLIDER") {
          const temp = slider.map((checkin: any) => {
            const checkinHolder: TCHECKIN = {
              postid: checkin.postKey,
              userid: checkin.user.userKey,
              placeid: checkin.place.placeKey,
              userslug: checkin.user.slug,
              groupslug: checkin.group.slug,
              placeslug: checkin.place.slug,
              placetype: checkin.place.type,
              userProviderImageUrl: checkin.user.providerImageUrl,
              username: checkin.user.displayName,
              placename: checkin.place.name,
              placeprofile: checkin.place.imageName,
              caption: checkin.details,
              time: checkin.timestamp,
              userprofile: checkin.user.imageName,
              type: checkin.type,
              commentsCount: checkin.commentsCount,
              attendeesCount: checkin.confirmedCount,
              groupid: checkin.group.groupKey,
              groupname: checkin.group.name,
              groupprofile: checkin.group.imageName,
              groupcolor: checkin.group.strokeColorHex,
            };

            return checkinHolder;
          });

          return { type: "CHECKIN", checkins: temp };
        }

        if (post.type === "EVENT") {
          const temp: TEVENTPOST = {
            id: post.postKey,
            title: post.title,
            details: post.details,
            type: "EVENT",
            mediaSrc:
              post.mediaUrls && post.mediaUrls.length !== 0
                ? post.mediaUrls[0]
                : "",
            starttime: post.plannedTime,
            endtime: post.plannedEndTime,
            placeslug: post.place?.slug,
            placeid: post.place?.placeKey,
            placename: post.place?.name,
            placeaddress: post.place?.address,
          };
          return temp;
        }

        const temp: TPOST = {
          postid: post.postKey,
          userid: post.user.userKey,
          username: post.user.displayName,
          userslug: post.user.slug,
          userProviderImageUrl: post.user.userProviderImageUrl,
          groupslug: post.group?.slug,
          placeslug: post.place?.slug,
          caption: post.details,
          time: post.createTimestamp,
          userprofile: post.user.imageName,
          mediaSrc:
            post.mediaUrls && post.mediaUrls.length !== 0
              ? post.mediaUrls.map((url: string) => getMediaSrc(post.type, url))
              : [],
          type: post.type,
          commentsCount: post.commentsCount,
          attendeesCount: post.confirmedCount,
          postedAsUser: post.group ? false : true,
          groupid: post.group?.groupKey,
          groupname: post.group?.name,
          groupprofile: post.group?.imageName,
          groupcolor: post.group?.strokeColorHex,
          placeid: post.place?.placeKey,
          placename: post.place?.name,
        };
        return temp;
      },
    );

  return posts ? posts : [];
};
