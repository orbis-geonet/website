import { TUSER, TUSERS } from "../../ts";

export const usersMapper = (data: any, feedLocation?: string) => {
  const users: TUSERS = data.map((user: any) => {
    if (feedLocation === "userprofile") {
      const temp: TUSER = {
        slug: user.user?.slug,
        id: user.user?.userKey,
        name: user.user?.displayName,
        image: user.user?.imageName,
        providerImageUrl: user.user?.providerImageUrl,
      };
      return temp;
    }
    const temp: TUSER = {
      slug: user.slug,
      id: user.userKey,
      name: user.displayName,
      image: user.imageName,
      providerImageUrl: user.user?.providerImageUrl,
    };
    return temp;
  });

  return users ? users : [];
};
