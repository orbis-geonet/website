"use client";
import React, { useEffect, useState } from "react";
import {
  Appearance,
  StripeElementsOptions,
  loadStripe,
} from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { CheckoutForm, Heading, Spinner } from "@components";
import { BASE_URL } from "@/lib/ts";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import useLocale from "@/hooks/useLocale";

const getStripePromise = (publicToken: string) => {
  return loadStripe(publicToken);
};

export default function App({ params }: { params: { id: string } }) {
  const { dictionary } = useLocale();
  const [clientSecret, setClientSecret] = useState("");
  const [publicToken, setPublicToken] = useState("");
  const [badReqError, setBadReqError] = useState(false);
  const searchParams = useSearchParams();

  const fetchKeys = async (idToken: string | null) => {
    if (!idToken) return;

    const type = searchParams.get("type");
    const qty = searchParams.get("qty");

    let res;

    if (type === "ONE_TIME") {
      if (!qty) return;
      res = await fetch(
        `${BASE_URL}/api/profile/purchase/${params.id}/buy?number=${qty}`,
        {
          method: "POST",
          cache: "no-cache",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );
    } else {
      res = await fetch(
        `${BASE_URL}/api/profile/subscription/${params.id}/subscribe`,
        {
          method: "POST",
          cache: "no-cache",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );
    }

    if (res.status === 400) setBadReqError(true);

    if (!res.ok) return;

    const data = await res.json();

    setClientSecret(data.clientSecret);
    setPublicToken(data.publicToken);
  };

  useEffect(() => {
    if (!searchParams.get("groupKey")) return;

    const idToken = searchParams.get("idToken");
    if (!idToken) return;

    fetchKeys(idToken);
  }, []);

  const appearance: Appearance = {
    theme: "flat",
    variables: {
      fontFamily: ' "Gill Sans", sans-serif',
      fontLineHeight: "1.5",
      borderRadius: "10px",
      colorBackground: "#F6F8FA",
      colorPrimaryText: "#262626",
    },
    rules: {
      ".Block": {
        backgroundColor: "var(--colorBackground)",
        boxShadow: "none",
        padding: "12px",
      },
      ".Input": {
        padding: "12px",
      },
      ".Input:disabled, .Input--invalid:disabled": {
        color: "lightgray",
      },
      ".Tab": {
        padding: "10px 12px 8px 12px",
        border: "none",
      },
      ".Tab:hover": {
        border: "none",
        boxShadow:
          "0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)",
      },
      ".Tab--selected, .Tab--selected:focus, .Tab--selected:hover": {
        border: "none",
        backgroundColor: "#fff",
        boxShadow:
          "0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)",
      },
      ".Label": {
        fontWeight: "500",
      },
    },
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
    locale: "pt",
  };

  if (badReqError) {
    return (
      <div className="mt-10 flex items-center justify-center py-20">
        <div className="w-[min(100vw,700px)] space-y-4 md:space-y-6 mx-4 lg:mx-0">
          <Heading>
            {dictionary.paymentStatusPage.paymentCannotBeCompletedErrorHeading}
          </Heading>
          <Heading type="h4">
            {
              dictionary.paymentStatusPage
                .paymentCannotBeCompletedErrorDescription
            }
          </Heading>
          <Link
            className="text-xs md:text-base w-fit flex items-center justify-center font-medium text-white bg-primary
          py-3 px-8 rounded-md whitespace-nowrap mt-4"
            href="/"
          >
            {dictionary.common.goToHomepage}
          </Link>
        </div>
      </div>
    );
  }

  if (!clientSecret || !publicToken) {
    return (
      <div className="mt-10 flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="App mt-10">
      {clientSecret && (
        <Elements options={options} stripe={getStripePromise(publicToken)}>
          <CheckoutForm
            groupID={searchParams.get("groupKey")}
            idToken={searchParams.get("idToken")}
          />
        </Elements>
      )}
    </div>
  );
}
