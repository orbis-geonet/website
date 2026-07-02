import { default as SHOPPING } from "@public/default/shopping.svg";
import { default as BAR } from "@public/default/bar.svg";
import { default as BEACH } from "@public/default/beach.svg";
import { default as BUILDING } from "@public/default/building.svg";
import { default as CASTLE } from "@public/default/castle.svg";
import { default as FAST_FOOD } from "@public/default/fast_food.svg";
import { default as HOUSE } from "@public/default/house.svg";
import { default as HOUSE_2 } from "@public/default/house_2.svg";
import { default as LOCATION } from "@public/default/location.svg";
import { default as MUSIC } from "@public/default/music.svg";
import { default as PARK } from "@public/default/park.svg";
import { default as TWO_BUILDINGS } from "@public/default/two_buildings.svg";
import { default as RESTAURANT } from "@public/default/restaurant.svg";
import { default as SCHOOL } from "@public/default/school.svg";
import { default as SPORTS_CENTER } from "@public/default/sports_center.svg";

export const getDefaultPlaceImage = (type?: string) => {
  switch (type) {
    case "SHOPPING":
      return SHOPPING;
    case "PARK":
      return PARK;
    case "BAR":
      return BAR;
    case "RESTAURANT":
      return RESTAURANT;
    case "SCHOOL":
      return SCHOOL;
    case "LOCATION":
      return LOCATION;
    case "TWO_BUILDINGS":
      return TWO_BUILDINGS;
    case "SPORTS_CENTER":
      return SPORTS_CENTER;
    case "CASTLE":
      return CASTLE;
    case "HOUSE_2":
      return HOUSE_2;
    case "MUSIC":
      return MUSIC;
    case "FAST_FOOD":
      return FAST_FOOD;
    case "HOUSE":
      return HOUSE;
    case "BUILDING":
      return BUILDING;
    case "BEACH":
      return BEACH;
    default:
      return LOCATION;
  }
};

export const getDefaultPlaceImagePath = (type?: string, isWhite?: boolean) => {
  switch (type) {
    case "SHOPPING":
      return `/default/shopping${isWhite ? "-white" : ""}.svg`;
    case "PARK":
      return `/default/park${isWhite ? "-white" : ""}.svg`;
    case "BAR":
      return `/default/bar${isWhite ? "-white" : ""}.svg`;
    case "RESTAURANT":
      return `/default/restaurant${isWhite ? "-white" : ""}.svg`;
    case "SCHOOL":
      return `/default/school${isWhite ? "-white" : ""}.svg`;
    case "LOCATION":
      return `/default/location${isWhite ? "-white" : ""}.svg`;
    case "TWO_BUILDINGS":
      return `/default/two_buildings${isWhite ? "-white" : ""}.svg`;
    case "SPORTS_CENTER":
      return `/default/sports_center${isWhite ? "-white" : ""}.svg`;
    case "CASTLE":
      return `/default/castle${isWhite ? "-white" : ""}.svg`;
    case "HOUSE_2":
      return `/default/house_2${isWhite ? "-white" : ""}.svg`;
    case "MUSIC":
      return `/default/music${isWhite ? "-white" : ""}.svg`;
    case "FAST_FOOD":
      return `/default/fast_food${isWhite ? "-white" : ""}.svg`;
    case "HOUSE":
      return `/default/house${isWhite ? "-white" : ""}.svg`;
    case "BUILDING":
      return `/default/building${isWhite ? "-white" : ""}.svg`;
    case "BEACH":
      return `/default/beach${isWhite ? "-white" : ""}.svg`;
    default:
      return `/default/location${isWhite ? "-white" : ""}.svg`;
  }
};
