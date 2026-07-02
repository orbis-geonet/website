"use client";

import React from "react";
import { AttendeeButton, CommentButton, Image, Typography } from "@components";
import { default as CheckinIcon } from "@public/icons/checkin.svg";
import { TCHECKIN } from "@interface";
import Link from "next/link";
import { default as DImage } from "next/image";
import { default as DefaultUserImage } from "@public/default/user.svg";
import { cn, formatTime, getDefaultPlaceImage } from "@/lib/utils";

interface PROPS {
  checkin: TCHECKIN;
  handleOpen: () => void;
  isSmall?: boolean;
}

const Checkincard: React.FC<PROPS> = ({ checkin, handleOpen, isSmall }) => {
  const linkTarget = isSmall ? "_blank" : "-self";

  return (
    <article
      className={cn(
        "h-[275px] w-full",
        isSmall ? "h-fit" : "min-[500px]:h-[400px]",
      )}
    >
      <div className="flex gap-4">
        {checkin.groupprofile && (
          <Image
            style={{
              border: `3px solid ${checkin.groupcolor}`,
            }}
            className={cn(
              isSmall
                ? "h-[40px] w-[40px]"
                : "h-[50px] w-[50px] md:h-[60px] md:w-[60px]",
              " object-cover rounded-full",
            )}
            height={60}
            width={60}
            src={`groupPictures/${checkin.groupprofile}`}
            alt={`${checkin.groupname}'s profile image`}
          />
        )}
        <div>
          <Link
            target={linkTarget}
            className="hover:underline"
            href={`/group/${checkin.groupslug}`}
          >
            <h2
              className={cn(
                "text-base font-bold",
                isSmall ? (checkin.groupname ? "text-xs" : "") : "md:text-2xl",
              )}
            >
              {checkin.groupname}
            </h2>
          </Link>
          <Typography className={cn("text-xs", isSmall ? "" : "md:text-base")}>
            {formatTime(checkin.time)}
          </Typography>
        </div>
      </div>
      <div className="w-full bg-white flex justify-center gap-6 my-5">
        <div className="w-[40%]">
          <Link
            target={linkTarget}
            className="space-y-8 flex flex-col items-center"
            href={`/user/${checkin.userslug}`}
          >
            <p
              className={cn(
                "text-xs font-bold text-center hover:underline w-full truncate",
                isSmall ? "min-[500px]:text-sm w-[80%]" : "min-[500px]:text-xl",
              )}
            >
              {checkin.username}
            </p>
            {checkin.userprofile ? (
              <Image
                width={160}
                height={160}
                className={cn(
                  "object-cover rounded-full shadow-moreblurred",
                  isSmall
                    ? "w-[70px] h-[70px]"
                    : "w-3/4 aspect-square min-[500px]:h-40 min-[500px]:w-40",
                )}
                src={`profilePictures/${checkin.userprofile}`}
                alt={`${checkin.username}'s profile picture`}
              />
            ) : (
              <DImage
                width={160}
                height={160}
                className={cn(
                  "object-cover rounded-full shadow-moreblurred",
                  isSmall
                    ? "w-[70px] h-[70px]"
                    : "w-3/4 aspect-square min-[500px]:h-40 min-[500px]:w-40",
                )}
                src={
                  checkin.userProviderImageUrl
                    ? checkin.userProviderImageUrl
                    : DefaultUserImage
                }
                alt={`${checkin.username}'s profile picture`}
              />
            )}
          </Link>
        </div>
        <div className="space-y-8 flex flex-col">
          <p
            className={cn(
              "text-xs leading-[1rem] text-[#919191] font-bold text-center whitespace-nowrap",
              isSmall
                ? "leading-[0.9rem]"
                : "min-[500px]:text-base  min-[500px]:leading-[32px]",
            )}
          >
            Check-in
          </p>
          <div className="flex-1 flex items-center justify-center">
            <DImage alt="checkin-icon" src={CheckinIcon} />
          </div>
        </div>
        <div className="w-[40%]">
          <Link
            target={linkTarget}
            className="space-y-8 flex flex-col items-center"
            href={`/place/${checkin.placeslug}`}
          >
            <p
              className={cn(
                "text-xs font-bold text-center hover:underline w-full truncate",
                isSmall ? "min-[500px]:text-sm w-[80%]" : "min-[500px]:text-xl",
              )}
            >
              {checkin.placename}
            </p>
            {checkin.placeprofile ? (
              <Image
                width={160}
                height={160}
                className={cn(
                  "object-cover rounded-full shadow-moreblurred",
                  isSmall
                    ? "w-[70px] h-[70px]"
                    : "w-3/4 aspect-square min-[500px]:h-40 min-[500px]:w-40",
                )}
                src={`placePictures/${checkin.placeprofile}`}
                alt={`${checkin.placename}'s image`}
              />
            ) : (
              <DImage
                width={160}
                height={160}
                className={cn(
                  "object-cover rounded-full shadow-moreblurred",
                  isSmall
                    ? "w-[70px] h-[70px]"
                    : "w-3/4 aspect-square min-[500px]:h-40 min-[500px]:w-40",
                )}
                src={getDefaultPlaceImage(checkin.placetype)}
                alt={`default place image`}
              />
            )}
          </Link>
        </div>
      </div>
      <div
        className={cn("flex", isSmall ? "gap-4 pt-4" : "pt-7 gap-8 md:gap-14")}
      >
        <AttendeeButton
          iconClassName={isSmall ? "md:h-[15px] md:w-auto" : ""}
          textClassName={isSmall ? "md:text-xs" : ""}
          count={checkin.attendeesCount}
          onClick={handleOpen}
        />
        <CommentButton
          iconClassName={isSmall ? "md:h-[20px] md:w-auto" : ""}
          textClassName={isSmall ? "md:text-xs" : ""}
          count={checkin.commentsCount}
          onClick={handleOpen}
        />
      </div>
    </article>
  );
};

export default Checkincard;
