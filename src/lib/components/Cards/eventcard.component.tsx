"use client";
import { default as DImage } from "next/image";
import React, { useEffect, useState } from "react";
import { Image } from "@components";
import { TruncatedText, Typography } from "..";
import { IoMdPin } from "react-icons/io";
import Link from "next/link";
import { TEVENT } from "@/lib/ts";
import { cn, getData, parseDay, parseTime } from "@/lib/utils";
import { default as DefaultUserImage } from "@public/default/user.svg";

interface IEventcard extends TEVENT {
  className?: string;
  isSmall?: boolean;
}
const Eventcard: React.FC<IEventcard> = ({
  id,
  title,
  details,
  placeid,
  placeslug,
  placename,
  starttime,
  endtime,
  mediaSrc,
  className,
  isSmall,
}) => {
  const [attendees, setAttendees] = useState<
    {
      id: string | number;
      image?: string;
      slug: string;
      providerImageUrl?: string | null;
    }[]
  >([]);
  const linkTarget = isSmall ? "_blank" : "-self";

  const fetchConfirmedAttendees = async () => {
    try {
      const data = await getData(`events/${id}/attendees?size=3`);

      if (data.error) {
        return;
      }

      const temp = data.map((user: any) => {
        return {
          id: user.userKey,
          slug: user.slug,
          image: user.imageName,
          providerImageUrl: user.providerImageUrl,
        };
      });
      setAttendees(temp);
    } catch (error) {
      console.error("Error loading attendees:", error);
    }
  };

  useEffect(() => {
    fetchConfirmedAttendees();
  }, []);

  const attendeeImagePosition = (index: number) => {
    if (index < 0 && index > 2) return "";

    switch (index) {
      case 0:
        return "left-0";
      case 1:
        return "left-1/2";
      case 2:
        return "left-full";
      default:
        return "";
    }
  };

  return (
    <article
      className={cn(
        "bg-white md:shadow-moreblurred rounded-xl w-full  mx-auto border-b md:border-b-0",
        className ? className : "",
        isSmall ? "" : "md:w-[611px]",
      )}
    >
      <div className={cn("p-4", isSmall ? "space-y-1" : "md:p-7 space-y-4")}>
        <h2
          className={cn(
            "text-base font-bold hover:underline",
            isSmall ? (title.length > 30 ? "text-xs" : "") : "md:text-2xl",
          )}
        >
          {title}
        </h2>
        {placeslug && (
          <Link
            target={linkTarget}
            href={`/place/${placeslug}`}
            className="flex items-center gap-1 text-[#707070]"
          >
            <IoMdPin />
            <Typography
              className={cn(
                "text-xs hover:underline",
                isSmall ? "" : "md:text-base",
              )}
            >
              {placename}
            </Typography>
          </Link>
        )}
        <div
          className={cn(
            "font-bold flex items-center justify-between text-xs flex-wrap",
            isSmall ? "" : " md:text-base",
          )}
        >
          <p>{parseDay(starttime)}</p>
          <p>
            {parseTime(starttime)} as {parseTime(endtime)}
          </p>
        </div>
        {details && (
          <TruncatedText
            limit={130}
            className={cn("text-sm", isSmall ? "mt-3" : "md:text-base")}
          >
            {details}
          </TruncatedText>
        )}
      </div>
      {mediaSrc !== "" && (
        <div
          className={cn(
            "w-full bg-black hover:cursor-pointer",
            isSmall ? "aspect-[611/440]" : "h-[440px]",
          )}
        >
          <Image
            priority
            className="h-full w-full object-contain"
            src={`events/images/${mediaSrc}`}
            alt="event-image"
            width={611}
            height={440}
          />
        </div>
      )}
      {attendees.length > 0 && (
        <div
          className={cn(
            "p-4 flex items-center justify-end",
            isSmall ? "" : "md:p-7",
          )}
        >
          <p
            className={cn(
              "text-[#232323] text-xs text-opacity-50",
              isSmall ? "" : "md:text-base",
            )}
          >
            Confirmados:&nbsp;
          </p>
          <div className="flex items-center w-fit">
            {attendees.map((attendee, index) => (
              <Link
                target={linkTarget}
                key={attendee.id}
                href={`/user/${attendee.slug}`}
              >
                {attendee.image ? (
                  <Image
                    priority
                    className={cn(
                      "text-[#232323] text-opacity-50 rounded-full",
                      isSmall ? "h-[20px] w-[20px]" : "",
                    )}
                    width={50}
                    height={50}
                    key={"confirmed-attendee" + index}
                    src={`profilePictures/${attendee.image}`}
                    alt={`confirmed attendee ${index}'s profile pic`}
                  />
                ) : (
                  <DImage
                    priority
                    className={cn(
                      "text-[#232323] text-opacity-50 rounded-full",
                      isSmall ? "h-[20px] w-[20px]" : "",
                    )}
                    width={50}
                    height={50}
                    key={"confirmed-attendee" + index}
                    src={
                      attendee.providerImageUrl
                        ? attendee.providerImageUrl
                        : DefaultUserImage
                    }
                    alt={`confirmed attendee ${index}'s profile pic`}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default Eventcard;
