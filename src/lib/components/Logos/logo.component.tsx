import Image from "next/image";
import React from "react";
import { default as LogoSrc } from "@public/logos/logo.webp";
import { default as LogoWithNameSrc } from "@public/logos/logowithname.webp";
import Link from "next/link";

type PROPS = {
  withName?: boolean;
  className?: string;
};

const Logo: React.FC<PROPS> = ({ withName, className = "" }) => {
  if (withName)
    return (
      <Link href="/">
        <figure
          className={`h-[30px] w-[106px] lg:h-[45px] lg:w-[165px] ${className}`}
        >
          <Image
            className="object-contain"
            alt="orbis-logo-with-text"
            src={LogoWithNameSrc}
            priority
          />
        </figure>
      </Link>
    );

  return (
    <Link href="/">
      <figure
        className={`h-[50px] w-[50px] lg:h-[70px] lg:w-[70px] ${className}`}
      >
        <Image
          className="object-contain"
          alt="orbis-logo"
          src={LogoSrc}
          priority
        />
      </figure>
    </Link>
  );
};

export default Logo;
