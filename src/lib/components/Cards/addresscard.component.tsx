"use client";
import Link from "next/link";
import React from "react";

type PROPS = {
  slug: string;
  id: string;
  name: string;
  address: string;
};

const Addresscard: React.FC<PROPS> = ({ id, slug, name, address }) => {
  return (
    <article className="bg-white shadow-moreblurred py-4 md:py-10 px-6 md:px-14 rounded-xl space-y-2">
      <Link href={`/place/${slug}`}>
        <p className="font-bold text-base md:text-2xl hover:underline">
          {name}
        </p>
      </Link>{" "}
      {address && (
        <p className="text-xs md:text-base text-[#636363]">{address}</p>
      )}
    </article>
  );
};

export default Addresscard;
