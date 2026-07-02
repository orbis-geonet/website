"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { getDefaultPlaceImagePath, cn } from "@utils";
import AddressSearch from "./addressSearch";
import { Image } from "..";
import Link from "next/link";
import DImage from "next/image";
import { FiEdit3, FiPlus, FiMinus, FiTarget, FiChevronLeft } from "react-icons/fi";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import FeedOverlay from "./feedOverlay.component";
import Spinner from "@public/spinner.gif";
import { Button } from "@/components/ui/button";
import { useMapHandler } from "@/lib/hooks/useMapHandler";
import { useCarousel } from "@/lib/hooks/useCarousel";
import { Place } from "@/lib/types/map.types";

type PROPS = {
    currentCity: {
        lat: number;
        long: number;
        cityName: string;
        locality?: string;
    };
    setCurrentCity: React.Dispatch<
        React.SetStateAction<{
            cityName: string;
            lat: number;
            long: number;
        }>
    >;
    className?: string;
    polygons?: any[];
    isLoadingPolygons: boolean;
		activePolygon: any;
		setActivePolygon: React.Dispatch<React.SetStateAction<any>>;
};

const MapComponent: React.FC<PROPS> = ({
    currentCity,
    setCurrentCity,
    className = "",
    polygons,
    isLoadingPolygons,
		activePolygon,
		setActivePolygon
}) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [activePlace, setActivePlace] = useState<any>();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const activePlaceSlug = activePlace?.slug;
    const isOneExpanded = !!activePolygon;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level

    const { mapHandler, initializeMap, addPolygons } = useMapHandler({
        currentCity,
        setCurrentCity,
        setActivePolygon,
        setActivePlace,
    });

    const {
        setCarouselApi,
        visiblePlaces,
        currentIndex: carouselIndex,
        handleScroll: handleCarouselScroll,
    } = useCarousel({
        activePolygon,
        activePlaceSlug,
        isOneExpanded,
    });

    // Initialize map
    useEffect(() => {
        if (mapContainerRef.current) {
            initializeMap(mapContainerRef.current);
        }
    }, [initializeMap]);

    // Add polygons when available
    useEffect(() => {
        if (polygons && polygons.length > 0) {
            addPolygons(polygons);
        }
    }, [polygons, addPolygons]);

    // Add this useEffect to sync the zoom level with the map
    useEffect(() => {
        if (mapHandler) {
            const map = mapHandler.getMap();
            const updateZoomLevel = () => {
                const currentZoom = map.getZoom();
                setZoomLevel(currentZoom);
            };

            map.on("zoom", updateZoomLevel);
            return () => {
                map.off("zoom", updateZoomLevel);
            };
        }
    }, [mapHandler]);

    const LoadingSpinner = () => <DImage alt="loading" src={Spinner} height={30} width={30} />;

    const handleScroll = (direction: "prev" | "next") => {
        handleCarouselScroll(direction);
        if (direction === "prev") {
            setCurrentIndex((prev) => (prev > 0 ? prev - 1 : activePolygon?.places.length - 1));
        } else {
            setCurrentIndex((prev) => (prev < (activePolygon?.places.length ?? 1) - 1 ? prev + 1 : 0));
        }
    };

    return (
        <div className="map-page-container">
            {mapHandler ? (
                <>
                    {/* Loading States */}
                    {isLoadingPolygons && mapHandler.totalPolygonsCount() > 0 && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[20]">
                            <LoadingSpinner />
                        </div>
                    )}
                    <div
                        className={cn(
                            "absolute inset-0 bg-black bg-opacity-20 transition-all ease-in-out duration-300 flex items-center justify-center z-[20] pointer-events-none",
                            isLoadingPolygons && mapHandler.totalPolygonsCount() <= 0 ? "" : "opacity-0 z-0",
                        )}>
                        <LoadingSpinner />
                    </div>

                    {/* Active Group Display */}
                    {activePolygon ? (
                        <div className="max-w-[min(350px,95vw)] absolute top-4 z-[18] left-1/2 -translate-x-1/2 w-full flex items-center gap-4 justify-center">
                            <button
                                onClick={() => {
                                    window.dispatchEvent(new Event("map:dominantGroupClose"));
                                }}
                                className="bg-white rounded-full h-[40px] w-[40px] flex items-center justify-center shadow-md">
                                <FiChevronLeft className="h-7 w-7" />
                            </button>
                            <Link
                                id="dominant-group"
                                target="_blank"
                                href={`/group/${activePolygon.dominantGroup.slug}`}
                                className="font-medium shadow-sm flex items-center gap-4 bg-white rounded-3xl p-2 pr-4">
                                <Image
                                    style={{
                                        border: `2px solid ${activePolygon.dominantGroup.strokeColorHex}`,
                                    }}
                                    src={"groupPictures/" + activePolygon.dominantGroup.imageName}
                                    alt={activePolygon.dominantGroup.name}
                                    height={100}
                                    width={100}
                                    className="rounded-full h-8 w-8 object-cover"
                                />
                                <p
                                    className={cn(
                                        "text-sm md:text-base",
                                        activePolygon.dominantGroup.name.length > 30 ? "text-xs md:text-sm" : "",
                                    )}>
                                    {activePolygon.dominantGroup.name}
                                </p>
                            </Link>
                        </div>
                    ) : (
                        <div
                            className={cn(
                                "max-w-[min(350px,95vw)] w-full md:w-fit absolute top-4 left-1/2 -translate-x-1/2 z-[18] flex flex-col items-center text-sm md:text-base",
                                isSearchOpen ? "hidden" : "",
                            )}>
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="py-2 px-3 flex items-center justify-center gap-2 rounded-lg shadow-md bg-white">
                                <span className="font-medium">{currentCity.cityName.substring(0, 30)}</span>
                                <FiEdit3 />
                            </button>
                            {currentCity.locality && (
                                <div className="py-2 px-3 text-xs md:text-sm rounded-lg shadow-md text-[#636363] bg-white w-fit mt-2 mx-auto">
                                    <span className="font-medium">{currentCity.locality.substring(0, 30)}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Search Component */}
                    <div className={cn("hidden", isSearchOpen ? "block" : "")}>
                        <AddressSearch
                            map={mapHandler.getMap()}
                            hideMobileSearchBar={() => setIsSearchOpen(false)}
                            setCurrentCity={setCurrentCity}
                            currentCity={currentCity}
                        />
                    </div>

                    {/* Feed Overlay */}
                    {activePolygon && isOneExpanded && (
                        <FeedOverlay
                            isOneExpanded={isOneExpanded}
                            activePolygon={activePolygon}
                            activePlace={activePlace}
                        />
                    )}

                    {/* Places Carousel */}
                    {isOneExpanded && activePolygon && (
                        <div
                            id="places-carousel"
                            className="flex lg:hidden fixed left-0 right-0 bottom-4 z-[18] px-2 w-full">
                            <Carousel
                                setApi={setCarouselApi}
                                className="relative !h-[fit-content] w-full"
                                opts={{
                                    align: "center",
                                    containScroll: "trimSnaps",
                                }}>
                                <CarouselContent
                                    className={cn(
                                        "-ml-2 !h-[fit-content]  w-full",
                                        activePolygon.places.length == 1 ? "justify-center" : "",
                                    )}>
                                    {activePolygon.places.map((place: Place, index: number) => (
                                        <div
                                            key={place.slug}
                                            className={cn(
                                                "pl-2 !h-[fit-content] flex-[0_0_70%] min-w-0 transition-opacity duration-300",
                                                activePolygon.places.length == 1 ? "flex-[0_0_100%]" : "",
                                            )}
                                            style={{ minHeight: "fit-content" }}>
                                            <div className="bg-white rounded-lg shadow-lg p-3 h-[fit-content]">
                                                <Link
                                                    target="_blank"
                                                    className="flex items-start gap-2 min-h-[80px] w-full"
                                                    href={`/place/${place.slug}`}>
                                                    <div className="flex-shrink-0 w-10 h-10">
                                                        {place.imageName ? (
                                                            <Image
                                                                src={`placePictures/${place.imageName}`}
                                                                alt={place.name}
                                                                height={40}
                                                                width={40}
                                                                className="rounded-full object-cover w-10 h-10"
                                                                loading={
                                                                    Math.abs(index - currentIndex) <= 1
                                                                        ? "eager"
                                                                        : "lazy"
                                                                }
                                                            />
                                                        ) : (
                                                            <DImage
                                                                src={getDefaultPlaceImagePath(place.type)}
                                                                alt={place.name}
                                                                height={40}
                                                                width={40}
                                                                className="rounded-full object-cover w-10 h-10"
                                                                loading={
                                                                    Math.abs(index - currentIndex) <= 1
                                                                        ? "eager"
                                                                        : "lazy"
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p
                                                            className={cn(
                                                                "font-bold text-gray-900",
                                                                place.name.length > 20 ? "text-sm" : "text-base",
                                                            )}>
                                                            {place.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600 line-clamp-2 break-words">
                                                            {place?.description}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </CarouselContent>
                                {/* <CarouselPrevious
                  onClick={() => handleScroll("prev")}
                  className="hidden md:flex -left-2 h-8 w-8"
                />
                <CarouselNext
                  onClick={() => handleScroll("next")}
                  className="hidden md:flex -right-2 h-8 w-8"
                />
                <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-1">
                  {activePolygon.places.map((_: Place, idx: number) => (
                    <button
                      key={idx}
                      className={cn(
                        "h-1 rounded-full transition-all duration-300",
                        idx === currentIndex
                          ? "w-4 bg-primary"
                          : "w-1 bg-gray-300",
                      )}
                      onClick={() => {
                        setCurrentIndex(idx);
                        handleCarouselScroll(
                          idx > currentIndex ? "next" : "prev",
                        );
                      }}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div> */}
                            </Carousel>
                        </div>
                    )}

                    {/* Map Navigation Controls */}
                    <div className="hidden lg:flex flex-col gap-3 absolute top-1/2 right-5 -translate-y-1/2 z-[18]">
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg flex flex-col border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-xl py-5 px-3">
                            {/* Vertical Zoom Slider */}
                            <div className="flex flex-col items-center">
                                <div className="relative h-32 flex items-center justify-center w-8">
                                    {/* Track with gradient */}
                                    <div className="h-full w-[2px] rounded-full relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/5" />
                                    </div>

                                    {/* Center line indicator */}
                                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-[1px] bg-black/20 top-1/2" />

                                    {/* Thumb */}
                                    <div
                                        className="absolute w-6 h-6 left-1/2 -translate-x-1/2 flex items-center justify-center 
                                                 cursor-grab active:cursor-grabbing touch-none select-none"
                                        style={{
                                            top: "50%",
                                            transform: "translate(-50%, -50%)",
                                            transition: "top 0.1s ease-out",
                                        }}>
                                        {/* Hover target (larger area for better UX) */}
                                        <div className="absolute inset-0 rounded-full hover:bg-black/5 transition-colors" />

                                        {/* Visual thumb */}
                                        <div
                                            className="w-3.5 h-3.5 bg-black rounded-full transition-all duration-150
                                                     group-hover:scale-110 hover:scale-110
                                                     active:scale-95 
                                                     shadow-[0_0_0_8px_rgba(0,0,0,0.05)]
                                                     after:content-[''] after:absolute after:inset-0 after:rounded-full
                                                     after:border-2 after:border-black/10 after:scale-150
                                                     before:content-[''] before:absolute before:inset-[-4px] before:rounded-full
                                                     before:border-2 before:border-transparent before:transition-colors
                                                     hover:before:border-black/10"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                const sliderRect =
                                                    e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
                                                const thumbElement = e.currentTarget.parentElement;
                                                if (!sliderRect || !thumbElement) return;

                                                const centerY = sliderRect.height / 2;
                                                const map = mapHandler.getMap();
                                                const initialZoom = map.getZoom();
                                                let lastZoomChange = 0;
                                                let isAnimating = false;
                                                let currentZoomTarget = initialZoom;

                                                // Set initial states
                                                document.body.style.cursor = "grabbing";
                                                thumbElement.style.transition = "none";
                                                thumbElement.classList.remove("cursor-grab");
                                                thumbElement.classList.add("cursor-grabbing");

                                                const animate = () => {
                                                    if (!isAnimating) return;

                                                    const currentZoom = map.getZoom();
                                                    const zoomDiff = currentZoomTarget - currentZoom;

                                                    if (Math.abs(zoomDiff) > 0.01) {
                                                        const newZoom = currentZoom + zoomDiff * 0.15; // Increased smoothing for better control
                                                        map.setZoom(newZoom);
                                                    }

                                                    requestAnimationFrame(animate);
                                                };

                                                const handleDrag = (moveEvent: MouseEvent) => {
                                                    moveEvent.preventDefault();

                                                    // Calculate vertical position
                                                    const mouseY = moveEvent.clientY - sliderRect.top;
                                                    const boundedY = Math.max(0, Math.min(sliderRect.height, mouseY));
                                                    const percentage = (boundedY / sliderRect.height) * 100;

                                                    // Update thumb position
                                                    thumbElement.style.top = `${percentage}%`;

                                                    // Calculate zoom change based on distance from center
                                                    const distanceFromCenter = centerY - boundedY;
                                                    const normalizedDistance = distanceFromCenter / centerY;

                                                    // Calculate target zoom level with increased range and no upper limit
                                                    const zoomRange = 10; // Increased range for more zoom levels
                                                    const zoomChange = normalizedDistance * zoomRange;
                                                    currentZoomTarget = Math.max(1, initialZoom + zoomChange); // Only limit minimum zoom

                                                    // Start animation if not already running
                                                    if (!isAnimating) {
                                                        isAnimating = true;
                                                        animate();
                                                    }
                                                };

                                                const handleMouseUp = () => {
                                                    // Stop animation
                                                    isAnimating = false;

                                                    // Clean up
                                                    document.body.style.cursor = "";

                                                    // Reset thumb position with smooth animation
                                                    thumbElement.style.transition =
                                                        "top 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
                                                    thumbElement.style.top = "50%";
                                                    thumbElement.classList.add("cursor-grab");
                                                    thumbElement.classList.remove("cursor-grabbing");

                                                    // Reset transition after animation
                                                    setTimeout(() => {
                                                        thumbElement.style.transition = "top 0.1s ease-out";
                                                    }, 300);

                                                    // Remove event listeners
                                                    document.removeEventListener("mousemove", handleDrag);
                                                    document.removeEventListener("mouseup", handleMouseUp);
                                                };

                                                // Add event listeners for drag
                                                document.addEventListener("mousemove", handleDrag);
                                                document.addEventListener("mouseup", handleMouseUp);
                                            }}
                                        />

                                        {/* Drag indicator */}
                                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-[3px] pointer-events-none opacity-40">
                                            <div className="w-4 h-[2px] bg-black rounded-full" />
                                            <div className="w-4 h-[2px] bg-black rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="bg-white/90 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-white/20 text-gray-600 
                                     hover:text-gray-900 hover:bg-white/95 transition-all duration-200 hover:shadow-xl flex items-center justify-center"
                            onClick={() =>
                                mapHandler
                                    .getMap()
                                    .setView([currentCity.lat, currentCity.long], mapHandler.getMap().getZoom())
                            }
                            aria-label="Center map">
                            <FiTarget className="h-5 w-5" />
                        </Button>
                    </div>
                </>
            ) : null}
            <div
                onClick={() => (isSearchOpen ? setIsSearchOpen(false) : null)}
                className={cn("absolute inset-0 z-10", className)}
                ref={mapContainerRef}></div>
        </div>
    );
};

export default MapComponent;
