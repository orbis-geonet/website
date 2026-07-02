"use client";
import { getURL } from "@/lib/utils";
import { useEffect, useState } from "react";

type PROPS = {
  id: string;
  src: string;
};

const AudioPlayer: React.FC<PROPS> = ({ src, id }) => {
  const [audioSrc, setAudioSrc] = useState("");

  const getAudioSrc = async () => {
    const url = await getURL(src);
    setAudioSrc(url);
  };

  useEffect(() => {
    getAudioSrc();
  }, []);

  if (audioSrc === "") return;

  return (
    <>
      <audio
        controls
        src={audioSrc}
        className="orbis-audio-player w-full px-4 md:px-7"
      />
    </>
  );
};

export default AudioPlayer;
