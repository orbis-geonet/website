export type Place = {
  slug: string;
  name: string;
  description?: string;
  imageName?: string;
  type: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export type Group = {
  slug: string;
  name: string;
  imageName: string;
  strokeColorHex: string;
};

export type Polygon = {
  places: Place[];
  dominantGroup: Group;
};

export type MapPolygon = {
  polygon: any; // Leaflet polygon type
  imageOverlay: any; // Leaflet imageOverlay type
  markers: any[]; // Leaflet marker type
  circle: any; // Leaflet circle type
};
