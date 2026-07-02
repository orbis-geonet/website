import Link from "next/link";
import { Image } from "..";
import React from "react";
import { Heading } from "..";
import { TUSERGROUP } from "@/lib/ts";

const Groupcardsmall: React.FC<TUSERGROUP> = ({ id, slug, name, image }) => {
  return (
    <article className="bg-white shadow-moreblurred p-4 md:p-6 rounded-xl space-y-2">
      <Link href={"/group/" + slug} className="flex items-center gap-6">
        <Image
          className="h-[48px] w-[48px] md:h-[70px] md:w-[70px] object-cover rounded-full"
          src={`groupPictures/${image}`}
          alt={`${name}'s photo`}
          width={70}
          height={70}
        />
        <Heading type="h4" className="hover:underline flex-1 truncate">
          {name}
        </Heading>
      </Link>
    </article>
  );
};

export default Groupcardsmall;
