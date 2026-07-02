"use client";
import React from "react";
import { Spinner } from ".";

const LoadingComponent: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-10 font-bold text-2xl flex justify-center items-center">
      <Spinner />
    </div>
  );
};

export default LoadingComponent;
