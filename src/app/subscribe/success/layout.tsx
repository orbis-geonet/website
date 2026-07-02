"use client";
import React from "react";
import { BackButton } from "@components";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="max-w-6xl mx-auto mt-10 mb-20">
      <section>
        <BackButton />
      </section>
      {children}
    </main>
  );
};

export default Layout;
