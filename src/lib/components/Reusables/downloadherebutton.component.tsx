"use client";

import React from "react";
import { Button } from "..";
import { usePathname } from "next/navigation";
import useLocale from "@/hooks/useLocale";

type PROPS = {
    className?: string;
    onClick?: () => void;
};

const DownloadHereButton: React.FC<PROPS> = ({ className = "", onClick = () => {} }) => {
    const { dictionary } = useLocale();
    const pathname = usePathname();
    const firstNest = pathname.split("/")[1];

    if (firstNest === "" || firstNest === "search") {
        return <div className={className}></div>;
    }

    return (
        <Button onClick={onClick} className={className + " download-here-btn"}>
            {dictionary.common.downloadHere}
        </Button>
    );
};

export default DownloadHereButton;
