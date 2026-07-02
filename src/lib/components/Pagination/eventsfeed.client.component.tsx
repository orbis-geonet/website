"use client";

import { Eventcard, Spinner } from "@components";
import React, { useEffect, useState } from "react";
import { eventsMapper, getData } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { TEVENT } from "@/lib/ts";

const ClientEventsFeed: React.FC<{
  endpoint: string;
}> = ({ endpoint }) => {
  const [events, setEvents] = useState<TEVENT[]>([]);
  const [page, setPage] = useState(1);
  const [allResultsFetched, setAllResultsFetched] = useState(false);

  const { ref, inView } = useInView();

  const loadMoreEvents = async () => {
    if (allResultsFetched) return;

    try {
      const data = await getData(`/${endpoint}?page=${page}`);

      if (data.error) {
        return;
      }

      const newEvents = eventsMapper(data);

      setEvents((prevEvents) => [...prevEvents, ...newEvents]);

      setPage((currentPage) => currentPage + 1);

      if (newEvents.length < 20) setAllResultsFetched(true);
    } catch (error) {
      console.error("Error loading more Events:", error);
    }
  };

  useEffect(() => {
    if (allResultsFetched) return;
    if (inView) {
      loadMoreEvents();
    }
  }, [inView]);

  return (
    <>
      {events.map((event: TEVENT) => (
        <Eventcard key={event.id} {...event} />
      ))}
      {!allResultsFetched && (
        <div className="flex justify-center items-center flex-col gap-4 mt-4">
          <Spinner inviewref={ref} />
          <p>Loading more events...</p>
        </div>
      )}
    </>
  );
};

export default ClientEventsFeed;
