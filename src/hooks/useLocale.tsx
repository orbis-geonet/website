"use client";
import { useContext } from "react";
import { LocalisationContext } from "@/context/localisation-context";

export default function useLocale() {
  const val = useContext(LocalisationContext);

  if (!val) {
    throw new Error("useLocale must be used within a Localisation Provider");
  }

  return val;
}
