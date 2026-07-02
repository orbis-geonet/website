"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TGROUPNAVLINKS } from "@interface";
import { SingleTabLink } from "@components";
import { Dictionary } from "@/lib/locales";

const UserNavbar = ({ dictionary }: { dictionary: Dictionary }) => {
  const pathname = usePathname();
  const temp = pathname.split("/");
  const baseURL = "/user/" + temp[2];

  const GROUPNAVLINKS: TGROUPNAVLINKS = [
    {
      title: dictionary.common.gallery,
      href: baseURL,
    },
    {
      title: dictionary.common.latestPosts,
      href: baseURL + "/feed",
    },
    // {
    //   title: "Grupos",
    //   href: baseURL + "/groups",
    // },
  ];

  return (
    <nav className="max-w-full px-4 overflow-scroll scrollbar-hidden flex items-center justify-center my-10 md:my-20">
      <ul className="flex gap-10 md:gap-40">
        {GROUPNAVLINKS.map((item, index) => (
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

export default UserNavbar;
