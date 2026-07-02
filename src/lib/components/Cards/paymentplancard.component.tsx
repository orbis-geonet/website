"use client";
import React, { useState } from "react";
import { default as PaymentBg } from "@public/images/bg/paymentplans.webp";
import Image from "next/image";
import { Button, Imageslider, Popup } from "..";
import { default as GreenTick } from "@public/icons/greentick.svg";
import { TPLAN } from "@/lib/ts";
import { BsArrowsAngleExpand } from "react-icons/bs";
import useLocale from "@/hooks/useLocale";
interface PROPS extends TPLAN {
  groupKey: string;
}

type FEATUREPROPS = {
  children: React.ReactNode;
};

const SingleFeature: React.FC<FEATUREPROPS> = ({ children }) => {
  return (
    <li className="flex items-center gap-2 px-2">
      <Image
        className="h-[12px] w-[16px] object-cover"
        height={12}
        width={16}
        alt="tick-mark"
        src={GreenTick}
      />
      <p className="font-light text-[12px]">{children}</p>
    </li>
  );
};

const Paymentplancard: React.FC<PROPS> = ({
  id,
  title,
  description,
  price,
  features,
  currency,
  groupKey,
  interval,
  period,
  type,
  images,
}) => {
  const { dictionary } = useLocale();
  const [quantity, setQuantity] = useState(1);
  const [ModalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);

  const getExplainerText = () => {
    switch (type) {
      case "UNLIMITED":
        switch (interval) {
          case "YEAR":
            return `${dictionary.plansPage.youWillBeCharged} ${currency} ${price.toFixed(2)} ${
              dictionary.plansPage.onceAYear
            }`;
          case "MONTH":
            return `${dictionary.plansPage.youWillBeCharged} ${currency} ${price.toFixed(2)} ${
              dictionary.plansPage.onceAMonth
            }`;
          default:
            return "";
        }
      case "INTERVAL":
        switch (interval) {
          case "YEAR":
            return `${dictionary.plansPage.in} ${period} ${
              dictionary.plansPage.annualInstallment
            } ${currency} ${(period * price).toFixed(2)}`;
          case "MONTH":
            return `${dictionary.plansPage.in} ${period} ${
              dictionary.plansPage.monthlyInstallment
            } ${currency} ${(period * price).toFixed(2)}`;
          default:
            return "";
        }
      case "ONE_TIME":
        return dictionary.plansPage.perUnit;
    }
  };

  return (
    <>
      {images && images.length != 0 && (
        <Popup
          ModalOpen={ModalOpen}
          setModalOpen={setModalOpen}
          showCloseIcon={true}
        >
          <article className="border-0 focus:border-0 focus:outline-none">
            <Imageslider images={images} popup={true} />
          </article>
        </Popup>
      )}
      <article className="bg-primary relative overflow-hidden mx-auto sm:mx-0 min-w-full sm:min-w-[350px] max-w-[350px] rounded-2xl py-4 px-4">
        <Image
          className="absolute inset-0 object-cover"
          alt="bg-image"
          src={PaymentBg}
        />
        <div className="relative z-10 text-white flex flex-col justify-between h-full">
          <div className="space-y-8">
            <div className="px-4 space-y-8">
              <h2 className="text-center font-bold text-xl">{title}</h2>
              <p className="text-[12px] text-gray-400 text-center">
                {description}
              </p>
              <div className="text-center space-y-2">
                {" "}
                <div className="flex gap-1 justify-center">
                  <p className="text-2xl font-bold">{currency}</p>
                  <p className="font-bold text-6xl">{price.toFixed(2)}</p>
                  {type && type !== "ONE_TIME" && (
                    <p className="font-bold text-2xl">
                      <span className="text-6xl font-lighter">/</span>
                      {interval === "MONTH"
                        ? "mês"
                        : interval === "YEAR" && "ano"}
                    </p>
                  )}
                </div>
                <p className="font-light tracking-widest text-xs md:text-sm">
                  {getExplainerText()}
                </p>
              </div>
              {images && images.length != 0 && (
                <button
                  className="text-white flex gap-2 items-center w-full justify-center"
                  onClick={handleOpen}
                >
                  {dictionary.plansPage.seeImages} <BsArrowsAngleExpand />
                </button>
              )}
            </div>
            <ul className="space-y-4 py-8">
              {features.map((feature) => (
                <SingleFeature key={feature}>{feature}</SingleFeature>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            {type === "ONE_TIME" && (
              <input
                defaultValue={1}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                type="number"
                placeholder="Quantity"
                className="w-full py-3 px-4 rounded-md focus:outline-none text-primary"
              ></input>
            )}
            <Button
              href={`/subscribe/${id}?groupKey=${groupKey}&type=${type}&qty=${quantity}`}
              invertedColors={true}
              className="block w-full"
            >
              {dictionary.plansPage.buy}
            </Button>
          </div>
        </div>
      </article>
    </>
  );
};

export default Paymentplancard;
