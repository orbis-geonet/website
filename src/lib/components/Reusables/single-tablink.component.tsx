import Link from "next/link";
import React from "react";

type LINKPROPS = {
  href: string;
  children: React.ReactNode;
  active: boolean;
};

const SingleLink: React.FC<LINKPROPS> = ({ href, children, active }) => {
  return (
    <li
      className={`text-base md:text-xl whitespace-nowrap ${active ? "font-bold" : ""}`}
    >
      <Link href={href}>{children}</Link>
      {active && <div className="h-[3px] bg-primary mt-2 md:mt-4 rounded-sm" />}
    </li>
  );
};

export default SingleLink;
