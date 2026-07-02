"use client";
import useLocale from "@/hooks/useLocale";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";

type PROPS = {
  icon: StaticImageData;
  children: string;
  href?: string;
};

const DownloadButton: React.FC<PROPS> = ({ icon, children, href }) => {
  const { dictionary } = useLocale();
  if (href) {
    return (
      <Link
        href={href}
        className="bg-primary text-white flex rounded-lg py-[6px] px-[15px] items-center gap-2"
      >
        <Image
          alt={children + " icon"}
          src={icon}
          className="h-[24px] w-[24px] md:h-[30px] md:w-[30px] object-cover"
        />
        <p className="text-[10px] md:text-[12px] text-start">
          {dictionary.common.downloadHere}
          <br />{" "}
          <span className="text-base md:text-xl italic font-[900]">
            {children}
          </span>
        </p>
      </Link>
    );
  }

  return (
    <button className="bg-primary text-white flex rounded-lg py-[6px] px-[15px] items-center gap-2">
      <Image
        className="h-[24px] w-[24px] md:h-[30px] md:w-[30px] object-cover"
        alt={children + " icon"}
        src={icon}
      />
      <p className="text-[10px] md:text-[12px] text-start">
        {dictionary.common.downloadHere}
        <br />{" "}
        <span className="text-base md:text-xl italic font-[900]">
          {children}
        </span>
      </p>
    </button>
  );
};

export default DownloadButton;
