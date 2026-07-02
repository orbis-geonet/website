"use client";

import { Spinner, Comment } from "@components";
import React, { useEffect, useState } from "react";
import { commentsMapper, getData } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { TCOMMENTWITHREPLIES } from "@/lib/ts";

const ClientComments: React.FC<{
  endpoint: string;
}> = ({ endpoint }) => {
  const [comments, setComments] = useState<TCOMMENTWITHREPLIES[]>([]);
  const [page, setPage] = useState(1);
  const [allResultsFetched, setAllResultsFetched] = useState(false);

  const { ref, inView } = useInView();

  const loadMoreComments = async () => {
    if (allResultsFetched) return;
    try {
      const data = await getData(`/${endpoint}?page=${page}`);

      if (data.error) {
        return;
      }

      const newComments = commentsMapper(data);

      setComments((prevComments) => [...prevComments, ...newComments]);

      setPage((currentPage) => currentPage + 1);

      if (newComments.length < 20) setAllResultsFetched(true);
    } catch (error) {
      console.error("Error loading more Comments:", error);
    }
  };

  useEffect(() => {
    if (allResultsFetched) return;
    if (inView) {
      loadMoreComments();
    }
  }, [inView]);

  return (
    <>
      {comments.map((comment) => (
        <Comment key={comment.id} {...comment} />
      ))}
      {!allResultsFetched && (
        <div className="flex justify-center items-center flex-col gap-4 mt-4">
          <Spinner inviewref={ref} />
          <p>Loading more Comments...</p>
        </div>
      )}
    </>
  );
};

export default ClientComments;
