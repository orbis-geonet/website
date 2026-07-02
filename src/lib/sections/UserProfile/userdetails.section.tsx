import { StatComponent, Image } from "@components";
import React from "react";
import { default as DefaultUserImage } from "@public/default/user.svg";
import { default as DImage } from "next/image";
import { Dictionary } from "@/lib/locales";

type PROPS = {
  image: string;
  name: string;
  providerImageUrl?: string;
  groupsCount: number;
  followersCount: number;
  followingsCount: number;
  dictionary: Dictionary;
};

const UserDetails: React.FC<PROPS> = ({
  dictionary,
  image,
  providerImageUrl,
  name,
  groupsCount,
  followersCount,
  followingsCount,
}) => {
  return (
    <article className="w-full bg-white md:shadow-moreblurred rounded-xl md:max-w-[520px] md:p-14  mx-auto flex flex-col min-[365px]:flex-row items-center justify-center md:justify-start gap-4 min-[365px]:gap-6 md:gap-10">
      <aside className="min-h-[70px] min-w-[70px] md:min-h-[100px] md:min-w-[100px] ">
        {image ? (
          <Image
            className="rounded-full h-full w-full object-cover"
            alt={`profile-picture of ${name}`}
            src={`profilePictures/${image}`}
            height={100}
            width={100}
          />
        ) : (
          <DImage
            className="rounded-full h-full w-full object-cover"
            alt={`profile-picture of ${name}`}
            src={providerImageUrl ? providerImageUrl : DefaultUserImage}
            height={100}
            width={100}
          />
        )}
      </aside>
      <aside className="space-y-4">
        <h1 className="font-bold text-base md:text-3xl italic text-center min-[365px]:text-start">
          {name}
        </h1>
        <div className="flex items-center gap-8">
          <StatComponent
            title={dictionary.common.groups}
            count={groupsCount}
            tab="groups"
          />
          <StatComponent
            title={dictionary.common.followers}
            count={followersCount}
            tab="followers"
          />
          <StatComponent
            title={dictionary.common.followings}
            count={followingsCount}
            tab="followings"
          />
        </div>
      </aside>
    </article>
  );
};
export default UserDetails;
