"use client";
import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Popup } from "@components";

type PROPS = {
  height: number;
  width: number;
  src: string | StaticImageData;
  alt: string;
};
const GalleryImage: React.FC<PROPS> = ({ height, width, src, alt }) => {
  const [ModalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  return (
    <div
      style={{ height: `${height}px`, minWidth: `${width}px` }}
      className="cursor-pointer"
    >
      <Image
        onClick={handleOpen}
        style={{ height: `${height}px`, width: `${width}px` }}
        className="object-cover rounded-xl"
        height={height}
        width={width}
        src={src}
        alt={alt}
      />
      <Popup
        ModalOpen={ModalOpen}
        setModalOpen={setModalOpen}
        showCloseIcon={true}
      >
        <article className="border-0 focus:border-0 focus:outline-none">
          <Image
            className="border-0 focus:border-0 focus:outline-none w-[min(80vw, 500px)] max-w-[80vw] h-[500px] object-contain"
            src={src}
            alt={alt}
          />
        </article>
      </Popup>
    </div>
  );
};

export default GalleryImage;
