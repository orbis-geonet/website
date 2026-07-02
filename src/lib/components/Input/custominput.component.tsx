"use client";
import React, { InputHTMLAttributes, useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Image from "next/image";
import { default as VisaCard } from "@public/icons/visa.svg";

interface PROPS extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  cardNumber?: boolean;
}

const CustomInput: React.FC<PROPS> = ({
  label,
  type,
  className = "",
  cardNumber = false,
  ...otherProps
}) => {
  const [visible, setVisibility] = useState(false);

  const toggleVisibility = () => setVisibility((visible) => !visible);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block">{label}</label>
      <div className="flex border-b-2 border-[##1b1b1b] border-opacity-10 focus-within:border-[#707070] focus-within:border-opacity-100 ">
        <input
          className={`py-2 border-none bg-transparent outline-none w-full`}
          type={type === "password" ? (visible ? "text" : "password") : type}
          {...otherProps}
        />
        {type === "password" && (
          <button type="button" onClick={toggleVisibility}>
            {visible ? (
              <BsEyeFill className="text-2xl" />
            ) : (
              <BsEyeSlashFill className="text-2xl" />
            )}
          </button>
        )}

        {cardNumber && (
          <Image draggable={false} alt="visa-card" src={VisaCard} />
        )}
      </div>
    </div>
  );
};

export default CustomInput;
