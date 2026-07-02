"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useParams } from "next/navigation";
import { getData } from "@/lib/utils";
import { Image } from "..";
import Link from "next/link";

const BacktoGroupButton = () => {
  const id = useParams().id;
  const [group, setGroup] = useState<{
    id: string;
    slug: string;
    name: string;
    image: string;
    color: string;
  }>();

  const fetchGroupData = async () => {
    const groupData = await getData(`groups/${id}`);
    if (groupData.error) return console.log("something went wrong");
    const groupDetails = {
      id: groupData.groupKey,
      slug: groupData.slug,
      image: groupData.imageName,
      name: groupData.name,
      color: groupData.strokeColorHex,
    };
    setGroup(groupDetails);
  };

  useEffect(() => {
    fetchGroupData();
  }, []);

  if (!group) return;
  return (
    <Link
      className="flex items-center gap-2 absolute left-0"
      href={`/group/${group.slug}`}
    >
      <IoIosArrowBack size={40} className="text-black text-opacity-50" />
      <Image
        style={{
          border: `3px solid ${group.color}`,
        }}
        className="h-[45px] w-[45px] object-cover rounded-full"
        height={80}
        width={80}
        alt="group-image"
        src={`groupPictures/${group?.image}`}
      />
      <p className="hover:underline">{group?.name}</p>
    </Link>
  );
};

export default BacktoGroupButton;
