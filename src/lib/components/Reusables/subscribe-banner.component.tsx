import React from "react";
import { default as SubscribeBannerBg } from "@public/images/bg/subscribe-bg.webp";
import Image from "next/image";
import { Button } from "..";
import { Dictionary } from "@/lib/locales";

type PROPS = {
  dictionary: Dictionary;
  offerActivated?: boolean;
  groupid?: string | number;
};

const SubscribeBanner: React.FC<PROPS> = ({
  dictionary,
  offerActivated = true,
  groupid,
}) => {
  return (
    <article className="relative rounded-xl">
      <Image
        className="absolute inset-0 w-full h-full"
        src={SubscribeBannerBg}
        alt="banner-bg-image"
      />
      <div className="relative z-[10] flex flex-col md:flex-row gap-8 px-[20px] text-center md:text-start  md:px-[100px] lg:px-[145px] py-[50px] items-center justify-between max-w-6xl mx-auto">
        {offerActivated ? (
          <>
            <p className="max-w-md">
              {dictionary.subscriptionBanner.offerActivatedHeading}
            </p>
            <Button href={`/plans/${groupid}`}>
              {dictionary.subscriptionBanner.offerActivatedButtonText}
            </Button>
          </>
        ) : (
          <>
            <p className="max-w-md">
              {dictionary.subscriptionBanner.offerInactiveHeading}
            </p>
            <Button href="https://calendly.com/orbis-social/15min?month=2023-08">
              {dictionary.subscriptionBanner.offerInactiveButtonText}
            </Button>
          </>
        )}
      </div>
    </article>
  );
};

export default SubscribeBanner;
