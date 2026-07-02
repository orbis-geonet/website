"use client";
import { Image } from "@components";
import React from "react";
import { Typography } from "..";
import Link from "next/link";
import { TSEARCHRESULTGROUP } from "@/lib/ts";

const Groupcard: React.FC<TSEARCHRESULTGROUP> = ({
  id,
  slug,
  name,
  image,
  color,
  membersCount,
  placesCount,
}) => {
  return (
    <article className="bg-white shadow-moreblurred rounded-xl mx-auto">
      <Link
        href={`/group/${slug}`}
        className="p-6 md:px-14 md:py-8 flex items-center gap-6"
      >
        <Image
          style={{ border: `2px solid ${color}` }}
          className="h-[48px] w-[48px] md:h-[60px] md:w-[60px] object-cover rounded-full"
          alt={`${name}'s profile pic`}
          src={`groupPictures/${image}`}
          width={60}
          height={60}
        />
        <div>
          <h2 className="text-base md:text-2xl font-bold hover:underline">
            {name}
          </h2>
          <Typography className="text-xs md:text-base">
            {membersCount}&nbsp;Membros | {placesCount}&nbsp;Lugares
          </Typography>
        </div>
      </Link>
    </article>
  );
};

export default Groupcard;
