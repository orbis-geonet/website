import React from "react";
import Link from "next/link";
import { Image } from "@components";
import { Rating, Heading } from "..";
import { TNEARBYPLACE } from "@/lib/ts";
import { default as DImage } from "next/image";
import { getDefaultPlaceImage } from "@/lib/utils";

const Nearbyplacecard: React.FC<TNEARBYPLACE> = ({
  id,
  slug,
  rating,
  name,
  color,
  image,
  type,
}) => {
  return (
    <article className="bg-white shadow-light rounded-xl space-y-2 overflow-hidden">
      <Link href={"/place/" + slug} className="flex items-center gap-6 p-6">
        {image ? (
          <Image
            style={{
              border: `2px solid ${color ? color : "#6DFFB1"}`,
            }}
            className="h-[48px] w-[48px] md:h-[70px] md:w-[70px] rounded-full"
            src={`placePictures/${image}`}
            alt={`${name}'s photo`}
            width={70}
            height={70}
          />
        ) : (
          <DImage
            style={{
              border: `2px solid ${color ? color : "#6DFFB1"}`,
            }}
            className="h-[48px] w-[48px] aspect-square md:h-[70px] md:w-[70px] rounded-full"
            src={getDefaultPlaceImage(type)}
            alt={`${name}'s photo`}
            width={70}
            height={70}
          />
        )}
        <div className="flex-1 w-full">
          <Heading type="h4" className="hover:underline w-2/3 truncate">
            {name}
          </Heading>
          <div className="flex items-center text-xs md:text-base">
            <Rating value={rating} />
          </div>
        </div>
      </Link>
    </article>
  );
};

export default Nearbyplacecard;
