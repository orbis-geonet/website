import Image, { StaticImageData } from "next/image";
import React from "react";

type PROPS = {
  icon: StaticImageData;
  description: string;
};

const Featurecard: React.FC<PROPS> = ({ icon, description }) => {
  return (
    <article className="bg-white self-start shadow-light flex flex-col items-center mx-auto min-w-full sm:min-w-[350px] px-10 py-8 rounded-xl space-y-10">
      <Image alt="feature-image" src={icon} />
      <p className="">
        <span className="text-[#999999]">{description}</span>
      </p>
    </article>
  );
};

export default Featurecard;
