import { notFound } from "next/navigation";

// Subscriptions are no longer offered — this route is disabled and returns 404.
// The original implementation is preserved (commented out) below in case it is reinstated.
export default function Page() {
  return notFound();
}

/* ----- ORIGINAL IMPLEMENTATION (disabled: subscriptions removed) -----
"use client";
import { LoginForm, RegisterForm } from "@components";
import { useSearchParams } from "next/navigation";
import React from "react";

const Auth = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const searchParams = useSearchParams();
  const props = {
    subscriptionKey: params.id,
    groupKey: searchParams.get("groupKey"),
    type: searchParams.get("type"),
    quantity: searchParams.get("qty"),
  };
  return (
    <section className="flex flex-col md:flex-row gap-10 mt-10 md:mt-28 mx-4 lg:mx-0">
      <RegisterForm {...props} />
      <LoginForm {...props} />
    </section>
  );
};

export default Auth;
----- END ORIGINAL ----- */
