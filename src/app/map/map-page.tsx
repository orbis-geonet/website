"use client";
import dynamic from "next/dynamic";
import { useEffect, useState, Suspense } from "react";
import { getData } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import getCityFromCoordinates from "@/lib/utils/getCityFromCoordinates";
import Link from "next/link";

// Dynamically import the MapComponent with no SSR
const MapComponent = dynamic(() => import("@/lib/components/Map/mapPage.component"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" />,
});

// Move SVG components outside the render function to prevent recreating on each render
const AndroidIcon = () => (
    <svg
        className="hover:text-black transition-colors ease-in-out duration-300"
        xmlns="http://www.w3.org/2000/svg"
        width="27.046"
        height="32.387"
        viewBox="0 0 27.046 32.387">
        <path
            d="M139.2 191.574a2.076 2.076 0 0 0 2.027-2.027v-4.734h1.354a1.279 1.279 0 0 0 1.354-1.354v-13.522h-16.23v13.522a1.279 1.279 0 0 0 1.354 1.354h1.354v4.734a2.027 2.027 0 1 0 4.054 0v-4.734h2.707v4.734a2.076 2.076 0 0 0 2.026 2.027z"
            transform="translate(-122.3 -159.187)"
            fill="currentColor"
        />
        <path
            d="M407.719 183.459a2.076 2.076 0 0 0 2.027-2.027v-9.469a2.027 2.027 0 0 0-4.054 0v9.469a2.076 2.076 0 0 0 2.027 2.027z"
            transform="translate(-382.7 -159.187)"
            fill="currentColor"
        />
        <path
            d="M44.243 183.459a2.076 2.076 0 0 0 2.027-2.027v-9.469a2.027 2.027 0 0 0-4.054 0v9.469a2.076 2.076 0 0 0 2.027 2.027z"
            fill="currentColor"
            transform="translate(-42.216 -159.187)"
        />
        <path
            d="M142.315.2a.648.648 0 0 0-.944 0l-1.816 1.809-.084.084a8.017 8.017 0 0 0-3.628-.811h-.04a8.016 8.016 0 0 0-3.627.811l-.084-.084L130.277.2a.648.648 0 0 0-.944 0 .649.649 0 0 0 0 .943L131.09 2.9a7.317 7.317 0 0 0-1.525 1.369 7.948 7.948 0 0 0-1.843 4.7v.056q-.009.182-.008.367h16.23q0-.184-.008-.367v-.056a7.946 7.946 0 0 0-1.843-4.7 7.312 7.312 0 0 0-1.534-1.369l1.756-1.756a.649.649 0 0 0 0-.944zm-9.874 6.827a1.014 1.014 0 1 1 1.014-1.014 1.014 1.014 0 0 1-1.014 1.019zm6.766 0a1.014 1.014 0 1 1 1.014-1.014 1.014 1.014 0 0 1-1.014 1.019z"
            fill="currentColor"
            transform="translate(-122.301)"
        />
    </svg>
);

const AppleIcon = () => (
    <svg
        className="hover:text-black transition-colors ease-in-out duration-300"
        xmlns="http://www.w3.org/2000/svg"
        width="24.078"
        height="30.858"
        viewBox="0 0 24.078 30.858">
        <path
            fill="currentColor"
            d="M48.577 4.69A5.993 5.993 0 0 0 50.308 0a7.826 7.826 0 0 0-4.9 2.225 5.74 5.74 0 0 0-1.768 4.546 6.526 6.526 0 0 0 4.937-2.081zm3.562 11.885a6.913 6.913 0 0 1 3.191-5.8 6.833 6.833 0 0 0-5.407-3.019c-2.3-.242-4.492 1.4-5.662 1.4S41.3 7.787 39.385 7.823a7.207 7.207 0 0 0-6.117 3.822C30.658 16.31 32.6 23.218 35.142 27c1.243 1.852 2.723 3.929 4.667 3.854 1.876-.075 2.583-1.248 4.847-1.248s2.9 1.248 4.88 1.21c2.016-.038 3.292-1.888 4.524-3.745a17.03 17.03 0 0 0 2.048-4.332 6.713 6.713 0 0 1-3.969-6.164z"
            transform="translate(-32.029)"
        />
    </svg>
);

type CurrentCity = {
    lat: number;
    long: number;
    cityName: string;
    locality?: string;
};

