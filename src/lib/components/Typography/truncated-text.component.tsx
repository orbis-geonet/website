"use client";
import React, { useState } from "react";
import { Typography } from ".";
import { TextWithClickableLink } from "..";

type PROPS = {
  children: string;
  limit: number;
  className?: string;
};

const Truncatedtext: React.FC<PROPS> = ({
  children = "",
  limit,
  className = "",
}) => {
  const [isFullTextVisible, setFullTextVisibility] = useState(false);
  const overflowing = children.length > limit;
  const handleShowLess = () => setFullTextVisibility(false);

  const handleShowMore = () => setFullTextVisibility(true);

  return (
    <Typography className={className}>
      {isFullTextVisible ? (
        <TextWithClickableLink text={children} />
      ) : (
        <span>{children.slice(0, limit)}</span>
      )}

      {overflowing &&
        (isFullTextVisible ? (
          <>
            <span>&nbsp;</span>
            <span
              className="text-primary font-semibold cursor-pointer hover:underline"
              onClick={handleShowLess}
            >
              ver menos
            </span>
          </>
        ) : (
          <>
            <span>...</span>
            <span
              className="text-primary font-semibold cursor-pointer hover:underline"
              onClick={handleShowMore}
            >
              ver mais
            </span>
          </>
        ))}
    </Typography>
  );
};

export default Truncatedtext;
