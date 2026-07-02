"use client";

import { Groupcard, Spinner } from "@components";
import React, { useEffect, useState } from "react";
import { TSEARCHRESULTGROUP } from "@interface";
import { getData, searchResultsMapper } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

const ClientSearchResults: React.FC<{
  query: string;
}> = ({ query }) => {
  const [groups, setGroups] = useState<TSEARCHRESULTGROUP[]>([]);
  const [page, setPage] = useState(1);
  const [allResultsFetched, setAllResultsFetched] = useState(false);

  const { ref, inView } = useInView();

  const loadMoreGroups = async () => {
    if (allResultsFetched) return;

    try {
      const data = await getData(`/groups?name=${query}&page=${page}`);

      if (data.error) {
        return;
      }

      const newGroups = searchResultsMapper(data);

      setGroups((prevGroups) => [...prevGroups, ...newGroups]);

      setPage((currentPage) => currentPage + 1);

      if (newGroups.length < 20) setAllResultsFetched(true);
    } catch (error) {
      console.error("Error loading more groups:", error);
    }
  };

  useEffect(() => {
    if (allResultsFetched) return;
    if (inView) {
      loadMoreGroups();
    }
  }, [inView]);

  return (
    <div className="space-y-4 md:space-y-6 my-4 md:my-6">
      {groups.map((group: TSEARCHRESULTGROUP) => (
        <Groupcard key={group.id} {...group} />
      ))}
      {!allResultsFetched && (
        <div className="flex justify-center items-center flex-col gap-4 mt-4">
          <Spinner inviewref={ref} />
          <p>Loading more groups...</p>
        </div>
      )}
    </div>
  );
};

export default ClientSearchResults;
