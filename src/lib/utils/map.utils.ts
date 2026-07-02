import type Leaflet from "leaflet";
import * as turf from "@turf/turf";
import * as geolib from "geolib";
import { getDefaultPlaceImagePath, getURL } from "@utils";
import getCityFromCoordinates from "./getCityFromCoordinates";

class Polygon {
    public polygon: any;
    public imageOverlay: any;
    public markers: any[];
    public circle: any;
    private isActive = false;
    private color: string = "";
    private area: number = 0;

    constructor(
        private map: typeof Leaflet.Map,
        public polygonData: any,
        private L: typeof Leaflet,
        private setActivePlace: any,
        private setActivePolygon: any,
        private imageUrl: string,
    ) {
        this.markers = [];
        this.initializePolygon();
    }

    private smoothenPolygonCoordinates(coordinates: number[][]) {
        const turfPoly = turf.polygon([coordinates]);
        const smoothed = turf.polygonSmooth(turfPoly, { iterations: 3 });
        return smoothed.features[0].geometry.coordinates[0] || coordinates;
    }

    private tooCloseToAnotherMarker(
        place: {
            placeKey: string;
            coordinates: { latitude: number; longitude: number };
        },
        allPlaces: {
            placeKey: string;
            coordinates: { latitude: number; longitude: number };
        }[],
    ): boolean {
        const zoomLevel = this.map.getZoom();
        const from = turf.point([place.coordinates.latitude, place.coordinates.longitude]);
        const metersPerPixel =
            (156543.03392 * Math.cos((place.coordinates.latitude * Math.PI) / 180)) / Math.pow(2, zoomLevel);
        const epsilon = 30 * metersPerPixel;

        for (const p of allPlaces) {
            const to = turf.point([p.coordinates.latitude, p.coordinates.longitude]);
            if (p.placeKey !== place.placeKey && turf.distance(from, to) * 1000 < epsilon) {
                return true;
            }
        }
        return false;
    }

    private initializePolygon() {
        const polygonCoordinates = this.polygonData.polygonPoints.map((point: any) => [
            point.latitude,
            point.longitude,
        ]);
        this.area = this.calculateAreaInSqM(polygonCoordinates);
        const polygonCenter = [this.polygonData.polygonCenter.latitude, this.polygonData.polygonCenter.longitude];
        const smoothedCoordinates = this.smoothenPolygonCoordinates(polygonCoordinates);

        this.color = this.polygonData.dominantGroup.strokeColorHex
            ? this.polygonData.dominantGroup.strokeColorHex
            : "#d6ff00";

        this.polygon = this.L.polygon(smoothedCoordinates, {
            fillColor: this.polygonData.places && this.polygonData.places.length > 1 ? this.color : "transparent",
            bubblingMouseEvents: false,
            fillOpacity: 0,
            smoothFactor: 0.1,
            stroke: false,
            pane: "polygonsPane",
            className: "transition-all ease-in-out duration-300",
        }).addTo(this.map);

        this.addGroupMarker(polygonCoordinates, this.imageUrl, polygonCenter);

        this.polygon.on("click", this.handlePolygonClick);
    }

    private adjustPlaceWrapperPaddingForScreenSize() {
        let paddingTopLeft = [0, 85];
        let paddingBottomRight = [0, 85];
        const screenWidth = window.innerWidth;

        if (screenWidth < 1180) {
            const dominantGroupHeight = 50;
            const placesCarouselHeight = 115;

            let paddingTop = dominantGroupHeight + 32;
            let paddingBottom = placesCarouselHeight + 32;
            const mapHeight = this.map.getContainer().clientHeight;

            const totalBlockPadding = paddingTop + paddingBottom;

            const height = mapHeight - totalBlockPadding;
            const heightWidthDiff = screenWidth - height;

            let inlinePadding = 10;

            if (heightWidthDiff < 0) {
                const newTotalBlockPadding = mapHeight - (screenWidth - 20);
                paddingTop = (paddingTop / totalBlockPadding) * newTotalBlockPadding;
                paddingBottom = (paddingBottom / totalBlockPadding) * newTotalBlockPadding;
            }
            paddingTopLeft = [inlinePadding, paddingTop];
            paddingBottomRight = [inlinePadding, paddingBottom];
        }

        return { paddingTopLeft, paddingBottomRight };
    }