export default function MapPage() {
    const [currentCity, setCurrentCity] = useState<CurrentCity>({
        cityName: "New York City",
        lat: 40.71427,
        long: -74.00597,
    });

    const [triedGeolocation, setTriedGeolocation] = useState(false);
    const [geoLocationError, setGeoLocationError] = useState<string | null>(null);
    const [isGeoLocating, setIsGeoLocating] = useState(false);
    const [activePolygon, setActivePolygon] = useState<any>();

    const { isLoading, data: polygons } = useQuery({
        queryKey: ["getPolygons", currentCity.lat, currentCity.long],
        queryFn: async () => {
            return getData(
                `/polygon-calculations/polygons-page?latitude=${currentCity.lat}&longitude=${currentCity.long}`,
            );
        },
        enabled: triedGeolocation && !!activePolygon === false, // Only fetch polygons after geolocation attempt and when no polygon is active
        staleTime: 5 * 60 * 1000,
        // Add prefetch to improve perceived performance
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    // Add error message auto-dismiss effect
    useEffect(() => {
        if (geoLocationError) {
            const timer = setTimeout(() => {
                setGeoLocationError(null);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [geoLocationError]);

    const getLocation = async (retryCount = 0) => {
        if (!navigator.geolocation) {
            setGeoLocationError("Geolocation is not supported by this browser.");
            setTriedGeolocation(true);
            return;
        }

        setIsGeoLocating(true);

        try {
            const getPositionWithTimeout = (): Promise<GeolocationPosition> => {
                return new Promise<GeolocationPosition>((resolve, reject) => {
                    const timeoutId = setTimeout(() => {
                        reject(new Error("Timeout"));
                    }, 5000);

                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            clearTimeout(timeoutId);
                            resolve(position);
                        },
                        (error) => {
                            clearTimeout(timeoutId);
                            reject(error);
                        },
                        {
                            enableHighAccuracy: true,
                            maximumAge: 30000,
                            timeout: 27000,
                        },
                    );
                });
            };

            const position = await getPositionWithTimeout();

            const location = {
                lat: position.coords.latitude,
                long: position.coords.longitude,
            };
            const city = await getCityFromCoordinates(location.lat, location.long);
            if (city) {
                setCurrentCity(city);
                setGeoLocationError(null);
            } else {
                throw new Error("Failed to get city information");
            }
        } catch (error: unknown) {
            console.error("Error getting location:", error);
            if (retryCount < 2) {
                // Retry up to 2 times with a delay
                setTimeout(() => getLocation(retryCount + 1), 1000);
                return;
            }
            // Don't show an error message for geolocation failures, just fallback to default location
            // setGeoLocationError(
            //     error instanceof GeolocationPositionError && error.code === 1
            //         ? "Location access denied. Please enable location services."
            //         : "Failed to get your location. Using default location.",
            // );
        } finally {
            setIsGeoLocating(false);
            setTriedGeolocation(true);
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    return (
        <div className="relative w-full h-[calc(100vh_-_70px)] md:h-[calc(100vh_-_86px)] map-page-main">
            {isGeoLocating && !triedGeolocation && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-sm flex items-center gap-2">
                        <span className="animate-spin">⏳</span> Getting your location...
                    </p>
                </div>
            )}
            {geoLocationError && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-50 text-red-600 px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-sm">{geoLocationError}</p>
                </div>
            )}
            {triedGeolocation && (
                <div>
                    <Suspense fallback={<div className="w-full h-full bg-gray-100 animate-pulse" />}>
                        <MapComponent
                            setCurrentCity={setCurrentCity}
                            currentCity={currentCity}
                            polygons={polygons}
                            isLoadingPolygons={isLoading}
                            activePolygon={activePolygon}
                            setActivePolygon={setActivePolygon}
                        />
                    </Suspense>
                    <div className="hidden text-[#ccd0d2] group md:flex absolute bottom-4 right-4 bg-white rounded-xl px-4 py-3 z-[18] items-center gap-4">
                        <Link href="https://play.google.com/store/apps/details?id=com.orbis.orbis&rdid=com.orbis.orbis">
                            <AndroidIcon />
                        </Link>
                        <Link href="https://apps.apple.com/br/app/orbis-rede-geo-social/id1453025529">
                            <AppleIcon />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
