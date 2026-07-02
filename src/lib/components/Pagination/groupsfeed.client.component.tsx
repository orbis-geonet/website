"use client";

import { Groupcardsmall, Spinner } from "@components";
import React, { useEffect, useState } from "react";
import { TUSERGROUP } from "@interface";
import { getData, groupsMapper } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

const ClientGroupFeed: React.FC<{
  endpoint: string;
}> = ({ endpoint }) => {
  const [groups, setGroups] = useState<TUSERGROUP[]>([]);
  const [page, setPage] = useState(1);
  const [allResultsFetched, setAllResultsFetched] = useState(false);

  const { ref, inView } = useInView();

  const loadMoreGroups = async () => {
    if (allResultsFetched) return;
    try {
      const data = await getData(`/${endpoint}&page=${page}`);

      if (data.error) {
        return;
      }

      const newGroups = groupsMapper(data);

      setGroups((prevGroups) => [...prevGroups, ...newGroups]);

      setPage((currentPage) => currentPage + 1);

      if (newGroups.length < 100) setAllResultsFetched(true);
    } catch (error) {
      console.error("Error loading more Users:", error);
    }
  };

  useEffect(() => {
    if (allResultsFetched) return;

    if (inView) {
      loadMoreGroups();
    }
  }, [inView]);

  return (
    <>
      {groups.map((group) => (
        <Groupcardsmall key={group.id} {...group} />
      ))}
      {!allResultsFetched && (
        <div className="flex justify-center items-center flex-col gap-4 mt-4">
          <Spinner inviewref={ref} />
          <p>Loading more groups...</p>
        </div>
      )}
    </>
  );
};

export default ClientGroupFeed;
