import { VideoPlayer } from "@components";
import React from "react";
import { default as YoutubeVideoThumnail1Src } from "@public/images/home/ytthumbnail1.jpg";
import { default as YoutubeVideoThumnail2Src } from "@public/images/home/ytthumbnail2.jpg";

const Video = () => {
  return (
    <section className="mb-20 space-y-8 lg:space-y-10">
      <h2 className="text-center font-bold text-xl md:text-3xl">Como usar ?</h2>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-20">
        <VideoPlayer
          thumbnail={YoutubeVideoThumnail1Src}
          link="https://www.youtube.com/embed/csZCWXMIJoU?autoplay=1&cc_load_policy=1&controls=1&disablekb=0&enablejsapi=0&fs=1&iv_load_policy=1&loop=0&rel=0&showinfo=1&start=0&wmode=transparent&theme=dark&mute=0"
        />
        <VideoPlayer
          thumbnail={YoutubeVideoThumnail2Src}
          link="https://www.youtube.com/embed/Ip8vAvPh1w0?autoplay=1&cc_load_policy=1&controls=1&disablekb=0&enablejsapi=0&fs=1&iv_load_policy=1&loop=0&rel=0&showinfo=1&start=0&wmode=transparent&theme=dark&mute=0"
        />
      </div>
    </section>
  );
};

export default Video;
