"use client";

import React from "react";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";

type CRUMBPROPS = {
  text: string;
  href: string;
  last: boolean;
};

const Crumb: React.FC<CRUMBPROPS> = ({ text, href, last = false }) => {
  if (last) {
    return <span className="text-primary text-xs md:text-base">{text}</span>;
  }

  return (
    <div className="flex items-center gap-2 hover:underline">
      <Link href={href} className="text-xs md:text-base">
        {text}
      </Link>
      <FaAngleRight />
    </div>
  );
};

type PROPS = {
  pathList: {
    text: string;
    href: string;
  }[];
  className?: string;
};

const Breadcrumbs: React.FC<PROPS> = ({ pathList, className = "" }) => {
  return (
    <div
      className={`bg-[#232323] bg-opacity-10 flex items-center gap-2 w-fit py-1 px-6 rounded-2xl text-[#232323] ${className}`}
    >
      {pathList.map((item, index) => (
        <Crumb
          key={item.href + item.text}
          text={item.text}
          href={item.href}
          last={index === pathList.length - 1}
        />
      ))}
    </div>
  );
};

export default Breadcrumbs;
