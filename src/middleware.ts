import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { countries } from "countries-list";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const locales = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "ru",
  "it",
  "ja",
  "ko",
  "zh",
  "ar",
  "hi",
  "nl",
  "pl",
  "tr",
];

function getLocale(request: NextRequest) {
  const defaultLocale = "en";
  try {
    // Try to get country from request headers (many proxies/load balancers add this)
    // CloudFlare adds 'cf-ipcountry' header
    // Other services might add different headers
    const country = (
      request.headers.get("cf-ipcountry") ||
      request.headers.get("x-country-code") ||
      request.geo?.country ||
      ""
    ).toLowerCase();

    // console.log("country", country);
    // console.log("request.headers", request.headers);

    // Map countries to locales based on their languages
    const countryToLocale: { [key: string]: string } = Object.entries(
      countries,
    ).reduce(
      (acc, [code, country]) => {
        // Map all supported languages to their respective locales
        if (country.languages) {
          for (const lang of country.languages) {
            if (locales.includes(lang)) {
              acc[code.toLowerCase()] = lang;
              break;
            }
          }
        }
        return acc;
      },
      {} as { [key: string]: string },
    );

    // console.log("countryToLocale", countryToLocale);
    // If country is mapped to a supported locale, use it
    if (
      country &&
      countryToLocale[country] &&
      locales.includes(countryToLocale[country])
    ) {
      return countryToLocale[country];
    }

    // Fallback to browser language preferences if no country match
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value: string, key: string) => {
      negotiatorHeaders[key] = value;
    });
    const languages = new Negotiator({
      headers: negotiatorHeaders,
    }).languages();
    const locale = match(locales, languages, defaultLocale);
    return locale.split("-")[0] || defaultLocale;
  } catch (err) {
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = request.url.replaceAll(`${request.nextUrl.origin}/api`, "");
  const origin = request.headers.get("origin");
  let response = NextResponse.next();

  if (pathname.startsWith("/api")) {
    if (pathname === "/api/parse-address" || pathname === "/api/preview" || pathname === "/api/swap") {
      response = NextResponse.next();
    } else {
      const upstreamHeaders = new Headers(request.headers);
      if (process.env.JAVA_MASTER_KEY) {
        upstreamHeaders.set("X-Master-Key", process.env.JAVA_MASTER_KEY);
      }
      response = NextResponse.rewrite(
        new URL(`${API_URL}${path}`, request.url),
        { request: { headers: upstreamHeaders } },
      );
    }

    response.headers.set("Access-Control-Allow-Credentials", "true");

    if (ALLOWED_ORIGINS.includes(origin ? origin : "")) {
      response.headers.set("Access-Control-Allow-Origin", origin ? origin : "");
    }

    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,DELETE,PATCH,POST,PUT",
    );

    response.headers.set(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    );
  } else {
    const excludedPaths = ["/api", "/static", "/_next"];
    const isExcluded = excludedPaths.some(
      (path) => pathname.startsWith(path) || pathname.match(/.*\..*/),
    );
    if (!isExcluded) {
      const localeInCookie = request.cookies.get("locale")?.value;
      const localeInQuery = request.nextUrl.searchParams.get("locale");
      const queryHasLocale = locales.some((locale) => localeInQuery === locale);

      if (queryHasLocale) {
        response.cookies.set({
          name: "locale",
          value: localeInQuery ?? "en",
        });
      } else if (!localeInCookie) {
        const locale = getLocale(request);
        response.cookies.set({
          name: "locale",
          value: locale ?? "en",
        });
      } else {
        response.cookies.set({
          name: "locale",
          value: localeInCookie ?? "en",
        });
      }
    }
  }

  return response;
}
