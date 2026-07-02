"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Heading } from "@/lib/components";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <Heading>Something went wrong</Heading>
      <button
        className="text-xs md:text-base  flex items-center justify-center font-medium text-white bg-primary
        py-3 px-8 rounded-md whitespace-nowrap mt-4"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
