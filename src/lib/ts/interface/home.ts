import { StaticImageData } from "next/image";

interface TFEATURE {
  id: number;
  icon: StaticImageData;
  description: string;
}

export type TFEATURES = TFEATURE[];
