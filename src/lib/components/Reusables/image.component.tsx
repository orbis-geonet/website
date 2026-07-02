"use client";
import React, { useEffect, useState } from "react";
import { default as DImage, ImageProps } from "next/image";
import { cn, getURL } from "@utils";
import { default as DefaultImageSrc } from "@public/default/default_img.svg";
import Spinner from "./spinner.component";

interface PROPS extends ImageProps {
    src: string;
}

const Image: React.FC<PROPS> = ({ src, className = "", ...remainingProps }) => {
    const [imageSrc, setImageSrc] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const getImageSrc = async () => {
        setIsLoading(true);
        try {
            const url = await getURL(src);
            setImageSrc(url);
        } catch (error) {
            console.error("Error loading image:", error);
            setImageSrc("");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getImageSrc();
    }, [src]);

    if (isLoading) {
        return (
            <div
                {...remainingProps}
                className={cn(
                    "flex h-10 w-10 bg-[#d2d2d2] animate-pulse items-center justify-center relative",
                    className,
                )}></div>
        );
    }

    return <DImage src={imageSrc || DefaultImageSrc} className={cn("relative", className)} {...remainingProps} />;
};

export default Image;
