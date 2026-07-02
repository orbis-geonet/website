"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { default as Expand } from "@public/icons/expand.svg";
import { Modal } from "@mui/material";
import { Button } from "..";
import { RxCross2 } from "react-icons/rx";
import { parseActiveTime } from "@/lib/utils";

type PROPS = {
  activeTime: { day: string; time: string }[];
  className?: string;
};

const SingleDay: React.FC<{
  day: string;
  time: string;
}> = ({ day, time }) => {
  return (
    <li className="flex justify-between">
      <p className="w-1/2 md:w-[150px]">{day}</p>
      <p className="">{time}</p>
    </li>
  );
};

export const TimePopupContent: React.FC<{
  activeTime: { day: string; time: string }[];
  withHeading?: boolean;
}> = ({ activeTime, withHeading = true }) => {
  return (
    <div className="space-y-8 w-full">
      {withHeading && (
        <h3 className="font-bold text-xl text-center">Horários disponíveis</h3>
      )}
      <ul className="space-y-6 w-full">
        {activeTime && activeTime.length !== 0 ? (
          activeTime.map((item, index) => (
            <SingleDay key={`${item.day}-${index}`} {...item} />
          ))
        ) : (
          <p>Horário indisponível para este local</p>
        )}
      </ul>
    </div>
  );
};

const ActiveTimePopup: React.FC<PROPS> = ({ activeTime, className = "" }) => {
  const [ModalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <div className={className}>
      <button onClick={handleOpen}>
        <Image
          className="h-[15px] w-[15px]"
          height={15}
          width={15}
          src={Expand}
          alt="expand-icon"
        />
      </button>
      <Modal
        open={ModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-activeTime"
        className="flex items-center justify-center"
      >
        <article className="relative bg-white mx-10 px-10 py-6 rounded-xl">
          <button
            className="absolute top-4 right-4"
            aria-label="Close"
            onClick={handleClose}
          >
            <RxCross2 className="text-primary text-opacity-30 text-xl" />
          </button>
          <TimePopupContent activeTime={parseActiveTime(activeTime)} />
          <div className="text-center pt-8">
            <Button onClick={handleClose}>Voltar</Button>
          </div>
        </article>
      </Modal>
    </div>
  );
};

export default ActiveTimePopup;
