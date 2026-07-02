import React from "react";
import { Logo } from "..";
import Link from "next/link";
import { TFOOTERLINKS } from "@interface";
import { Dictionary } from "@/lib/locales";

type FOOTERLINKPROPS = {
  href: string;
  children: React.ReactNode;
};

const FooterLink: React.FC<FOOTERLINKPROPS> = ({ href, children }) => {
  return (
    <li>
      <Link className="text-xs md:text-base" href={href}>
        {children}
      </Link>
    </li>
  );
};

const Footer = ({ dictionary }: { dictionary: Dictionary }) => {
  const FOOTERLINKS: TFOOTERLINKS = [
    {
      title: dictionary.common.termsAndCondition,
      href: "/tos",
    },
    {
      title: dictionary.common.privacyPolicy,
      href: "/privacy",
    },
  ];

  return (
    <footer className="py-12 border-t-2 relative z-10 my-16 max-w-6xl px-10 lg:px-0 mx-auto footer">
      <div className="flex flex-col gap-8 items-center justify-between min-[420px]:flex-row">
        <Logo />
        <ul className="flex items-center gap-x-10">
          {FOOTERLINKS.map((link) => (
            <FooterLink key={link.href + link.title} href={link.href}>
              {link.title}
            </FooterLink>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
