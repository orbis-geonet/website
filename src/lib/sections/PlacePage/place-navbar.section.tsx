"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TGROUPNAVLINKS } from "@interface";
import { SingleTabLink } from "@components";
import { Dictionary } from "@/lib/locales";

const GroupNavbar = ({ dictionary }: { dictionary: Dictionary }) => {
  const pathname = usePathname();
  const temp = pathname.split("/");
  const baseURL = "/place/" + temp[2];

  const PLACENAVLINKS: TGROUPNAVLINKS = [
    {
      title: dictionary.common.latestPosts,
      href: baseURL,
    },
    {
      title: dictionary.common.events,
      href: baseURL + "/events",
    },
  ];

  return (
    <nav className="max-w-full px-4 overflow-scroll scrollbar-hidden min-[550px]:w-auto flex items-center min-[550px]:justify-center my-10 md:mb-20">
      <ul className="flex gap-10 md:gap-20 lg:gap-40">
        {PLACENAVLINKS.map((item, index) => (
          <SingleTabLink
            key={item.title + index}
            href={item.href}
            active={pathname === item.href}
          >
            {item.title}
          </SingleTabLink>
        ))}
      </ul>
    </nav>
  );
};

export default GroupNavbar;
