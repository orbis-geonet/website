"use client";
import React, { useRef, useState } from "react";
import { Button, CustomInput } from "..";
import { BASE_URL } from "@/lib/ts";
import { useRouter } from "next/navigation";
import useLocale from "@/hooks/useLocale";

const LoginForm = ({
  subscriptionKey,
  groupKey,
  type,
  quantity,
}: {
  subscriptionKey?: string;
  groupKey?: string | null;
  type?: string | null;
  quantity?: string | null;
}) => {
  const { dictionary } = useLocale();
  const formRef = useRef<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleLogin: React.FormEventHandler = async (e) => {
    setError("");
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formRef.current?.email.value,
          password: formRef.current?.password.value,
        }),
      });
      const data = await res.json();

      if (data.idToken) {
        formRef.current.email.value = "";
        formRef.current.password.value = "";
        setSuccess("Logged in successfully. Taking to checkout page.");

        if (subscriptionKey && groupKey)
          router.replace(
            `/subscribe/${subscriptionKey}?groupKey=${groupKey}&type=${type}&qty=${quantity}&idToken=${data.idToken}`,
          );
      } else if (data.message) {
        setError(data.message);
      } else {
        setError("Something went wrong");
      }
    } catch (err) {
      setError("Something went wrong");
      // console.log(err);
    }
  };

  return (
    <form ref={formRef} className="space-y-4 flex-1" onSubmit={handleLogin}>
      <h2 className="text-xl font-bold">{dictionary.auth.loginHeading}</h2>
      <CustomInput
        name="email"
        label={dictionary.auth.email}
        type="email"
        required
      />
      <CustomInput
        name="password"
        label={dictionary.auth.password}
        type="password"
        required
      />
      <Button className="py-4 px-14 mt-16  w-full sm:w-auto">
        {dictionary.auth.login}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </form>
  );
};

export default LoginForm;
