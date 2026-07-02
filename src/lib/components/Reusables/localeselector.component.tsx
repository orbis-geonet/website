"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useLocale from "@/hooks/useLocale";

const POPULAR_LOCALES = ["pt", "en", "es", "fr"];

const LOCALES: Record<string, { countryCode: string; name: string }> = {
  pt: {
    countryCode: "br",
    name: "Português",
  },
  en: {
    countryCode: "us",
    name: "English",
  },
  es: {
    countryCode: "es",
    name: "Español",
  },

  de: {
    countryCode: "de",
    name: "Deutsch",
  },

  fr: {
    countryCode: "fr",
    name: "Français",
  },
  ru: {
    countryCode: "ru",
    name: "Русский",
  },
  it: {
    countryCode: "it",
    name: "Italiano",
  },
  ja: {
    countryCode: "jp",
    name: "日本語",
  },
  ko: {
    countryCode: "kr",
    name: "한국어",
  },
  zh: {
    countryCode: "cn",
    name: "中文",
  },
  ar: {
    countryCode: "sa",
    name: "العربية",
  },
  hi: {
    countryCode: "in",
    name: "हिंदी",
  },
  nl: {
    countryCode: "nl",
    name: "Nederlands",
  },
  pl: {
    countryCode: "pl",
    name: "Polski",
  },
  tr: {
    countryCode: "tr",
    name: "Türkçe",
  },
};

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { locale: currentLocaleValue } = useLocale();
  const [value, setValue] = useState<string>(currentLocaleValue);
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(newValue: string) {
    router.push(pathname + "?locale=" + newValue);
    router.refresh();
    setOpen(false);
  }

  useEffect(() => {
    setValue(currentLocaleValue);
  }, [currentLocaleValue]);

  const currentLocale = LOCALES[value];

  const filteredLocales = Object.entries(LOCALES).filter(
    ([key, locale]) =>
      locale.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="relative">
      <button onClick={() => setOpen((prev) => !prev)}>
        <div className="flex items-center gap-2">
          <div
            className={`h-6 w-6 min-w-[24px] rounded-full fi fis fi-${currentLocale.countryCode}`}
          ></div>
        </div>
      </button>
      {open && (
        <div className="fixed inset-0" onClick={() => setOpen(false)}></div>
      )}
      <div
        className={`absolute top-[120%] right-0 z-50 w-64 rounded-md bg-white border shadow-lg ${open ? "block" : "hidden"}`}
      >
        <div className="p-2 border-b">
          <input
            type="text"
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {searchQuery === "" ? (
            <div className="p-2">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                Popular
              </div>
              {POPULAR_LOCALES.map((key) => {
                const locale = LOCALES[key];
                return (
                  <button
                    key={key}
                    onClick={() => handleChange(key)}
                    className={`w-full py-2 px-3 text-left hover:bg-gray-100 ${
                      key === value
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-6 w-6 min-w-[24px] rounded-full fi fis fi-${locale.countryCode}`}
                      ></div>
                      <span className="font-medium text-sm">{locale.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-2">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                All Languages
              </div>
              {filteredLocales.map(([key, locale]) => (
                <button
                  key={key}
                  onClick={() => handleChange(key)}
                  className={`w-full py-2 px-3 text-left hover:bg-gray-100 ${
                    key === value
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-6 w-6 min-w-[24px] rounded-full fi fis fi-${locale.countryCode}`}
                    ></div>
                    <span className="font-medium text-sm">{locale.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
