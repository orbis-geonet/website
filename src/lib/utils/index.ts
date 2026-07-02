import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export * from "./getURL";
export * from "./getData";
export * from "./getMediaSrc";
export * from "./Mappers";
export * from "./formatTime";
export * from "./getDefaultPlaceImage";
export * from "./extractLinks";
export * from "./parseActiveTime";
export * from "./schemas";
export * from "./parseAddress";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
