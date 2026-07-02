"use client";
import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { BsFillPlayFill } from "react-icons/bs";
import { Popup } from "..";

type PROPS = {
  className?: string;
  link: string;
  thumbnail: StaticImageData;
};

const VideoPlayer: React.FC<PROPS> = ({ className, link, thumbnail }) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const handleOpen = () => setVideoModalOpen(true);

  return (
    <article
      className={`w-full md:w-[535px] md:h-[300px] md:rounded-3xl ${
        className ? className : ""
      }`}
    >
      <div className="relative md:rounded-3xl">
        <Image
          className="h-full w-full object-cover md:rounded-3xl"
          src={thumbnail}
          alt="youtube-video-thumbnail"
        />
        <div
          onClick={handleOpen}
          aria-label="Play"
          className="absolute inset-0 flex items-center justify-center bg-primary bg-opacity-20 rounded-3xl cursor-pointer"
        >
          <BsFillPlayFill size={80} className="text-white" />
        </div>
      </div>
      <Popup ModalOpen={videoModalOpen} setModalOpen={setVideoModalOpen}>
        <iframe
          className="px-4 md:px-10 lg:px-0 w-full h-[60vh] lg:w-[820px] lg:h-[462px] object-cover"
          src={link}
          title="How To Use Orbis"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </Popup>
    </article>
  );
};

export default VideoPlayer;
