import enDictionary from "@/lib/locales/en.json";
import { cookies } from "next/headers";

export type Dictionary = typeof enDictionary;

export const popularLanguages = ["en", "es", "fr", "de"];

export const allLanguages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "pt", name: "Português" },
    { code: "ru", name: "Русский" },
    { code: "it", name: "Italiano" },
    { code: "ja", name: "日本語" },
    { code: "ko", name: "한국어" },
    { code: "zh", name: "中文" },
    { code: "ar", name: "العربية" },
    { code: "hi", name: "हिंदी" },
    { code: "nl", name: "Nederlands" },
    { code: "pl", name: "Polski" },
    { code: "tr", name: "Türkçe" },
];

const dictionaries: Record<string, () => Promise<Dictionary>> = {
    en: () => import("@/lib/locales/en.json").then((module) => module.default),
    pt: () => import("@/lib/locales/pt.json").then((module) => module.default),
    fr: () => import("@/lib/locales/fr.json").then((module) => module.default),
    es: () => import("@/lib/locales/es.json").then((module) => module.default),
    de: () => import("@/lib/locales/de.json").then((module) => module.default),
    ru: () => import("@/lib/locales/ru.json").then((module) => module.default),
    it: () => import("@/lib/locales/it.json").then((module) => module.default),
    ja: () => import("@/lib/locales/ja.json").then((module) => module.default),
    ko: () => import("@/lib/locales/ko.json").then((module) => module.default),
    zh: () => import("@/lib/locales/zh.json").then((module) => module.default),
    ar: () => import("@/lib/locales/ar.json").then((module) => module.default),
    hi: () => import("@/lib/locales/hi.json").then((module) => module.default),
    nl: () => import("@/lib/locales/nl.json").then((module) => module.default),
    pl: () => import("@/lib/locales/pl.json").then((module) => module.default),
    tr: () => import("@/lib/locales/tr.json").then((module) => module.default),
};

export const getDictionary = async (): Promise<{
    dictionary: Dictionary;
    locale: string;
}> => {
    const cookieStore = cookies();
    const locale = cookieStore.get("locale")?.value || "en";
    const availableLanguages = Object.keys(dictionaries);
    const dictionary = availableLanguages.includes(locale) ? await dictionaries[locale]() : enDictionary;
    return {
        dictionary: dictionary ? dictionary : enDictionary,
        locale: locale ? locale : "en",
    };
};
