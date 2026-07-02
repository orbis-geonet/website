import dynamic from "next/dynamic";

export const Features = dynamic(() => import("./features.section"));
export const Hero = dynamic(() => import("./hero.section"));
export const Video = dynamic(() => import("./video.section"));
