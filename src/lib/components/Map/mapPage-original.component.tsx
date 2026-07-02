"use client";

import { useEffect, useRef, useState } from "react";
import type Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import { getDefaultPlaceImagePath, getURL, cn } from "@utils";
import AddressSearch from "./addressSearch";
import getCityFromCoordinates from "@/lib/utils/getCityFromCoordinates";
import * as turf from "@turf/turf";
import * as geolib from "geolib";
import { Image } from "..";
import Link from "next/link";
import DImage from "next/image";
import { FiEdit3 } from "react-icons/fi";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import FeedOverlay from "./feedOverlay.component";
import Spinner from "@public/spinner.gif";

type PROPS = {
  currentCity: {
    lat: number;
    long: number;
    cityName: string;
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
};

const DIMOPACITY = 0.01;

const MapComponent: React.FC<PROPS> = ({
  currentCity,
  setCurrentCity,
  className = "",
  polygons,
  isLoadingPolygons,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [L, setLeafletInstance] = useState<typeof Leaflet | null>(null);
  const [map, setMap] = useState<typeof Leaflet | null>(null);
  const addedPolygons = useRef(new Set());
  const [activePolygon, setActivePolygon] = useState<any>();
  const [activePlace, setActivePlace] = useState<any>();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dominantGroupSlug = activePolygon?.dominantGroup?.slug;
  const activePlaceSlug = activePlace?.slug;
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const isOneExpanded = useRef(false);

  const allPolygons = useRef<
    {
      polygon: any;
      imageOverlay: any;
      markers: any[];
      circle: any;
    }[]
  >([]);

  useEffect(() => {
    if (isOneExpanded) {
      let index = 0;
      if (activePlaceSlug) {
        activePolygon.places.map((place: any, i: number) => {
          if (place.slug == activePlaceSlug) {
            index = i;
          }
        });
      }
      carouselApi?.scrollTo(index);
    }
  }, [isOneExpanded, activePolygon, activePlaceSlug, carouselApi]);
  // Import Leaflet client side
  useEffect(() => {
    let isUnmounted = false;

    (async () => {
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
    let handleMoveEnd = () => {};
    if (ref.current && L) {
      const { lat, long } = currentCity;
      map = L.map(ref.current, {
        center: [lat, long],
        zoom: 13,
        zoomControl: false,
        layers: [
          // L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png")
          L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
          ),
        ],
        attributionControl: false,
      });

      if (map) {
        handleMoveEnd = async () => {
          const center = map.getCenter();
          const city = await getCityFromCoordinates(center.lat, center.lng);
          if (city) {
            setCurrentCity(city);
          }
        };

        map.on("moveend", handleMoveEnd);
      }

      setMap(map);
    }

    return () => {
      if (map) {
        map.off("moveend", handleMoveEnd);
        map.off();
        map.remove();
      }
    };
  }, [ref, L]);

  useEffect(() => {
    if (map && polygons && polygons.length > 0) {
      polygons.forEach(async (polygon, index) => {
        if (!polygon.polygonCenter || !polygon.polygonPoints) return;
        const polygonCoordinates = polygon.polygonPoints.map((point: any) => [
          point.latitude,
          point.longitude,
        ]);

        const coordinatesKey = JSON.stringify(polygonCoordinates);

        //returning if the polygon is already added
        if (addedPolygons.current.has(coordinatesKey)) return;

        addedPolygons.current.add(coordinatesKey);

        //smoothening the polygon with turf library
        const turfPoly = turf.polygon([polygonCoordinates]);
        const smoothed = turf.polygonSmooth(turfPoly, { iterations: 3 });
        const smoothedCoordinates =
          smoothed.features[0].geometry.coordinates[0];

        const color = polygon.dominantGroup.strokeColorHex
          ? polygon.dominantGroup.strokeColorHex
          : "#d6ff00";
        const poly = L.polygon(smoothedCoordinates, {
          color: color,
          fillColor: color,
          bubblingMouseEvents: false,
          fillOpacity: 0,
          smoothFactor: 0.1,
          stroke: false,
          className: "transition-all ease-in-out duration-500",
        }).addTo(map);

        const imageUrl = await getURL(
          "groupPictures/" + polygon.dominantGroup.imageName,
        );
        const center = [
          polygon.polygonCenter.latitude,
          polygon.polygonCenter.longitude,
        ];

        let radiusInKm = 0;
        smoothedCoordinates.forEach((coord: any) => {
          const d = turf.distance(turf.point(center), turf.point(coord));
          if (d < radiusInKm || radiusInKm == 0) {
            radiusInKm = d;
          }
        });

        const imageBounds = geolib.getBoundsOfDistance(
          { latitude: center[0], longitude: center[1] },
          radiusInKm * 1000,
        );
        const parsedImageBounds = imageBounds.map((bound) => [
          bound.latitude,
          bound.longitude,
        ]);

        const imageOverlay = L.imageOverlay(imageUrl, parsedImageBounds, {
          className: "rounded-full object-cover",
          pane: "markerPane",
          bubblingMouseEvents: false,
          opacity: 0,
          interactive: false,
        }).addTo(map);
        imageOverlay._image.style.border = `4px solid ${color}`;

        let markers: any[] = [];

        if (polygon.places && polygon.places.length > 0) {
          markers = polygon.places.map((place: any) => {
            const placeIcon = L.icon({
              iconUrl: getDefaultPlaceImagePath(place.type, true),
              iconSize: [40, 40],
              iconAnchor: [20, 20],
              className: `rounded-full cursor-default object-cover`,
            });

            const marker = L.marker(
              [place.coordinates.latitude, place.coordinates.longitude],
              {
                icon: placeIcon,
                bubblingMouseEvents: false,
                opacity: 0,
                interactive: false,
                className: "transition-all ease-in-out duration-500",
                zIndexOffset: 1000,
              },
            ).addTo(map);
            marker._icon.style.background = `${color}`;
            return marker;
          });
        }
        markers.map((marker: any, index) => {
          marker._icon.addEventListener("click", (e: any) => {
            e.stopPropagation();
            setActivePlace(polygon.places[index]);
            marker._icon.style.border = "2px solid white";
            markers.map((m: any) => {
              if (m._leaflet_id !== marker._leaflet_id) {
                m._icon.style.borderColor = "transparent";
              }
            });
          });
        });
        const markerGroup = L.featureGroup(markers);
        const bounds = markerGroup.getBounds();

        const boundCoordinates = [
          { latitude: bounds._northEast.lat, longitude: bounds._northEast.lng },
          { latitude: bounds._southWest.lat, longitude: bounds._southWest.lng },
        ];
        const diameterOfCircle = geolib.getPreciseDistance(
          boundCoordinates[0],
          boundCoordinates[1],
        );
        const centreOfCircle = geolib.getCenter(boundCoordinates) || {
          latitude: center[0],
          longitude: center[1],
        };

        const circle = L.circle(
          [centreOfCircle.latitude, centreOfCircle.longitude],
          {
            radius: (diameterOfCircle / 2) * 1.25,
            stroke: false,
            fillColor: color,
            fillOpacity: 0,
            interactive: false,
            bubblingMouseEvents: false,
          },
        ).addTo(map);

        circle._path.addEventListener("click", (e: any) => {
          e.stopPropagation();
        });

        poly.on("click", () => {
          allPolygons.current.map((val) => {
            if (val.polygon._leaflet_id == poly._leaflet_id) {
              setActivePolygon(polygon);
              val.polygon.setStyle({
                fillOpacity: 0,
              });
              val.polygon._path.classList.remove("leaflet-interactive");
              val.circle._path.classList.add("leaflet-interactive");
              val.markers.map((marker, index) => {
                marker._icon.style.borderColor = "transparent";
                if (window.innerWidth < 1180 && index == 0) {
                  marker._icon.style.border = "2px solid white";
                  setActivePlace(polygon.places[index]);
                }
                marker._icon.classList.add("leaflet-interactive");
                marker.setOpacity(1);
              });
              val.imageOverlay.setOpacity(0);
              val.circle.setStyle({
                fillOpacity: 0.5,
              });
            } else {
              val.polygon.setStyle({
                fillOpacity: DIMOPACITY,
              });
              val.circle._path.classList.remove("leaflet-interactive");
              val.polygon._path.classList.add("leaflet-interactive");
              val.markers.map((marker) => {
                marker._icon.classList.remove("leaflet-interactive");
                marker.setOpacity(0);
              });
              val.imageOverlay.setOpacity(DIMOPACITY * 2);
              val.circle.setStyle({
                fillOpacity: 0,
              });
            }
          });

          const tempCircle = L.circle(
            [centreOfCircle.latitude, centreOfCircle.longitude],
            {
              radius: diameterOfCircle / 1.45,
            },
          ).addTo(map);

          map.fitBounds(tempCircle.getBounds());
          tempCircle.removeFrom(map);

          setTimeout(() => (isOneExpanded.current = true), 500);
        });

        map.on("movestart", (e: any) => {
          if (!isOneExpanded.current) return;
          setActivePolygon(undefined);
          setActivePlace(undefined);
          isOneExpanded.current = false;
          allPolygons.current.map((val) => {
            val.circle.setStyle({
              fillOpacity: 0,
            });
            val.polygon.setStyle({
              fillOpacity: 0.25,
            });
            val.circle._path.classList.remove("leaflet-interactive");
            val.polygon._path.classList.add("leaflet-interactive");
            val.imageOverlay.setOpacity(1);
            val.markers.map((marker) => {
              marker._icon.classList.remove("leaflet-interactive");
              marker.setOpacity(0);
            });
          });
        });

        allPolygons.current.push({
          polygon: poly,
          imageOverlay,
          markers,
          circle,
        });

        //settting polygonFill Opacity to give the stagger effect
        setTimeout(() => {
          poly.setStyle({
            fillOpacity: isOneExpanded.current ? DIMOPACITY : 0.25,
          });
          imageOverlay.setOpacity(isOneExpanded.current ? DIMOPACITY * 2 : 1);
        }, index * 50);
      });
    }
  }, [polygons]);

  return (
    <div className="map-page-container">
      <div
        className={cn(
          "absolute inset-0 bg-black bg-opacity-20 transition-all ease-in-out duration-300 flex items-center justify-center z-[18] pointer-events-none",
          isLoadingPolygons && addedPolygons.current.size <= 0
            ? ""
            : "opacity-0 z-0",
        )}
      >
        <DImage
          alt="loading"
          src={Spinner}
          height={30}
          width={30}
          className="mx-auto"
        />
      </div>
      {activePolygon ? (
        <Link
          target="_blank"
          href={`/group/${activePolygon.dominantGroup.slug}`}
          className="font-medium shadow-sm absolute top-4 z-[18] left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white rounded-3xl p-2 pr-4"
        >
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
          <p className="">
            {activePolygon.dominantGroup.name.substring(0, 20)}
            {activePolygon.dominantGroup.name.length > 20 ? "..." : ""}
          </p>
        </Link>
      ) : (
        <button
          onClick={() => setIsSearchOpen(true)}
          className={cn(
            "py-2 px-3 flex items-center justify-center gap-2 rounded-lg shadow-md text-[#636363] bg-white w-[min(350px,80vw)] lg:w-fit absolute top-4 left-1/2 -translate-x-1/2 z-[18]",
            isSearchOpen ? "hidden" : "",
          )}
        >
          <span className="font-medium">
            {currentCity.cityName.substring(0, 30)}
          </span>
          <FiEdit3 />
        </button>
      )}
      <div className={cn("hidden", isSearchOpen ? "block" : "")}>
        <AddressSearch
          map={map}
          hideMobileSearchBar={() => {
            setIsSearchOpen(false);
          }}
          setCurrentCity={setCurrentCity}
          currentCity={currentCity}
        />
      </div>
      {activePolygon && isOneExpanded.current ? (
        <FeedOverlay
          isOneExpanded={isOneExpanded.current}
          activePolygon={activePolygon}
          activePlace={activePlace}
        />
      ) : null}

      {isOneExpanded && activePolygon && (
        <div className="block lg:hidden absolute left-0 right-0 bottom-4 z-[18]">
          <Carousel setApi={setCarouselApi}>
            <CarouselContent>
              {activePolygon.places.map((place: any) => (
                <div key={place.slug} className="p-2 min-w-full">
                  <div className="bg-white p-4 rounded-lg">
                    <Link
                      target="_blank"
                      className="flex items-center gap-1"
                      href={`/place/${place.slug}`}
                    >
                      <DImage
                        src={getDefaultPlaceImagePath(place.type)}
                        alt={place.name}
                        height={100}
                        width={100}
                        className="rounded-full h-14 w-14 object-cover"
                      />
                      <div>
                        <p className="text-base font-bold">{place.name}</p>
                        <p className="text-sm leading-tight">
                          {place?.description?.substring(0, 100)}
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
      <div
        onClick={() => (isSearchOpen ? setIsSearchOpen(false) : null)}
        className={cn("absolute inset-0 z-10", className ? className : "")}
        ref={ref}
      ></div>
    </div>
  );
};

export default MapComponent;
