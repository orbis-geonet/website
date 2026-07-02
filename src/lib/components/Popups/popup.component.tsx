"use client";
import React, { ReactElement } from "react";
import { Modal } from "@mui/material";
import { RxCross2 } from "react-icons/rx";

type PROPS = {
  ModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactElement;
  showCloseIcon?: boolean;
};
const Popup: React.FC<PROPS> = ({
  ModalOpen,
  setModalOpen,
  children,
  showCloseIcon = false,
}) => {
  const handleClose = () => setModalOpen(false);
  return (
    <Modal
      open={ModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-activeTime"
      className="flex items-center justify-center"
    >
      <>
        {showCloseIcon && (
          <button aria-label="Close" onClick={handleClose}>
            <RxCross2 className="absolute top-2 right-2 md:top-4 md:right-4 text-white text-xl" />
          </button>
        )}
        {children}
      </>
    </Modal>
  );
};

export default Popup;
