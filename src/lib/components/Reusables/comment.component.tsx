import React from "react";
import type { TCOMMENTWITHREPLIES } from "@interface";
import Link from "next/link";
import { Image } from "@components";
import { default as DImage } from "next/image";
import { default as DefaultUserImage } from "@public/default/user.svg";
import { getTimeDifference } from "@/lib/utils";

interface PROPS extends TCOMMENTWITHREPLIES {
  className?: string;
}
const Comment: React.FC<PROPS> = ({
  id,
  user,
  text,
  time,
  replies,
  className = "",
}) => {
  // console.log(user.image)
  return (
    <div className={`p-4 md:p-6 flex gap-4 ${className}`}>
      {user.image ? (
        <Image
          className={"h-[50px] w-[50px] object-cover rounded-full"}
          height={50}
          width={50}
          alt={`profilePicture of ${user.name}`}
          src={`profilePictures/${user.image}`}
        />
      ) : (
        <DImage
          className={"h-[50px] w-[50px] object-cover rounded-full"}
          height={50}
          width={50}
          alt={`profilePicture of ${user.name}`}
          src={DefaultUserImage}
        />
      )}
      <div className="space-y-1 md:space-y-2 flex-1">
        <div className="flex items-center justify-between">
          <Link
            className="hover:underline font-bold text-base md:text-2xl"
            href={`/user/${user.slug}`}
          >
            {user.name}
          </Link>

          <p className="text-[#acacac] text-xs md:text-base text-opacity-70">
            {getTimeDifference(time)}
          </p>
        </div>
        <p className="break-all">{text}</p>

        {replies && replies.length !== 0 && (
          <div className="flex items-center gap-4 font-bold text-[#d2d2d2] pt-4 md:pt-6">
            <span className="text-xs md:text-base">Resposta</span>
            <div className="w-full h-[1px] bg-[#f1f1f1]"></div>
          </div>
        )}
        {replies &&
          replies.length !== 0 &&
          replies.map((reply, index) => (
            <div key={reply.id} className={`p-1 md:p-2 flex gap-2`}>
              {user.image ? (
                <Image
                  className={"h-[30px] w-[30px] object-cover rounded-full"}
                  height={40}
                  width={40}
                  alt={`profilePicture of ${user.name}`}
                  src={`profilePictures/${user.image}`}
                />
              ) : (
                <DImage
                  className={"h-[30px] w-[30px] object-cover rounded-full"}
                  height={40}
                  width={40}
                  alt={`profilePicture of ${user.name}`}
                  src={DefaultUserImage}
                />
              )}
              <p className="text-[#919191] text-xs md:text-base">
                <Link
                  className="hover:underline font-bold text-black"
                  href={`/user/${user.slug}`}
                >
                  {user.name}&nbsp;
                </Link>
                <span className="break-all">{text}</span>
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Comment;
