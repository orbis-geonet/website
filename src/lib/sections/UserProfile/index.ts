import dynamic from "next/dynamic";

export const UserDetails = dynamic(() => import("./userdetails.section"));
export const UserNavbar = dynamic(() => import("./user-navbar.section"));
export const SingleImage = dynamic(() => import("./singleImage.component"));
