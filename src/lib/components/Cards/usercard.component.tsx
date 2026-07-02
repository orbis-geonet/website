import { Image } from "@components";
import Link from "next/link";
import React from "react";
import { Heading } from "..";
import { TUSER } from "@/lib/ts/interface";
import { default as DImage } from "next/image";
import { default as DefaultUserImage } from "@public/default/user.svg";

const Usercard: React.FC<TUSER> = ({ id, slug, name, image }) => {
  return (
    <article className="bg-white shadow-moreblurred p-4 md:p-6 rounded-xl space-y-2">
      <Link href={"/user/" + slug} className="flex items-center gap-6">
        {image ? (
          <Image
            className="h-[48px] w-[48px] md:h-[70px] md:w-[70px] object-cover rounded-full"
            src={`profilePictures/${image}`}
            alt={`${name}'s photo`}
            width={70}
            height={70}
          />
        ) : (
          <DImage
            className="h-[48px] w-[48px] md:h-[70px] md:w-[70px] object-cover rounded-full"
            src={DefaultUserImage}
            alt={`${name}'s photo`}
            width={70}
            height={70}
          />
        )}
        <Heading type="h4" className="hover:underline flex-1 truncate">
          {name}
        </Heading>
      </Link>
    </article>
  );
};

export default Usercard;
