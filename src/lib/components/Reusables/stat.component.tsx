"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type STATPROPS = {
  count: number;
  title: string;
  tab: string;
};

const StatComponent: React.FC<STATPROPS> = ({ title, count, tab }) => {
  const pathname = usePathname();
  const temp = pathname.split("/");
  const baseURL = "/user/" + temp[2];

  return (
    <Link className="text-center" href={`${baseURL}/${tab}`}>
      <p className="font-bold text-base md:text-2xl">{count}</p>
      <p className="text-xs md:text-base">{title}</p>
    </Link>
  );
};

export default StatComponent;
