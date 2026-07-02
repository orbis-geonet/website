"use client";
import React from "react";
import Carousel from "react-material-ui-carousel";
import { Image } from "..";
type PROPS = {
  images: string[];
  popup?: boolean;
  onClick?: () => void;
};

const Imageslider: React.FC<PROPS> = ({
  images,
  popup = false,
  onClick = () => {},
}) => {
  return (
    <Carousel
      className={`${popup ? "h-[90vh] w-[90vw]" : "w-full"} md:mx-auto`}
      autoPlay={false}
      swipe={true}
      indicators={true}
      animation="slide"
      cycleNavigation={true}
    >
      {images.map((image) => (
        <div
          key={image}
          className={`${
            popup ? "h-[90vh] w-[90vw]" : "h-[440px] w-full"
          } bg-black hover:cursor-pointer`}
          onClick={onClick}
        >
          <Image
            priority
            className="w-full h-full object-contain"
            src={image}
            alt="post-image"
            width={611}
            height={440}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default Imageslider;
