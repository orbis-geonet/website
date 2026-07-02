"use client";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Logo } from "..";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  const handleBackBtnClick = () => router.back();

  return (
    <div className="flex items-center gap-4">
      <button onClick={handleBackBtnClick}>
        <IoIosArrowBack size={40} className="text-black text-opacity-50" />
      </button>
    </div>
  );
};

export default BackButton;
