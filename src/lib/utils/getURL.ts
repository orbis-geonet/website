import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@constants";
// import { FirebaseApp } from "@constants";

export const getURL = (path: string) => {
  try {
    const url = getDownloadURL(ref(storage, path));
    return url;
  } catch {
    return "/";
  }
};
