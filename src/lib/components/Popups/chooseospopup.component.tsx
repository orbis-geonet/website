import React from "react";
import { DownloadButton, Popup } from "..";
import { default as AppStoreIconSrc } from "@public/icons/appstore.svg";
import { default as PlayStoreIconSrc } from "@public/icons/playstore.svg";
import useLocale from "@/hooks/useLocale";

type PROPS = {
  ModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChooseOSPopup: React.FC<PROPS> = ({ ModalOpen, setModalOpen }) => {
  const { dictionary } = useLocale();
  return (
    <Popup ModalOpen={ModalOpen} setModalOpen={setModalOpen}>
      <article className="bg-white w-full max-w-[500px] py-8 shadow-sm m-4 rounded-xl">
        <h2 className="font-bold text-center mb-8 text-xl">
          {dictionary.common.chooseOS}
        </h2>
        <div className="flex flex-col min-[320px]:flex-row items-center justify-center  gap-4">
          <DownloadButton
            icon={AppStoreIconSrc}
            href="https://apps.apple.com/br/app/orbis-rede-geo-social/id1453025529"
          >
            App Store
          </DownloadButton>
          <DownloadButton
            icon={PlayStoreIconSrc}
            href="https://play.google.com/store/apps/details?id=com.orbis.orbis&rdid=com.orbis.orbis"
          >
            Google Play
          </DownloadButton>
        </div>
      </article>
    </Popup>
  );
};

export default ChooseOSPopup;
