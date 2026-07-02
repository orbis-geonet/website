"use client";
import React from "react";
import Image from "next/image";
import { default as emptySrc } from "@public/default/empty.svg";

const Noexistence: React.FC<{
  message?: string;
  className?: string;
  small?: boolean;
}> = ({ message, className, small = false }) => {
  return (
    <div
      className={`mx-auto w-full max-w-6xl flex flex-col items-center gap-4 p-10 font-bold text-base md:text-xl ${className}`}
    >
      <Image
        className={`${small ? "w-[min(200px, 90vw)] aspect-square" : "w-[90vw] aspect-square sm:h-[300px]  sm:w-[400px] lg:h-[400px] lg:w-[400px]"}`}
        src={emptySrc}
        alt="doesn't exist svg"
      />

      {message && <p className="text-[#707070] text-center">{message}</p>}
    </div>
  );
};

export default Noexistence;
