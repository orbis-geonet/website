"use client";
import React from "react";

import { Button } from "@components";
import useLocale from "@/hooks/useLocale";

const FixedDownloadBar: React.FC<{ handleOpen: () => void }> = ({
  handleOpen,
}) => {
  const { dictionary } = useLocale();
  return (
    <div className="md:hidden fixed bottom-0 w-full z-20 bg-white p-4 border-0 download-bar">
      <Button onClick={handleOpen} className="w-full">
        {dictionary.common.downloadHere}
      </Button>
    </div>
  );
};

export default FixedDownloadBar;
