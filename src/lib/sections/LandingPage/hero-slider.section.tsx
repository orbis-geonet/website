"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import GroupImage from "@public/images/home/slider/groups.jpeg";
import NearbyFeed from "@public/images/home/slider/nearby-feed.jpeg";
import PlaceImage from "@public/images/home/slider/place.jpeg";
import UserProfile from "@public/images/home/slider/user-profile.jpeg";
import Phone from "@public/images/home/slider/phone.png";
import FirstImage from "@public/images/home/slider/1.jpeg";
import SecondImage from "@public/images/home/slider/2.jpeg";
import ThirdImage from "@public/images/home/slider/3.jpeg";
import FourthImage from "@public/images/home/slider/4.jpeg";
import FifthImage from "@public/images/home/slider/5.jpeg";
import SixthImage from "@public/images/home/slider/6.jpeg";
import { cn } from "@/lib/utils";

// Both images are the same canvas: 3728 × 3471
const W = 3728;
const H = 3471;

const SLIDES = [
    { src: FirstImage, alt: "Tribe Clicked Map" },
    { src: SecondImage, alt: "Tribe not selected state of the map" },
    { src: ThirdImage, alt: "Places visible on map" },
    { src: FourthImage, alt: "Fourth slide" },
    { src: FifthImage, alt: "Fifth slide" },
    { src: SixthImage, alt: "Nearby Tribes" },
    { src: NearbyFeed, alt: "Nearby feed" },
    { src: GroupImage, alt: "Group page" },
    { src: PlaceImage, alt: "Place page" },
    { src: UserProfile, alt: "User profile" },
];

const DISPLAY_MS = 6000;
const FADE_MS = 0;

const SWIPE_THRESHOLD = 50;

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);
    const [fading, setFading] = useState(false);
    const dragStart = useRef<number | null>(null);

    const goTo = useCallback((index: number) => {
        setFading(true);
        setTimeout(() => {
            setCurrent(index);
            setFading(false);
        }, FADE_MS);
    }, []);

    const goNext = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
    const goPrev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

    useEffect(() => {
        const timer = setInterval(goNext, DISPLAY_MS);
        return () => clearInterval(timer);
    }, [goNext]);

    const onDragStart = (x: number) => {
        dragStart.current = x;
    };
    const onDragEnd = (x: number) => {
        if (dragStart.current === null) return;
        const diff = dragStart.current - x;
        if (Math.abs(diff) >= SWIPE_THRESHOLD) diff > 0 ? goNext() : goPrev();
        dragStart.current = null;
    };

    const slide = SLIDES[current];

    return (
        <div
            className="flex flex-col items-center gap-4 select-none"
            onMouseDown={(e) => onDragStart(e.clientX)}
            onMouseUp={(e) => onDragEnd(e.clientX)}
            onMouseLeave={() => {
                dragStart.current = null;
            }}
            onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
            onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}>
            <div className="relative">
                <div style={{ opacity: fading ? 0 : 1, transition: `opacity ${FADE_MS}ms ease` }}>
                    <Image
                        src={slide.src}
                        alt={slide.alt}
                        width={W}
                        height={H}
                        className="h-[420px] w-auto lg:h-[650px] object-contain rounded-[30px]"
                        priority
                    />
                </div>
                <Image
                    src={Phone}
                    alt="iPhone"
                    width={W}
                    height={H}
                    className={cn("h-[calc(100%+2rem)] min-w-[calc(100%+2rem)] absolute -top-4 -left-4 -right-4", current < 3 ? "-top-6" : "")}
                />
            </div>
            <div className="flex items-center gap-2 pt-6">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            if (!fading) goTo(i);
                        }}
                        aria-label={`Slide ${i + 1}`}
                        className={`rounded-full transition-all duration-300 ${
                            i === current ? "bg-black w-6 h-2" : "bg-black/30 w-2 h-2 hover:bg-black/60"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
