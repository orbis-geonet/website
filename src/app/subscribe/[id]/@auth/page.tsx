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
