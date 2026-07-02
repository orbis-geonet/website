"use client";
import React, { HTMLProps, useEffect, useState } from "react";
import { getURL } from "@utils";

interface PROPS extends HTMLProps<HTMLVideoElement> {
  src: string;
}

const Video: React.FC<PROPS> = ({ src, ...remainingProps }) => {
  const [videoSrc, setVideoSrc] = useState("");

  const getVideoSrc = async () => {
    const url = await getURL(src);
    setVideoSrc(url);
  };

  useEffect(() => {
    getVideoSrc();
  }, []);

  if (videoSrc === "") return;

  return <video src={videoSrc} {...remainingProps} />;
};

export default Video;
