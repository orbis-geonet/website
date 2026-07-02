"use client";

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { RxCross2 } from "react-icons/rx";
import { Popup } from "@components";

type PROPS = {
  icon: StaticImageData;
  title: string;
  children: React.ReactNode;
  className?: string;
};

const IconWithPopup: React.FC<PROPS> = ({
  icon,
  title,
  children,
  className = "",
}) => {
  const [ModalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  return (
    <>
      <button onClick={handleOpen} className="space-y-2">
        <div className="h-[60px] w-[60px] flex items-center justify-center rounded-full border border-primary">
          <Image
            className="h-[35px] w-[35px] object-contain"
            height={40}
            width={40}
            src={icon}
            alt="icon"
          />
        </div>
        <p className="text-xs text-center">{title}</p>
      </button>
      <Popup ModalOpen={ModalOpen} setModalOpen={setModalOpen}>
        <article className="relative bg-white px-2 md:px-4 py-2 rounded-xl mx-1 md:mx-4 w-[min(400px,100vw)] ">
          <header>
            <h3 className="text-xl font-bold text-center">{title}</h3>
            <button
              className="absolute top-4 right-4"
              aria-label="Close"
              onClick={handleClose}
            >
              <RxCross2 className="text-primary text-opacity-30 text-xl" />
            </button>
          </header>
          <div className={className + " py-4"}>{children}</div>
        </article>
      </Popup>
    </>
  );
};

export default IconWithPopup;
