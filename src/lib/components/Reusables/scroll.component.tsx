import React from "react";
import Image from "next/image";
import { default as ScrollSrc } from "@public/icons/scroll.svg";

const ScrollButton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <button>
      <Image
        className={`${className ? className : ""}`}
        src={ScrollSrc}
        alt="scroll"
      />
    </button>
  );
};

export default ScrollButton;
