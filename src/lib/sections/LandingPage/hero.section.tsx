import { Heading, Typography, DownloadButton } from "@components";
import React from "react";
import { default as AppStoreIconSrc } from "@public/icons/appstore.svg";
import { default as PlayStoreIconSrc } from "@public/icons/playstore.svg";
import { Dictionary } from "@/lib/locales";
import HeroSlider from "./hero-slider.section";

const Hero = ({
  dictionary,
}: {
  dictionary: Dictionary;
  locale?: string;
}) => {
  return (
    <section className="flex flex-col-reverse lg:flex-row items-center justify-between my-10">
      <aside className="space-y-4 md:space-y-[30px] text-center lg:text-start">
        <Heading>{dictionary.homePage.heroHeading}</Heading>
        <Typography className="max-w-[420px] mx-auto lg:mx-0">
          {dictionary.homePage.heroDescription}
        </Typography>
        <div className="hidden md:flex flex-row items-center justify-center lg:justify-start gap-6">
          <DownloadButton
            icon={AppStoreIconSrc}
            href={dictionary.homePage.appStoreURL}
          >
            App Store
          </DownloadButton>
          <DownloadButton
            icon={PlayStoreIconSrc}
            href="https://play.google.com/store/apps/details?id=com.orbis.orbis&rdid=com.orbis.orbis"
          >
            Google Play
          </DownloadButton>
        </div>
      </aside>
      <aside className="py-12 flex justify-center w-full">
        <HeroSlider />
      </aside>
    </section>
  );
};

export default Hero;
