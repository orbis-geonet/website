"use client";
import { TCHECKIN } from "@/lib/ts";
import React, { useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Checkincard, PlaceCheckincard, ChooseOSPopup } from "..";
import { cn } from "@/lib/utils";

type PROPS = {
  checkins: TCHECKIN[];
  sliderLocation?: string;
  className?: string;
  isSmall?: boolean;
};

const Checkinslider: React.FC<PROPS> = ({
  checkins,
  sliderLocation,
  className,
  isSmall,
}) => {
  const [ModalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  return (
    <div
      className={cn(
        "bg-white md:shadow-moreblurred md:rounded-xl w-full mx-auto p-4 border-b md:border-b-0",
        className ? className : "",
        isSmall ? "" : "md:w-[611px] md:p-7",
      )}
    >
      <Carousel
        className="w-full mx-auto"
        autoPlay={false}
        swipe={true}
        indicators={true}
        navButtonsAlwaysInvisible={isSmall}
        animation="slide"
        cycleNavigation={true}
      >
        {sliderLocation === "placepage"
          ? checkins.map((checkin: TCHECKIN) => (
              <PlaceCheckincard
                key={`${checkin.userid}${checkin.placeid}`}
                checkin={checkin}
                handleOpen={handleOpen}
                isSmall={isSmall}
              />
            ))
          : checkins.map((checkin: TCHECKIN) => (
              <Checkincard
                key={`${checkin.userid}${checkin.placeid}`}
                checkin={checkin}
                handleOpen={handleOpen}
                isSmall={isSmall}
              />
            ))}
      </Carousel>
      <ChooseOSPopup ModalOpen={ModalOpen} setModalOpen={setModalOpen} />
    </div>
  );
};

export default Checkinslider;
