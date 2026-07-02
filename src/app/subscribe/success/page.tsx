"use client";
import React, { useEffect } from "react";
import { default as SuccessfulPayment } from "@public/successful-payment.svg";
import { default as FailedPayment } from "@public/failed-payment.svg";
import Image from "next/image";
import { Heading } from "@/lib/components";
import Link from "next/link";
import { Typography } from "@mui/material";
import useLocale from "@/hooks/useLocale";

type PROPS = {
  searchParams: {
    redirect_status: string;
  };
};

// redirect_status=succeeded

const SuccessPage: React.FC<PROPS> = ({ searchParams }) => {
  const status = searchParams?.redirect_status;
  const { dictionary } = useLocale();

  return (
    <div className="mt-10 lg:mt-20 flex gap-10 lg:gap-24 items-center justify-center flex-wrap mx-10">
      <aside>
        {status === "succeeded" ? (
          <Image src={SuccessfulPayment} alt="payment-successfull" />
        ) : (
          <Image src={FailedPayment} alt="payment-failed" />
        )}
      </aside>
      <aside className="max-w-sm space-y-4 md:space-y-6">
        {status === "succeeded" ? (
          <>
            <Heading>{dictionary.paymentStatusPage.successHeading}</Heading>
            <Typography>
              {dictionary.paymentStatusPage.successDescription}
            </Typography>
          </>
        ) : (
          <>
            <Heading>{dictionary.paymentStatusPage.errorHeading}</Heading>
            <Typography>
              {dictionary.paymentStatusPage.errorDescription}
            </Typography>
          </>
        )}

        <Link
          className="text-xs md:text-base w-fit flex items-center justify-center font-medium text-white bg-primary
          py-3 px-8 rounded-md whitespace-nowrap mt-4"
          href="/"
        >
          {dictionary.paymentStatusPage.buttonText}
        </Link>
      </aside>
    </div>
  );
};

export default SuccessPage;
