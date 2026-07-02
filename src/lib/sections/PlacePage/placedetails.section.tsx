import {
  ActiveTimePopup,
  Breadcrumbs,
  Button,
  Heading,
  IconWithPopup,
  Rating,
  Typography,
  Image,
  PlaceMap,
  TimePopupContent,
} from "@components";
import { TPLACE } from "@interface";
import { default as DImage, StaticImageData } from "next/image";
import React from "react";
import { default as LocationPin } from "@public/icons/locationpin.svg";
import { default as Telephone } from "@public/icons/telephone.svg";
import { default as Clock } from "@public/icons/clock.svg";
import { default as Website } from "@public/icons/website.webp";
import Link from "next/link";
import { parseActiveTime } from "@/lib/utils";
import { Dictionary } from "@/lib/locales";

type PROPS = {
  details: TPLACE;
  dictionary: Dictionary;
};

type TEXTWITHICONPROPS = {
  children: React.ReactNode;
  icon: string | StaticImageData;
};

const TextwithIcon: React.FC<TEXTWITHICONPROPS> = ({ children, icon }) => {
  return (
    <div className="hidden lg:flex items-center gap-2">
      <DImage
        className="h-[20px] w-[20px]"
        height={20}
        width={20}
        src={icon}
        alt="icon"
      />
      {children}
    </div>
  );
};

const PlaceDetails: React.FC<PROPS> = ({ details, dictionary }) => {
  const pathList = [
    {
      text: dictionary.common.home,
      href: "/",
    },
    {
      text: dictionary.common.place,
      href: "#",
    },
  ];

  function getTimeForDay(
    dataArray: { day: string; time: string }[],
    targetDay: string,
  ) {
    const matchingDay = dataArray.find((item) => item.day === targetDay);

    if (matchingDay) {
      return matchingDay.time;
    } else {
      return "Closed";
    }
  }

  const getTodayIndex = () => {
    const date = new Date();
    const day = date.getDay();
    // Modifying the day index so that the week starts from monday
    return (day + 6) % 7;
  };

  const todaysWorkingTime = details.activeTime
    ? getTimeForDay(details.activeTime, getTodayIndex().toString())
    : "";

  return (
    <aside className="space-y-2 md:space-y-4 lg:py-4 px-4 lg:px-0">
      <Breadcrumbs pathList={pathList} />
      <Heading>{details.name}</Heading>
      {details.rating && (
        <div className="flex items-center gap-2">
          <span>
            {details.rating === parseInt(details.rating.toString())
              ? details.rating.toFixed(1)
              : details.rating.toFixed(2)}
          </span>
          <Rating value={details.rating} />
        </div>
      )}
      <div className="flex gap-4 lg:hidden pt-4 flex-wrap">
        {details.address && (
          <IconWithPopup
            icon={LocationPin}
            title={dictionary.placePage.address}
            className="space-y-4"
          >
            <p> {details.address}</p>
            <Button
              href={`http://maps.google.com/?ie=UTF8&hq=&ll=${details.coordinates.latitude},${details.coordinates.longitude}&z=18`}
              className="w-full"
            >
              {dictionary.placePage.openInGoogleMaps}
            </Button>
          </IconWithPopup>
        )}
        {details.tel && (
          <IconWithPopup
            icon={Telephone}
            title={dictionary.placePage.telephone}
            className="space-y-4"
          >
            <p> {details.tel}</p>
            <Button className="w-full">{dictionary.placePage.connect}</Button>
          </IconWithPopup>
        )}
        {details.activeTime && (
          <IconWithPopup
            icon={Clock}
            title={dictionary.placePage.schedules}
            className="flex items-center gap-2 w-full"
          >
            <div className="px-4 sm:px-8 w-full">
              <TimePopupContent
                withHeading={false}
                activeTime={parseActiveTime(details.activeTime)}
              />
            </div>
          </IconWithPopup>
        )}

        {details.website && (
          <IconWithPopup
            icon={Website}
            title={dictionary.placePage.site}
            className="space-y-4"
          >
            <p>{details.website}</p>
            <Button href={`${details.website}`} className="capitalize">
              {dictionary.placePage.goToWebsite}
            </Button>
          </IconWithPopup>
        )}
      </div>
      {details.address && (
        <TextwithIcon icon={LocationPin}>{details.address}</TextwithIcon>
      )}
      <div className="flex items-center gap-4 md:gap-6">
        {details.tel && (
          <TextwithIcon icon={Telephone}>Tel: {details.tel}</TextwithIcon>
        )}
        {details.activeTime && (
          <div className="flex items-center gap-2">
            <TextwithIcon icon={Clock}>
              <span className="text-[#4bcf89]">
                {dictionary.placePage.seeTimetables}
              </span>
              {/* {getTimeForDay(details.activeTime, getTodayIndex().toString())} */}
            </TextwithIcon>{" "}
            <ActiveTimePopup
              className="hidden lg:flex"
              activeTime={details.activeTime}
            />
          </div>
        )}
        {details.website && (
          <TextwithIcon icon={Website}>
            <Link className="hover:underline" href={`${details.website}`}>
              {dictionary.placePage.goToWebsite}
            </Link>
          </TextwithIcon>
        )}
      </div>
      <Typography className="max-w-[500px] pb-4 md:pb-0">
        {details.description}
      </Typography>
      {details.groups && details.groups.length !== 0 && (
        <div className="space-y-6">
          <h3 className="font-bold text-xl">
            {dictionary.placePage.groupsInThisPlace}
          </h3>
          <div className="w-full md:w-[350px] flex items-center">
            {details.groups.map((group, index) => {
              if (group === undefined) return;
              return (
                <div
                  style={{
                    width: `${group.percentage}%`,
                    minWidth: "48px",
                  }}
                  key={group.id}
                  className="space-y-2 md:space-y-4"
                >
                  <Link
                    href={`/group/${group.slug}`}
                    className="flex items-center gap-1 md:gap-2"
                  >
                    <figure className="w-[40px] h-[40px] mr-2">
                      {group.image && (
                        <Image
                          style={{ border: `3px solid ${group.color}` }}
                          className="h-full w-full aspect-square object-cover rounded-full"
                          height={40}
                          width={40}
                          src={`groupPictures/${group.image}`}
                          alt={`${group.name}'s profile picture`}
                        />
                      )}
                    </figure>
                    {index === 0 && (
                      <span
                        className={`pr-2 font-bold hover:underline whitespace-nowrap truncate ${
                          details.groups?.length === 1 ? "w-[80%]" : "w-[60%]"
                        }`}
                      >
                        {group.name}
                      </span>
                    )}
                  </Link>

                  <div
                    className="h-[15px] w-full min-[400px]:block"
                    style={{
                      backgroundColor: group.color,
                      borderRight: ".5px solid rgb(0,0,0,.25)",
                      borderRadius: "10px",
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};

export default PlaceDetails;
