import { Featurecard } from "@components";
import React from "react";
import { TFEATURES } from "@interface";
import { default as Feature1Icon } from "@public/images/home/feature1.svg";
import { default as Feature2Icon } from "@public/images/home/feature2.svg";
import { default as Feature3Icon } from "@public/images/home/feature3.svg";
import { default as Feature4Icon } from "@public/images/home/feature4.svg";
import { default as Feature5Icon } from "@public/images/home/feature5.svg";
import { default as Feature6Icon } from "@public/images/home/feature6.svg";
import { Dictionary } from "@/lib/locales";

const Features = ({ dictionary }: { dictionary: Dictionary }) => {
  const FEATURES: TFEATURES = [
    {
      id: 1,
      icon: Feature1Icon,
      description: dictionary.homePage.feature1Text,
    },
    {
      id: 2,
      icon: Feature2Icon,
      description: dictionary.homePage.feature2Text,
    },
    {
      id: 3,
      icon: Feature3Icon,
      description: dictionary.homePage.feature3Text,
    },
    {
      id: 4,
      icon: Feature4Icon,
      description: dictionary.homePage.feature4Text,
    },
    {
      id: 5,
      icon: Feature5Icon,
      description: dictionary.homePage.feature5Text,
    },
    {
      id: 6,
      icon: Feature6Icon,
      description: dictionary.homePage.feature6Text,
    },
  ];

  return (
    <section className="max-w-full overflow-scroll lg:overflow-auto lg:w-auto flex lg:grid grid-cols-3 mx-4 sm:mx-0 gap-4 sm:gap-8 md:gap-14 pb-10 lg:pb-20 px-4">
      {FEATURES.map((FEATURE) => (
        <Featurecard
          key={FEATURE.id + FEATURE.description}
          description={FEATURE.description}
          icon={FEATURE.icon}
        />
      ))}
    </section>
  );
};

export default Features;