    private addPlaceWrapperCircle() {
        const polygonCenter = [this.polygonData.polygonCenter.latitude, this.polygonData.polygonCenter.longitude];
        const markerGroup = this.L.featureGroup(this.markers);
        const bounds = markerGroup.getBounds().pad(0.05);

        const boundCoordinates = [
            { latitude: bounds._northEast.lat, longitude: bounds._northEast.lng },
            { latitude: bounds._southWest.lat, longitude: bounds._southWest.lng },
        ];

        const diameterOfCircle = Math.max(geolib.getPreciseDistance(boundCoordinates[0], boundCoordinates[1]), 1000);
        const centreOfCircle = geolib.getCenter(boundCoordinates) || {
            latitude: polygonCenter[0],
            longitude: polygonCenter[1],
        };
        const temp = diameterOfCircle;

        this.circle = this.L.circle([centreOfCircle.latitude, centreOfCircle.longitude], {
            radius: temp,
            fillColor: this.color,
            interactive: false,
            stroke: false,
            bubblingMouseEvents: false,
        }).addTo(this.map);

        this.circle._path.addEventListener("click", (e: any) => {
            e.stopPropagation();
        });

        const { paddingTopLeft, paddingBottomRight } = this.adjustPlaceWrapperPaddingForScreenSize();
        this.map.fitBounds(this.circle.getBounds(), {
            paddingTopLeft: paddingTopLeft,
            paddingBottomRight: paddingBottomRight,
            maxZoom: 18,
        });
    }

    getAreaInSqM() {
        return this.area;
    }

    private calculateAreaInSqM(coordinates: number[][]) {
        const turfPolygon = turf.polygon([coordinates]);
        const area = turf.area(turfPolygon);
        return area;
    }

    private addGroupMarker(coordinates: number[][], imageUrl: string, polygonCenter: number[]) {
        let radiusInMeter = 0;
        coordinates.forEach((coord: any) => {
            const formattedCoord = { latitude: coord[0], longitude: coord[1] };
            const d = geolib.getPreciseDistance(
                { latitude: polygonCenter[0], longitude: polygonCenter[1] },
                formattedCoord,
            );
            if (d < radiusInMeter || radiusInMeter == 0) {
                radiusInMeter = d;
            }
        });

        const imageBounds = geolib.getBoundsOfDistance(
            { latitude: polygonCenter[0], longitude: polygonCenter[1] },
            radiusInMeter * 0.9,
        );

        const parsedImageBounds = imageBounds.map((bound) => [bound.latitude, bound.longitude]);

        this.imageOverlay = this.L.imageOverlay(imageUrl, parsedImageBounds, {
            className: "rounded-full object-cover",
            pane: "dominantGroupPane",
            bubblingMouseEvents: false,
            opacity: 0,
            interactive: false,
        }).addTo(this.map);

        this.imageOverlay._image.style.border = `1px solid ${this.color}`;

        this.map.on("zoomend", () => {
            const zoom = this.map.getZoom();
            if (zoom >= 15) {
                this.imageOverlay._image.style.borderWidth = "4px";
            } else if (zoom >= 11) {
                this.imageOverlay._image.style.borderWidth = "1px";
            } else {
                this.imageOverlay._image.style.borderWidth = "0px";
            }
        });
    }

    private handlePolygonClick = () => {
        if (this.isActive) return;

        this.map.getPane("polygonsPane").style.display = "none";
        this.map.getPane("dominantGroupPane").style.display = "none";

        const downloadBar: HTMLElement | null = document.querySelector(".download-bar");
        if (downloadBar) {
            downloadBar.style.display = "none";
        }

        this.setActivePolygon(this.polygonData);

        //Order of these calls matter
        this.addPlaceMarkers();
        this.addPlaceWrapperCircle();

        this.markers.forEach((marker, index) => {
            const place = this.polygonData.places[index];
            const isCloseToAnotherMarker = this.tooCloseToAnotherMarker(place, this.polygonData.places);

            const size = isCloseToAnotherMarker ? 30 : 40;
            marker._icon.style.width = `${size}px`;
            marker._icon.style.border = `2px solid transparent`;
            marker._icon.style.height = `${size}px`;
            if (window.innerWidth < 1180 && index == 0) {
                marker._icon.style.borderColor = "white";
                this.setActivePlace(this.polygonData.places[index]);
            }
        });

        //@ts-ignore
        if (!window._mapDominantGroupCloseHandler) {
            //@ts-ignore

            window._mapDominantGroupCloseHandler = () => {
                this.handleDominantGroupClose();
            };

            //@ts-ignore
            window.addEventListener("map:dominantGroupClose", window._mapDominantGroupCloseHandler);
        }

        setTimeout(() => {
            this.isActive = true;
        }, 100);
    };

