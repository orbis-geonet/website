"use client";
import React, { useState } from "react";
import { TPHOTO } from "@interface";
import { Image, Popup } from "@components";
import { default as DImage } from "next/image";
interface SINGLEIMAGEPROP extends TPHOTO {
  index: number;
  priority?: boolean;
}
const SingleImage: React.FC<SINGLEIMAGEPROP> = ({
  image,
  index,
  type,
  priority = true,
}) => {
  const [ModalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  return (
    <>
      {type === "INSTAGRAM" ? (
        <DImage
          className="cursor-pointer object-cover h-full w-full"
          onClick={handleOpen}
          alt={`image-${index}`}
          src={image}
          priority={priority}
          height={200}
          width={200}
        />
      ) : (
        <Image
          className="cursor-pointer object-cover h-full w-full"
          onClick={handleOpen}
          alt={`image-${index}`}
          src={`user/pictures/${image}`}
          height={200}
          width={200}
        />
      )}
      <Popup
        ModalOpen={ModalOpen}
        setModalOpen={setModalOpen}
        showCloseIcon={true}
      >
        <article className="border-0 focus:border-0 focus:outline-none">
          <div className="h-[90vh] w-[90vw] bg-black">
            {type === "INSTAGRAM" ? (
              <DImage
                className="w-full h-full object-contain"
                src={image}
                alt={`image-${index}`}
                height={600}
                width={600}
              />
            ) : (
              <Image
                className="w-full h-full object-contain"
                src={`user/pictures/${image}`}
                alt={`image-${index}`}
                height={600}
                width={600}
              />
            )}
          </div>
        </article>
      </Popup>
    </>
  );
};

export default SingleImage;
