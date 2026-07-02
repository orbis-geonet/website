import dynamic from "next/dynamic";

export const PlaceDetails = dynamic(() => import("./placedetails.section"));
export const PlacesOwnedByDominator = dynamic(
  () => import("./placesownedbydominator.section"),
);
export const PlaceNavbar = dynamic(() => import("./place-navbar.section"));
