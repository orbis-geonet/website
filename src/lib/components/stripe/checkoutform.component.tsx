"use client";
import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/lib/ts";
import { Spinner } from "..";
import useLocale from "@/hooks/useLocale";

export default function CheckoutForm({
  groupID,
  idToken,
}: {
  groupID: string | null;
  idToken: string | null;
}) {
  const { dictionary } = useLocale();
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const redirectToFailed = React.useCallback(
    () => router.push("/subscribe/success?redirect_status=failed"),
    [router],
  );
  const redirectToSuccess = React.useCallback(
    () => router.push("/subscribe/success?redirect_status=succeeded"),
    [router],
  );

  React.useEffect(() => {
    if (!stripe || !idToken) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          redirectToSuccess();
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          redirectToFailed();
          break;
        default:
          setMessage("Something went wrong.");
          redirectToFailed();
          break;
      }
    });
  }, [stripe, idToken, redirectToFailed, redirectToSuccess]);

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const becomeMemberRes = await fetch(
      `${BASE_URL}/api/groups/${groupID}/members`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );

    if (!becomeMemberRes.ok) {
      localStorage.removeItem("idToken");
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${BASE_URL}/subscribe/success`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
      redirectToFailed();
    } else {
      setMessage("An unexpected error occurred.");
      redirectToFailed();
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="mx-4 lg:mx-0">
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? (
            <div className="m-4 flex items-center gap-2">
              <Spinner /> <p>{dictionary.paymentPage.processingPayment}</p>
            </div>
          ) : (
            <div
              className="text-xs md:text-base  flex items-center justify-center font-medium text-white bg-primary
          py-3 px-8 rounded-md whitespace-nowrap mt-4"
            >
              {dictionary.paymentPage.payNow}
            </div>
          )}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
