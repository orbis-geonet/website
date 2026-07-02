"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Dictionary } from "@/lib/locales";
import { ExchangeHeader } from "@sections";
import Footer from "./footer.component";
import { FixedDownloadBar, ChooseOSPopup } from "@components";
import { cn } from "@/lib/utils";

const ROUTES_WITH_TRANSPARENT_HEADER = ["/exchange",];
const ROUTES_WITHOUT_FOOTER = ["/network", "/exchange"];

const ConditionalChrome = ({ dictionary, children }: { dictionary: Dictionary; children: React.ReactNode }) => {
    const pathname = usePathname() ?? "";
    const transparentHeader = ROUTES_WITH_TRANSPARENT_HEADER.some((route) => pathname.startsWith(route));
    const [modalOpen, setModalOpen] = useState(false);

    const hideFooter = ROUTES_WITHOUT_FOOTER.some((route) => pathname.startsWith(route));

    return (
        <>
            <div className={cn("sticky top-0 z-20", transparentHeader ? "bg-transparent fixed w-full" : "bg-white")}>
                <ExchangeHeader onDownloadClick={() => setModalOpen(true)} />
            </div>
            {children}
            {!hideFooter && <Footer dictionary={dictionary} />}
            <FixedDownloadBar handleOpen={() => setModalOpen(true)} />
            <ChooseOSPopup ModalOpen={modalOpen} setModalOpen={setModalOpen} />
        </>
    );
};

export default ConditionalChrome;
