import { StaticImageData } from "next/image";

export interface TCHECKIN {
  postid: string;
  type: string;
  caption?: string;
  time: string;
  userid: string | number;
  userProviderImageUrl?: string | null;
  userslug: string;
  username: string;
  userprofile: string;
  placeslug: string;
  placeid: string | number;
  placename: string;
  placetype: string;
  placeprofile: string;
  commentsCount: number;
  attendeesCount: number;
  groupid: string;
  groupslug: string;
  groupname: string;
  groupprofile: string;
  groupcolor: string;
}

export interface TPOST {
  postid: string;
  type: string;
  caption?: string;
  mediaSrc?: string[];
  time: string;
  userid: string | number;
  userProviderImageUrl?: string | null;
  userslug: string;
  username: string;
  userprofile: string;
  commentsCount: number;
  attendeesCount: number;
  postedAsUser: boolean;
  groupslug?: string;
  groupid?: string;
  groupname?: string;
  groupprofile?: string;
  groupcolor?: string;
  placeslug?: string;
  placeid?: string | number;
  placename?: string;
}

export interface TEVENT {
  id: string;
  title: string;
  details: string;
  starttime: string;
  endtime: string;
  mediaSrc: string;
  placeid: string;
  placeslug: string;
  placename: string;
  placeaddress: string;
}

export interface TEVENTPOST extends TEVENT {
  type: string;
}

export interface METAPROPS {
  params: {
    id: string;
  };
}

export interface TCOMMENT {
  id: string | number;
  user: {
    slug: string;
    id: string | number;
    image: string | StaticImageData;
    providerImageUrl?: string | null;
    name: string;
  };
  text: string;
  time: string;
}

export interface TCOMMENTWITHREPLIES extends TCOMMENT {
  replies: TCOMMENT[] | [];
}

export interface TSEARCHRESULTGROUP {
  id: string;
  slug: string;
  name: string;
  image: string;
  color: string;
  membersCount: number;
  placesCount: number;
  description: string;
}

export interface TUSERGROUP {
  id: string;
  slug: string;
  name: string;
  image: string;
  color: string;
  description: string;
}

export interface TNEARBYPLACE {
  id: string;
  slug: string;
  name: string;
  image?: string;
  address?: string;
  color?: string;
  rating: number;
  type?: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
}

export interface TPHOTO {
  id: string;
  image: string;
  type?: string;
  timestamp: string;
}

export interface TPLAN {
  id: string;
  title: string;
  description: string;
  features: string[];
  currency: string;
  price: number;
  type: string;
  interval: string;
  period: number;
  images?: string[];
}
