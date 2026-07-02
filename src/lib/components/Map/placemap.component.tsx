"use client";

import { useEffect, useRef, useState } from "react";
import type Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import { getDefaultPlaceImagePath, getURL } from "@utils";

type PROPS = {
  latitude: number;
  longitude: number;
  className?: string;
  image?: string;
  color: string;
  type?: string;
};

const PlaceMap: React.FC<PROPS> = ({
  latitude,
  longitude,
  className = "",
  image,
  color,
  type,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [L, setLeafletInstance] = useState<typeof Leaflet | null>(null);
  const getImageSrc = async () => {
    if (image) {
      const url = await getURL(`placePictures/${image}`);
      setImageSrc(url);
    }
  };

  // Import Leaflet client side
  useEffect(() => {
    let isUnmounted = false;

    (async () => {
      await getImageSrc();
      const instance = await import("leaflet");
      if (!isUnmounted) {
        setLeafletInstance(instance);
      }
    })();

    return () => {
      isUnmounted = true;
      setLeafletInstance(null);
    };
  }, []);

  // Initialize the map dom once Leaflet has successfully been imported
  useEffect(() => {
    let map: typeof L | null = null;

    if (ref.current && L) {
      map = L.map(ref.current, {
        center: [latitude, longitude],

        zoom: 19,
        zoomControl: false,
        layers: [L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png")],

        scrollWheelZoom: false,
        attributionControl: false,
      });

      map.dragging.disable();
      map.doubleClickZoom.disable();

      const placeIcon = L.icon({
        iconUrl: imageSrc ? imageSrc : getDefaultPlaceImagePath(type),
        iconSize: [100, 100],
        iconAnchor: [50, 50],
        className: `rounded-full lg:cursor-default bg-white object-cover`,
      });

      const marker = L.marker([latitude, longitude], {
        icon: placeIcon,
      }).addTo(map);

      marker._icon.style.border = `4px solid ${color}`;
    }

    return () => {
      if (map) {
        map.off();
        map.remove();
      }
    };
  }, [ref, L]);

  return <div className={`${className}`} ref={ref} />;
};

export default PlaceMap;
