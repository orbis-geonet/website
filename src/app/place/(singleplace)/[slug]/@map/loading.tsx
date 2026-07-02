import React from "react";
import { LoadingComponent } from "@components";

const Loading = () => {
  return (
    <aside className="w-full h-[300px] lg:h-[550px] lg:w-[400px] min-w-[400px] bg-gray-100">
      <LoadingComponent />
    </aside>
  );
};

export default Loading;
