"use client";
import React, { useState } from "react";
import {
  ChooseOSPopup,
  DownloadHereButton,
  FixedDownloadBar,
  Logo,
  Searchbar,
} from "..";
import Image from "next/image";
import { default as SearchIconSrc } from "@public/icons/search.svg";
import { Dictionary } from "@/lib/locales";
import LanguageSelector from "../Reusables/localeselector.component";

const Header = ({ dictionary }: { dictionary: Dictionary }) => {
  const [isSmallScreenSearchbarVisible, setSmallScreenSearchbarVisibility] =
    useState(false);
  const [query, setQuery] = useState("");

  const [ModalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);

  return (
    <div className="bg-white sticky top-0 z-20">
      <header className="flex items-center justify-between lg:gap-20 p-5 lg:p-0 w-full shadow-moreblurred lg:shadow-none lg:pt-7 lg:pb-4 lg:max-w-6xl  lg:mx-auto">
        <Logo withName={true} />
        <Searchbar
          query={query}
          setQuery={setQuery}
          className="hidden lg:flex"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 search-icon">
            <button
              className="block lg:hidden "
              onClick={() => {
                setSmallScreenSearchbarVisibility(
                  (isSmallScreenSearchbarVisible) =>
                    !isSmallScreenSearchbarVisible,
                );
              }}
            >
              <Image src={SearchIconSrc} alt="search-icon" height={18} />
            </button>
            <DownloadHereButton
              onClick={handleOpen}
              className="hidden md:block lg:hidden"
            />
          </div>
          <LanguageSelector />
          <DownloadHereButton
            onClick={handleOpen}
            className="hidden lg:block"
          />
        </div>
      </header>
      {isSmallScreenSearchbarVisible && (
        <div className="relative z-20 border-t lg:hidden bg-white py-2">
          <Searchbar
            query={query}
            setQuery={setQuery}
            className="max-w-full text-sm"
            mobileSearchbar={true}
            setSmallScreenSearchbarVisibility={
              setSmallScreenSearchbarVisibility
            }
          />
        </div>
      )}
      <FixedDownloadBar handleOpen={handleOpen} />
      <ChooseOSPopup ModalOpen={ModalOpen} setModalOpen={setModalOpen} />
    </div>
  );
};

export default Header;
