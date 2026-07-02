"use client";
import { Image } from "@components";
import React from "react";
import { useRouter } from "next/navigation";
import { TSEARCHRESULTGROUP } from "@/lib/ts";

const Searchsuggestioncard: React.FC<{
  id: string;
  slug: string;
  name: string;
  image: string;
  color?: string;
  setSuggestions: React.Dispatch<
    React.SetStateAction<TSEARCHRESULTGROUP[] | undefined>
  >;
  hideSmallScreenSearchbar: () => void;
  clearQuery: () => void;
}> = ({
  id,
  slug,
  name,
  image,
  color,
  setSuggestions,
  hideSmallScreenSearchbar,
  clearQuery,
}) => {
  const router = useRouter();

  const handleTitleClick = () => {
    setSuggestions([]);
    hideSmallScreenSearchbar();
    router.push(`/group/${slug}`);
    clearQuery();
  };

  return (
    <article className="bg-white border-b mx-auto p-2 md:p-4 flex items-center gap-2 md:gap-4">
      <Image
        style={{ border: `2px solid ${color}` }}
        className="h-[30px] w-[30px] md:h-[40px] md:w-[40px] object-cover rounded-full"
        alt={`${name}'s profile pic`}
        src={`groupPictures/${image}`}
        width={60}
        height={60}
      />
      <h2
        onClick={handleTitleClick}
        className="text-xs md:text-xl font-bold hover:underline w-full truncate cursor-pointer"
      >
        {name}
      </h2>
    </article>
  );
};

export default Searchsuggestioncard;
