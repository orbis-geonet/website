export interface TPLACE {
  id: string;
  slug: string;
  name: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  image: string;
  type?: string;
  website?: string;
  rating?: number;
  address?: string;
  tel?: string;
  activeTime?: { day: string; time: string }[];
  description?: string;
  groups?: {
    id: string;
    slug: string;
    name: string;
    image: string;
    percentage: number;
    color: string;
  }[];
}
