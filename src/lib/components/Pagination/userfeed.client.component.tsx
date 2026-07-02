"use client";

import { Spinner, Usercard } from "@components";
import React, { useEffect, useState } from "react";
import { TUSER } from "@interface";
import { getData, usersMapper } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

const ClientUserFeed: React.FC<{
  endpoint: string;
  query?: string;
  feedLocation?: string;
}> = ({ endpoint, query, feedLocation }) => {
  const [users, setUsers] = useState<TUSER[]>([]);
  const [page, setPage] = useState(1);
  const [allResultsFetched, setAllResultsFetched] = useState(false);

  const { ref, inView } = useInView();

  const loadMoreUsers = async () => {
    if (allResultsFetched) return;

    try {
      let data;
      if (query) {
        data = await getData(`/${endpoint}?page=${page}&${query}`);
      } else {
        data = await getData(`/${endpoint}?page=${page}`);
      }

      if (data.error) {
        return;
      }

      const newUsers = usersMapper(data, feedLocation);

      setUsers((prevUsers) => [...prevUsers, ...newUsers]);

      setPage((currentPage) => currentPage + 1);

      if (newUsers.length < 20) setAllResultsFetched(true);
    } catch (error) {
      console.error("Error loading more Users:", error);
    }
  };

  useEffect(() => {
    if (allResultsFetched) return;

    if (inView) {
      loadMoreUsers();
    }
  }, [inView]);

  return (
    <>
      {users.map((user) => {
        if (user.id === undefined) return;
        return <Usercard key={user.id} {...user} />;
      })}
      {!allResultsFetched && (
        <div className="flex justify-center items-center flex-col gap-4 mt-4">
          <Spinner inviewref={ref} />
          <p>Loading more users...</p>
        </div>
      )}
    </>
  );
};

export default ClientUserFeed;
