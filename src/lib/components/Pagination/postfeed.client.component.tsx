"use client";

import { Button, Checkinslider, Eventcard, Spinner } from "@components";
import React, { useEffect, useState } from "react";
import { Postcard } from "@components";
import { TCHECKIN, TEVENTPOST, TPOST } from "@interface";
import { getData, postsMapper } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

const ClientPostFeed: React.FC<{
  initialNextPageToken: string;
  endpoint: string;
  limitInfiniteScrolling?: boolean;
  feedLocation?: string;
}> = ({
  initialNextPageToken,
  endpoint,
  limitInfiniteScrolling = false,
  feedLocation,
}) => {
  const [posts, setPosts] = useState<
    (TPOST | TEVENTPOST | { type: string; checkins: TCHECKIN[] })[] | []
  >([]);
  const [nextPageToken, setNextPageToken] = useState(initialNextPageToken);
  const [infiniteScrollCount, setInfiniteScrollCount] = useState(0);
  const [allResultsFetched, setAllResultsFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  const loadMorePosts = async () => {
    if (allResultsFetched) return;

    if (!nextPageToken) return;
    setLoading(true);

    try {
      const data = await getData(
        `${endpoint}?nextPage=${nextPageToken}&size=5`,
      );

      if (data.error) {
        return;
      }

      const newPosts = postsMapper(data);

      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setNextPageToken(data.nextPage);

      if (newPosts.length < 5) setAllResultsFetched(true);
    } catch (error) {
      console.error("Error loading more posts:", error);
    }

    setLoading(false);

    if (limitInfiniteScrolling && infiniteScrollCount !== 3)
      setInfiniteScrollCount((infiniteScrollCount) => infiniteScrollCount + 1);
  };

  useEffect(() => {
    if (allResultsFetched) return;
    if (limitInfiniteScrolling && infiniteScrollCount === 3) return;
    if (inView) {
      loadMorePosts();
    }
  }, [inView]);

  return (
    <section className="space-y-8 max-w-6xl mx-auto">
      {posts.map((singlePost: any) => {
        if (singlePost.type === "CHECKIN")
          return (
            <Checkinslider
              key={singlePost.checkins[0].postid}
              checkins={singlePost.checkins}
              sliderLocation={feedLocation}
            />
          );
        if (singlePost.type === "EVENT")
          return <Eventcard key={singlePost.id} {...singlePost} />;
        return <Postcard key={singlePost.postid} {...singlePost} />;
      })}

      {limitInfiniteScrolling && infiniteScrollCount === 3 ? (
        loading ? (
          <div className="flex justify-center items-center flex-col gap-4">
            <Spinner inviewref={ref} />
            <p>Loading more posts...</p>
          </div>
        ) : (
          !allResultsFetched && (
            <div className="pt-14 ">
              <Button
                onClick={loadMorePosts}
                className="block mx-auto"
                outlined={true}
              >
                Ver mais
              </Button>
            </div>
          )
        )
      ) : (
        !allResultsFetched && (
          <div className="flex justify-center items-center flex-col gap-4">
            <Spinner inviewref={ref} />
            <p>Loading more posts...</p>
          </div>
        )
      )}
    </section>
  );
};

export default ClientPostFeed;
