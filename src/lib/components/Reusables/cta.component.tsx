"use client";
import React, { useState } from "react";
import { default as CTASrc } from "@public/images/calltoaction.svg";
import { default as CTASmallBg } from "@public/images/bg/ctasmallbg.webp";
import Image from "next/image";
import { Button, Typography } from "..";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";
import useLocale from "@/hooks/useLocale";

type PROPS = {
  className?: string;
  allowClosing?: boolean;
};

const CalltoAction: React.FC<PROPS> = ({ className, allowClosing = true }) => {
  const [unmountCTA, setUnmountCTA] = useState(false);
  const { dictionary } = useLocale();

  const handleUnmountCTA = () => setUnmountCTA(true);

  if (unmountCTA) return <div></div>;

  return (
    <div
      className={`${
        allowClosing
          ? "shadow-extralight flex-col gap-0 min-[500px]:gap-4 mx-4 mt-4 min-[500px]:flex-row justify-start md:justify-center md:text-center min-[500px]:px-10 min-[500px]:pl-0 md:px-10"
          : "lg:shadow-extralight flex-col justify-center md:flex-row  text-center px-10 gap-10 md:gap-0"
      } relative flex bg-white rounded-md min-[500px]:flex  md:text-start items-center pb-3 pt-6 pl-4 min-[500px]:py-8   ${
        className ? className : ""
      }`}
    >
      {!allowClosing && (
        <Image
          className="absolute inset-0 h-full w-full object-cover lg:hidden"
          alt="bg-small"
          src={CTASmallBg}
        />
      )}

      {allowClosing && (
        <button
          className="absolute top-2 right-2 md:top-4 md:right-4"
          aria-label="Close"
          onClick={handleUnmountCTA}
        >
          <RxCross2 className=" text-primary text-opacity-30 text-xl" />
        </button>
      )}
      <Image
        className={`ml-5 relative z-10 ${allowClosing ? "hidden md:block" : ""}`}
        alt="call-to-action-image"
        src={CTASrc}
      />
      <div
        className={`relative z-10 ${allowClosing ? "hidden md:block" : "block"}`}
      >
        <p className="text-xl font-bold">
          {dictionary.monitizeCommunityBanner.heading}
        </p>
        <Typography className="max-w-sm">
          {dictionary.monitizeCommunityBanner.description}
        </Typography>
      </div>
      {allowClosing && (
        <Link href="https://calendly.com/orbis-social/15min?month=2023-08">
          <p className="block md:hidden mb-4 min-[500px]:mb-0">
            {dictionary.monitizeCommunityBanner.closableBannerHeading}
            <span className="font-bold">
              &nbsp;
              {dictionary.monitizeCommunityBanner.closableBannerHighlightedText}
            </span>
          </p>
        </Link>
      )}
      <div
        className={`${
          allowClosing ? "hidden min-[500px]:flex" : "flex"
        } relative z-10 ml-2 grow items-center justify-end`}
      >
        <Button
          href="https://calendly.com/orbis-social/15min?month=2023-08"
          outlined={true}
        >
          {dictionary.monitizeCommunityBanner.buttonText}
        </Button>
      </div>
    </div>
  );
};

export default CalltoAction;
