import React from "react";
import { MapBanner, ScrollToTop } from "@components";

const Layout = ({
  children,
  comments,
}: {
  children: React.ReactNode;
  comments: React.ReactNode;
}) => {
  return (
    <>
      <ScrollToTop />
      <main className="max-w-6xl mx-auto flex flex-col items-center pt-6 md:pt-0">
        <MapBanner className="mb-4" />
        <div className="mt-4 w-full md:w-fit md:shadow-moreblurred md:rounded-xl md:overflow-clip">
          {children}
          {comments}
        </div>
      </main>
    </>
  );
};

export default Layout;
