"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import LanguageSelector from "@/lib/components/Reusables/localeselector.component";
import { Searchsuggestioncard, DownloadHereButton } from "@components";
import { BASE_URL, TSEARCHRESULTGROUP } from "@/lib/ts";
import { cn, searchResultsMapper } from "@/lib/utils";
import useLocale from "@/hooks/useLocale";
import NetworkBadge from "@/lib/sections/NetworkPage/network-badge";
import { default as LogoIcon } from "@public/logos/logo.webp";
import { default as LogoWithName } from "@public/logos/logowithname.webp";
import { isMap } from "lodash";

const SearchIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20 L16 16" />
  </svg>
);

const MenuIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    className={className}
  >
    <path d="M4 7 H20" />
    <path d="M4 12 H20" />
    <path d="M4 17 H20" />
  </svg>
);

const CloseIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    className={className}
  >
    <path d="M6 6 L18 18" />
    <path d="M18 6 L6 18" />
  </svg>
);

type NavItem = { key: string; label: string; href: string };

const ExchangeHeader = ({
  onDownloadClick,
  showNetworkBadge = false,
}: {
  onDownloadClick?: () => void;
  showNetworkBadge?: boolean;
} = {}) => {
  const { dictionary } = useLocale();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<TSEARCHRESULTGROUP[]>();
  const [controller, setController] = useState<AbortController>();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
	
	const isMapPage = pathname === "/map";

  const NAV_ITEMS: NavItem[] = [
    { key: "home", label: dictionary.common.home, href: "/" },
    { key: "developer", label: dictionary.common.navDeveloper, href: "/exchange" },
    { key: "network", label: "Network", href: "/network" },
  ];

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (controller) controller.abort();
    const newController = new AbortController();
    setController(newController);

    if (query.trim() !== "") {
      fetch(`${BASE_URL}/api/groups?name=${query}&page=0&size=5`, {
        signal: newController.signal,
      })
        .then((res) => res.json())
        .then((data) => setSuggestions(searchResultsMapper(data)))
        .catch((err) => {
          if (err.name !== "AbortError") console.error(err);
        });
    } else {
      setSuggestions([]);
    }

    return () => newController.abort();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSuggestions([]);
    setMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
  };

  return (
    <>
      <header className={cn("relative z-10 flex items-center justify-between gap-4 px-5 py-5 sm:gap-6 sm:px-8 sm:py-6 lg:px-14 lg:py-8", isMapPage ? "sm:py-3 lg:py-4" : "")}>
        <Link href="/" aria-label="Orbis home" className="flex items-center">
          <Image
            src={LogoIcon}
            alt="Orbis"
            className="h-10 w-10 object-contain sm:hidden"
            priority
          />
          <Image
            src={LogoWithName}
            alt="Orbis"
            className="hidden sm:block h-10 w-auto object-contain lg:h-12"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-12">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`relative text-base transition ${
                  isActive
                    ? "font-semibold text-black"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute left-1/2 -bottom-2 h-1 w-1 -translate-x-1/2 rounded-full bg-black"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          {/* Desktop search with suggestions */}
          <div className="hidden sm:block relative">
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-3 rounded-full bg-neutral-100 px-5 py-3.5 w-[360px] lg:w-[500px] transition focus-within:bg-neutral-200/70"
            >
              <SearchIcon className="h-5 w-5 text-neutral-700" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={dictionary.common.searchbarPlaceholder}
                className="flex-1 bg-transparent text-base outline-none placeholder:text-neutral-500"
              />
              <button type="submit" hidden />
            </form>
            {suggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-xl p-4 z-50">
                <ul className="space-y-2">
                  {suggestions.map((group) => (
                    <li key={group.id}>
                      <Searchsuggestioncard
                        {...group}
                        setSuggestions={setSuggestions}
                        hideSmallScreenSearchbar={() => {}}
                        clearQuery={() => setQuery("")}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {showNetworkBadge && <NetworkBadge />}

          <div className="[&_.fi]:h-9 [&_.fi]:w-9 [&_.fi]:min-w-[36px]">
            <LanguageSelector />
          </div>

          {onDownloadClick && (
            <DownloadHereButton
              onClick={onDownloadClick}
              className="hidden md:block"
            />
          )}

          <button
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-neutral-900 hover:bg-neutral-100 transition"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between px-5 py-5 border-b border-neutral-100">
            <Link
              href="/"
              aria-label="Orbis home"
              className="flex items-center"
              onClick={() => setMenuOpen(false)}
            >
              <Image
                src={LogoWithName}
                alt="Orbis"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <button
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-900 hover:bg-neutral-100 transition"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="px-5 py-6 space-y-6">
            {/* Mobile search with suggestions */}
            <div className="relative">
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-3 rounded-full bg-neutral-100 px-5 py-3.5"
              >
                <SearchIcon className="h-5 w-5 text-neutral-700" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={dictionary.common.searchbarPlaceholder}
                  className="flex-1 bg-transparent text-base outline-none placeholder:text-neutral-500"
                />
                <button type="submit" hidden />
              </form>
              {suggestions && suggestions.length > 0 && (
                <div className="mt-2 bg-white shadow-lg rounded-xl p-4">
                  <ul className="space-y-2">
                    {suggestions.map((group) => (
                      <li key={group.id}>
                        <Searchsuggestioncard
                          {...group}
                          setSuggestions={setSuggestions}
                          hideSmallScreenSearchbar={() => setMenuOpen(false)}
                          clearQuery={() => setQuery("")}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <nav className="flex flex-col">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between py-4 text-lg transition border-b border-neutral-100 ${
                      isActive
                        ? "font-semibold text-black"
                        : "text-neutral-700 hover:text-black"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full bg-black"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {onDownloadClick && (
              <DownloadHereButton onClick={onDownloadClick} className="w-full" />
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default ExchangeHeader;
