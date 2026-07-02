import { useState, useEffect, useCallback, useRef } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import type { Polygon, Place } from "@/lib/types/map.types";

type UseCarouselProps = {
  activePolygon: Polygon | undefined;
  activePlaceSlug: string | undefined;
  isOneExpanded: boolean;
};

export const useCarousel = ({
  activePolygon,
  activePlaceSlug,
  isOneExpanded,
}: UseCarouselProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const isPlaceChangedFromCarousel = useRef(false);
  const carouselEventCleanup = useRef<(() => void) | null>(null);
  const [visiblePlaces, setVisiblePlaces] = useState<any>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle marker highlighting
  const handleCarouselSelect = useCallback(() => {
    if (isPlaceChangedFromCarousel.current) {
      isPlaceChangedFromCarousel.current = false;
      return;
    }

    const selectedIndex = carouselApi?.selectedScrollSnap() ?? 0;
    setCurrentIndex(selectedIndex);

    const activePlaceMarkers: NodeListOf<HTMLElement> =
      document.querySelectorAll(".active-place-marker-icon");

    activePlaceMarkers?.forEach((marker, index) => {
      marker.style.borderColor =
        index === selectedIndex ? "white" : "transparent";
    });
  }, [carouselApi]);

  // Handle carousel API initialization and cleanup
  useEffect(() => {
    if (carouselApi) {
      carouselApi.on("select", handleCarouselSelect);
      carouselEventCleanup.current = () => {
        carouselApi.off("select", handleCarouselSelect);
      };
    }

    return () => {
      if (carouselEventCleanup.current) {
        carouselEventCleanup.current();
      }
    };
  }, [carouselApi, handleCarouselSelect]);

  // Handle active place changes and virtualization
  useEffect(() => {
    if (isOneExpanded && carouselApi && activePolygon?.places) {
      let index = 0;
      if (activePlaceSlug) {
        const foundIndex = activePolygon.places.findIndex(
          (place) => place.slug === activePlaceSlug,
        );
        if (foundIndex !== -1) {
          index = foundIndex;
        }
      }

      // Update visible places based on current index
      const totalPlaces = activePolygon.places.length;
      const windowSize = 5; // Number of items to keep in memory
      const start = Math.max(0, index - Math.floor(windowSize / 2));
      const end = Math.min(totalPlaces, start + windowSize);

      setVisiblePlaces(activePolygon.places.slice(start, end));
      setCurrentIndex(index);

      isPlaceChangedFromCarousel.current = true;
      carouselApi.scrollTo(index);
    }
  }, [isOneExpanded, activePolygon, activePlaceSlug, carouselApi]);

  // Handle scroll events for infinite scrolling
  const handleScroll = useCallback(
    (direction: "next" | "prev") => {
      if (!activePolygon?.places) return;

      const totalPlaces = activePolygon.places.length;
      let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

      // Handle circular scrolling
      if (newIndex < 0) newIndex = totalPlaces - 1;
      if (newIndex >= totalPlaces) newIndex = 0;

      setCurrentIndex(newIndex);

      // Update visible places
      const windowSize = 5;
      const start = Math.max(0, newIndex - Math.floor(windowSize / 2));
      const end = Math.min(totalPlaces, start + windowSize);

      setVisiblePlaces(activePolygon.places.slice(start, end));
    },
    [currentIndex, activePolygon],
  );

  return {
    setCarouselApi,
    visiblePlaces,
    currentIndex,
    handleScroll,
    isPlaceChangedFromCarousel: isPlaceChangedFromCarousel.current,
  };
};
