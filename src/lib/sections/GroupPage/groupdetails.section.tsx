import React from "react";
import { Breadcrumbs, Heading, Typography, Image } from "@components";
import { Dictionary } from "@/lib/locales";

type PROPS = {
  id: string;
  color: string;
  image: string;
  name: string;
  description: string;
  dictionary: Dictionary;
};

const GroupDetails: React.FC<PROPS> = ({
  dictionary,
  color,
  image,
  name,
  description,
}) => {
  const pathList = [
    {
      text: dictionary.common.home,
      href: "/",
    },
    {
      text: dictionary.common.group,
      href: "#",
    },
  ];
  return (
    <article className="flex flex-col md:flex-row gap-4 md:gap-10 lg:gap-20 md:mt-10">
      <Breadcrumbs pathList={pathList} className="md:hidden ml-4" />
      <aside className="min-h-[200pxx] min-w-[200px] md:min-h-[250px] md:min-w-[250px] lg:min-h-[300px] lg:min-w-[300px] flex items-center justify-center md:block ">
        <Image
          style={{
            border: `10px solid ${color ? color : "rgba(109, 255, 177, 1)"}`,
            boxShadow: `0 10px 30px 0 ${color ? `${color}70` : "rgba(109, 255, 177, 0.7)"}`,
          }}
          className="h-[200px] w-[200px] md:h-[250px] md:w-[250px] lg:h-[300px] lg:w-[300px] object-cover rounded-full"
          width={300}
          height={300}
          alt="group-profile"
          src={image}
        />
      </aside>
      <aside className="-mt-3 space-y-1 md:space-y-5 text-center md:text-start">
        <Breadcrumbs pathList={pathList} className="hidden md:flex" />
        <Heading>{name}</Heading>
        <Typography className="px-10 md:px-0 md:max-w-[560px]">
          {description}
        </Typography>
      </aside>
    </article>
  );
};

export default GroupDetails;
