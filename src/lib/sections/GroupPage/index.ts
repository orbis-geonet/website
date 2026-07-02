import dynamic from "next/dynamic";

export const GroupDetails = dynamic(() => import("./groupdetails.section"));
export const GroupNavbar = dynamic(() => import("./group-navbar.section"));
