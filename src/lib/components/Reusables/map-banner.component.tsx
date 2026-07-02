"use client";
import React, { useState } from "react";
import { default as MapCTASrc } from "@public/images/home/feature3.svg";
import Image from "next/image";
import { Button, Typography } from "..";
import { RxCross2 } from "react-icons/rx";
import { FaGithub } from "react-icons/fa";
import useLocale from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

type PROPS = {
  className?: string;
  allowClosing?: boolean;
};

const MapBanner: React.FC<PROPS> = ({ className, allowClosing = true }) => {
  const [unmountCTA, setUnmountCTA] = useState(false);
  const { dictionary } = useLocale();

  const handleUnmountCTA = () => setUnmountCTA(true);

  if (unmountCTA) return <div></div>;

  return (
    <div className={cn("flex flex-col sm:flex-row gap-4 mx-2 relative", className)}>
      {allowClosing && (
        <button
          className="absolute top-2 right-2 z-20"
          aria-label="Close"
          onClick={handleUnmountCTA}
        >
          <RxCross2 className="text-primary text-opacity-30 text-xl" />
        </button>
      )}

      {/* Map Box */}
      <div className="border lg:shadow-extralight flex-1 flex flex-row items-stretch px-4 sm:px-6 gap-4 sm:gap-6 bg-white rounded-md py-5 sm:py-8">
        <Image
          className="h-20 w-20 sm:h-24 sm:w-24 object-contain shrink-0 self-center"
          alt="Map Banner image"
          src={MapCTASrc}
        />
        <div className="flex flex-col justify-between flex-1 gap-3">
          <div>
            <p className="text-sm sm:text-base font-bold">{dictionary.mapBanner.heading}</p>
            <Typography className="text-xs sm:text-sm mt-1">
              {dictionary.mapBanner.description}
            </Typography>
          </div>
          <div>
            <Button href="/map" outlined={true}>
              {dictionary.mapBanner.buttonText}
            </Button>
          </div>
        </div>
      </div>

      {/* GitHub Box */}
      <div className="border lg:shadow-extralight flex-1 flex flex-row items-stretch px-4 sm:px-6 gap-4 sm:gap-6 bg-white rounded-md py-5 sm:py-8">
        <Image
          className="h-20 w-20 sm:h-24 sm:w-24 object-contain shrink-0 self-center"
          alt="Connected world illustration"
          src="/images/home/connected-world.png"
          width={96}
          height={96}
        />
        <div className="flex flex-col justify-between flex-1 gap-3">
          <div>
            <p className="text-sm sm:text-base font-bold">{dictionary.githubBanner.heading}</p>
            <Typography className="text-xs sm:text-sm mt-1">
              {dictionary.githubBanner.description}
            </Typography>
          </div>
          <div>
            <Button href="https://github.com/orbis-geonet" outlined={true} className="inline-flex items-center gap-2">
              <FaGithub />
              {dictionary.githubBanner.buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapBanner;
