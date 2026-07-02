"use client";
import Link from "next/link";
import React from "react";

const TextWithClickableLink = ({ text }: { text: string }) => {
  const linkRegex = /(https?:\/\/[^\s]+)/g; // Regular expression to match URLs

  const parts = text.split(linkRegex);

  const renderedText = parts.map((part, index) => {
    if (part.match(linkRegex)) {
      return (
        <Link
          className="text-blue-500 underline text-[14px] md:text-[18px]"
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </Link>
      );
    } else {
      return <React.Fragment key={index}>{part}</React.Fragment>;
    }
  });

  return <>{renderedText}</>;
};

export default TextWithClickableLink;
