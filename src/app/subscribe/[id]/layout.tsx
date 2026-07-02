"use client";
import React from "react";
import { BackButton } from "@components";
import { useSearchParams } from "next/navigation";

const Layout = ({
  children,
  auth,
}: {
  children: React.ReactNode;
  auth: React.ReactNode;
}) => {
  const idToken = useSearchParams().get("idToken");

  return (
    <main className="max-w-6xl mx-auto mt-10 mb-20">
      <section>
        <BackButton />
      </section>
      {idToken ? children : auth}
    </main>
  );
};

export default Layout;