    private addPlaceMarkers() {
        const places = this.polygonData.places;

        if (places && places.length > 0) {
            this.markers = places.map((place: any) => {
                const placeIcon = this.L.icon({
                    iconUrl: getDefaultPlaceImagePath(place.type, true),
                    iconSize: [40, 40],
                    iconAnchor: [20, 20],
                    className: `rounded-full cursor-default object-cover active-place-marker-icon ${place.slug}`,
                });

                const marker = this.L.marker([place.coordinates.latitude, place.coordinates.longitude], {
                    icon: placeIcon,
                    bubblingMouseEvents: false,
                    interactive: true,
                    className: "transition-all ease-in-out duration-500",
                    zIndexOffset: 1000,
                }).addTo(this.map);
                marker._icon.style.background = `${this.color}`;

                const poly = this;
                marker.on("click", () => {
                    poly.setActivePlace(place);
                    this.markers.map((m: any) => {
                        m._icon.style.borderColor = "transparent";
                    });
                    marker._icon.style.borderColor = "white";
                });

                return marker;
            });
        }
    }

    private handleDominantGroupClose() {
        if (!this.isActive) return;
        this.setActivePolygon(undefined);
        this.setActivePlace(undefined);

        this.map.getPane("polygonsPane").style.display = "block";
        this.map.getPane("dominantGroupPane").style.display = "block";

        const downloadBar: HTMLElement | null = document.querySelector(".download-bar");
        if (downloadBar) {
            downloadBar.style.display = "";
        }

        this.circle.removeFrom(this.map);
        this.markers.forEach((markers) => markers.removeFrom(this.map));

        this.isActive = false;
    }
}

class MapHandler {
    private map: typeof Leaflet.Map | null = null;
    private addedPolygonsHash = new Set();
    private allPolygons: Polygon[] = [];
    private _batchTimer: any = null;
    private imageCache: Map<string, string> = new Map(); // Cache for preloaded image URLs

    constructor(
        private L: typeof Leaflet,
        private setCurrentCity: any,
        private setActivePolygon: any,
        private setActivePlace: any,
    ) {
        this.setActivePolygon = setActivePolygon;
        this.setActivePlace = setActivePlace;
    }

    isMapInitialized() {
        return !!this.map;
    }

    getMap() {
        return this.map;
    }

    totalPolygonsCount() {
        return this.addedPolygonsHash.size;
    }

    initializeMap(currentCity: { lat: number; long: number }, ref: HTMLDivElement | null) {
        if (this.L && ref) {
            const { lat, long } = currentCity;
            const urlParams = new URLSearchParams(window.location.search);
            const latFromParams = urlParams.get("lat");
            const longFromParams = urlParams.get("long");

            this.map = this.L.map(ref, {
                center: [lat, long],
                zoom: 13,
                zoomControl: false,
                layers: [
                    this.L.tileLayer(
                        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
                    ),
                ],
                attributionControl: false,
            });

            this.createRequiredPanes();

            this.map.on("moveend", this.handleMoveEnd);
            this.map.on("zoomend", () => this.handleZoomEnd());
            if (latFromParams && longFromParams) {
                this.map.flyTo([Number(latFromParams), Number(longFromParams)], 13, {
                    animate: true,
                    duration: 2,
                });
            }
        }
    }

    private handleZoomEnd = () => {
        const zoom = this.map.getZoom();
        this.allPolygons.forEach((polygonObj) => {
            const area = polygonObj.getAreaInSqM();
            this.updatePolygonVisibility(polygonObj, area, zoom);
        });
    };

    private updatePolygonVisibility(polygonObj: Polygon, area: number, zoom: number) {
        const isVisible = this.shouldPolygonBeVisible(area, zoom);
        polygonObj.polygon.setStyle({
            fillOpacity: isVisible ? 0.25 : 0,
        });
        polygonObj.imageOverlay.setOpacity(isVisible ? 1 : 0);
    }

    private shouldPolygonBeVisible(area: number, zoom: number): boolean {
        if (zoom < 14) {
            return area >= 80000;
        } else if (zoom == 14) {
            return area >= 40000;
        }
        return true;
    }

