"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { default as SearchIconSrc } from "@public/icons/search.svg";
import { useRouter } from "next/navigation";
import { BASE_URL, TSEARCHRESULTGROUP } from "@/lib/ts";
import { Searchsuggestioncard } from "..";
import { searchResultsMapper } from "@/lib/utils";
import useLocale from "@/hooks/useLocale";

type PROPS = {
  className?: string;
  setSmallScreenSearchbarVisibility?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  mobileSearchbar?: boolean;
};
const Searchbar: React.FC<PROPS> = ({
  className = "",
  setSmallScreenSearchbarVisibility,
  query,
  setQuery,
  mobileSearchbar = false,
}) => {
  const { dictionary } = useLocale();
  const [suggestions, setSuggestions] = useState<TSEARCHRESULTGROUP[]>();
  const [controller, setController] = useState<AbortController>();
  const router = useRouter();

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const hideSmallScreenSearchbar = () => {
    if (setSmallScreenSearchbarVisibility)
      setSmallScreenSearchbarVisibility(false);
  };

  const handleSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    setSuggestions([]);
    hideSmallScreenSearchbar();
    router.push(`/search?q=${query}`);
    setQuery("");
  };

  useEffect(() => {
    if (controller) {
      controller.abort();
    }

    const newController = new AbortController();
    setController(newController);

    if (query.trim() !== "") {
      fetch(`${BASE_URL}/api/groups?name=${query}&page=0&size=5`, {
        signal: newController.signal,
      })
        .then((response) => response.json())
        .then((data) => {
          const temp = searchResultsMapper(data);
          setSuggestions(temp);
        })
        .catch((error) => {
          if (error.name === "AbortError") {
            // console.log("Request aborted:", error.message);
          } else {
            // console.error("Error fetching suggestions:", error);
          }
        });
    } else {
      setSuggestions([]);
    }

    return () => {
      if (newController) {
        newController.abort();
      }
    };
  }, [query]);

  return (
    <div className="relative searchbar">
      <form
        aria-label="Searchbar"
        className={`flex w-full items-center bg-white border-b focus-within:border-primary lg:border-0 lg:shadow-light lg:w-fit py-3 px-6 lg:rounded-md ${className}`}
      >
        <input
          value={query ? query : ""}
          onChange={handleQueryChange}
          type="text"
          className="bg-transparent outline-none flex-1 lg:flex-auto lg:w-[600px]"
          placeholder={dictionary.common.searchbarPlaceholder}
        />
        <button onClick={handleSearch} className="hidden lg:block">
          <Image src={SearchIconSrc} alt="search-icon" height={18} />
        </button>
        <button onClick={handleSearch} hidden></button>
      </form>
      {suggestions && suggestions.length !== 0 && (
        <div
          className={`absolute bg-white shadow-moreblurred w-full p-4 md:p-7 ${
            mobileSearchbar ? "block lg:hidden" : "hidden lg:block"
          }`}
        >
          <p className="text-xs md:text-base text-[#707070]">
            {dictionary.common.searchSuggestionHeading}
          </p>
          <ul className="space-y-2 md:space-y-4">
            {suggestions.map((group) => (
              <li key={group.id}>
                <Searchsuggestioncard
                  {...group}
                  setSuggestions={setSuggestions}
                  hideSmallScreenSearchbar={hideSmallScreenSearchbar}
                  clearQuery={() => setQuery("")}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
