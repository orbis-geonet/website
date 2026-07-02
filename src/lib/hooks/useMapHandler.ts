import { useState, useEffect, useCallback, useRef } from "react";
import type Leaflet from "leaflet";
import MapHandler from "@/lib/utils/map.utils";

type City = {
  lat: number;
  long: number;
  cityName: string;
  locality?: string;
};

type UseMapHandlerProps = {
  currentCity: City;
  setCurrentCity: (city: City) => void;
  setActivePolygon: (polygon: any) => void;
  setActivePlace: (place: any) => void;
};

export const useMapHandler = ({
  currentCity,
  setCurrentCity,
  setActivePolygon,
  setActivePlace,
}: UseMapHandlerProps) => {
  const [mapHandler, setMapHandler] = useState<MapHandler | null>(null);
  const [leaflet, setLeaflet] = useState<typeof Leaflet | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const initializeMap = useCallback(
    async (containerRef: HTMLElement) => {
      try {
        const L = await import("leaflet");
        setLeaflet(L);

        const handler = new MapHandler(
          L,
          setCurrentCity,
          setActivePolygon,
          setActivePlace,
        );
        handler.initializeMap(currentCity, containerRef as HTMLDivElement);
        setMapHandler(handler);

        // Store cleanup function
        cleanupRef.current = () => {
          handler.destroyMap();
          setMapHandler(null);
        };
      } catch (error) {
        console.error("Failed to initialize map:", error);
      }
    },
    [currentCity, setCurrentCity, setActivePolygon, setActivePlace],
  );

  const addPolygons = useCallback(
    (polygons: any[]) => {
      if (mapHandler?.isMapInitialized() && polygons.length > 0) {
        mapHandler.addPolygons(polygons);
      }
    },
    [mapHandler],
  );

  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  return {
    mapHandler,
    leaflet,
    initializeMap,
    addPolygons,
  };
};