    private createRequiredPanes() {
        this.map.createPane("polygonsPane");
        this.map.createPane("dominantGroupPane");

        const polygonPane = this.map.getPane("polygonsPane");
        const dominantGroupPane = this.map.getPane("dominantGroupPane");

        polygonPane.style.zIndex = 650;
        dominantGroupPane.style.zIndex = 700;

        polygonPane.style.display = "block";
        dominantGroupPane.style.display = "block";
    }

    private handleMoveEnd = async () => {
        if (this.map) {
            const center = this.map.getCenter();
            const city = await getCityFromCoordinates(center.lat, center.lng);
            if (city) {
                this.setCurrentCity(city);
                const url = new URL(window.location.href);
                url.searchParams.set("city", city.cityName);
                url.searchParams.set("lat", center.lat.toFixed(5));
                url.searchParams.set("long", center.lng.toFixed(5));
                window.history.pushState({}, "", url);
            }
        }
    };

    private isAlreadyAdded(polygonData: any) {
        const coordinatesHash = JSON.stringify(
            polygonData.polygonPoints.map((point: any) => [point.latitude, point.longitude]),
        );

        if (this.addedPolygonsHash.has(coordinatesHash)) return true;

        this.addedPolygonsHash.add(coordinatesHash);

        return false;
    }

    addPolygons(polygons: any[]) {
        if (this.map && polygons && polygons.length > 0) {
            // Cancel any existing batch processing
            if (this._batchTimer) {
                clearTimeout(this._batchTimer);
                this._batchTimer = null;
            }

            // Filter out already added polygons first to avoid processing them
            const newPolygonsToAdd = polygons.filter((polygonData) => {
                if (!polygonData.polygonCenter || !polygonData.polygonPoints) return false;
                return !this.isAlreadyAdded(polygonData);
            });

            if (newPolygonsToAdd.length === 0) return;

            // Preload all images first to speed up rendering
            const preloadImages = async () => {
                const imagePromises = newPolygonsToAdd.map(async (polygonData) => {
                    if (!polygonData.dominantGroup?.imageName) return null;

                    const imageName = polygonData.dominantGroup.imageName;

                    // Check if image is already cached
                    if (this.imageCache.has(imageName)) {
                        return this.imageCache.get(imageName);
                    }

                    try {
                        const imageUrl = await getURL("groupPictures/" + imageName);
                        // Cache the image URL
                        this.imageCache.set(imageName, imageUrl);
                        return imageUrl;
                    } catch (error) {
                        console.error("Error preloading image:", error);
                        return null;
                    }
                });

                await Promise.all(imagePromises);
            };

            // Process polygons in batches for smoother rendering
            const batchSize = 5; // Process 5 polygons at a time
            const totalBatches = Math.ceil(newPolygonsToAdd.length / batchSize);

            const processBatch = async (batchIndex: number) => {
                const start = batchIndex * batchSize;
                const end = Math.min(start + batchSize, newPolygonsToAdd.length);
                const batch = newPolygonsToAdd.slice(start, end);

                // Process each polygon in the current batch
                const batchPromises = batch.map(async (polygonData) => {
                    try {
                        // Get image URL from cache if available
                        let imageUrl;
                        if (this.imageCache.has(polygonData.dominantGroup.imageName)) {
                            imageUrl = this.imageCache.get(polygonData.dominantGroup.imageName);
                        } else {
                            imageUrl = await getURL("groupPictures/" + polygonData.dominantGroup.imageName);
                            this.imageCache.set(polygonData.dominantGroup.imageName, imageUrl);
                        }

                        const poly = new Polygon(
                            this.map,
                            polygonData,
                            this.L,
                            this.setActivePlace,
                            this.setActivePolygon,
                            imageUrl as string,
                        );

                        const zoom = this.map.getZoom();
                        const area = poly.getAreaInSqM();
                        this.updatePolygonVisibility(poly, area, zoom);
                        this.allPolygons.push(poly);
                        return poly;
                    } catch (error) {
                        console.error("Error adding polygon:", error);
                        return null;
                    }
                });

                await Promise.all(batchPromises);

                // Process next batch if there are more
                if (batchIndex + 1 < totalBatches) {
                    this._batchTimer = setTimeout(() => {
                        processBatch(batchIndex + 1);
                    }, 50); // Small delay between batches for smoother rendering
                }
            };

            // First preload all images, then start processing batches
            preloadImages().then(() => {
                processBatch(0);
            });
        }
    }

    destroyMap() {
        if (this.map) {
            this.map.off();
            this.map.remove();
        }
    }
}

export default MapHandler;
