"use client";
import { Dictionary } from "@/lib/locales";
import { createContext } from "react";

export const LocalisationContext = createContext<{
  dictionary: Dictionary;
  locale: string;
} | null>(null);

export const LocalisationProvider = function ({
  dictionary,
  locale,
  children,
}: {
  dictionary: Dictionary;
  locale: string;
  children: React.ReactNode;
}) {
  return (
    <LocalisationContext.Provider
      value={{ dictionary: dictionary, locale: locale }}
    >
      {children}
    </LocalisationContext.Provider>
  );
};
