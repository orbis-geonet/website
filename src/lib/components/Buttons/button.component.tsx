"use client";
import Link from "next/link";
import React from "react";

type PROPS = {
  children: React.ReactNode;
  outlined?: boolean;
  className?: string;
  href?: string;
  onClick?: () => void;
  invertedColors?: boolean;
};

const Button: React.FC<PROPS> = ({
  children,
  outlined,
  className = "",
  href,
  invertedColors = false,
  onClick = () => {},
}) => {
  if (outlined) {
    if (href)
      return (
        <Link
          className={`text-xs md:text-base font-medium text-primary border border-primary py-3 px-8 rounded-md whitespace-nowrap ${className}`}
          href={href}
        >
          {children}
        </Link>
      );

    return (
      <button
        onClick={onClick}
        className={`text-xs md:text-base font-medium text-primary border border-primary py-3 px-8 rounded-md whitespace-nowrap ${className}`}
      >
        {children}
      </button>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        className={`text-xs md:text-base  flex items-center justify-center font-medium ${
          invertedColors ? "bg-white text-primary" : "text-white bg-primary"
        } py-3 px-8 rounded-md whitespace-nowrap ${className}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`text-xs md:text-base font-medium ${
        invertedColors ? "bg-white text-primary" : "text-white bg-primary"
      } py-3 px-8 rounded-md whitespace-nowrap ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
