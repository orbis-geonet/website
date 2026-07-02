import type Leaflet from "leaflet";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import cities from "@/lib/ts/constants/cities.json";

type AutoComplete = {
  cityName: string;
  countryName: string;
  lat: string;
  long: string;
};

export default function AddressSearch({
  map,
  setCurrentCity,
  currentCity,
  hideMobileSearchBar,
}: {
  map: typeof Leaflet | null;
  setCurrentCity: any;
  currentCity: any;
  hideMobileSearchBar: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCompleteState, setAutoCompleteState] = useState({
    focusedOptionIndex: -1,
  });
  const memoisedCities = useMemo(() => cities as any as any[], []);
  const matchingCities = useMemo(() => {
    if (!searchQuery)
      return memoisedCities
        .slice(0, 50)
        .map((city) => ({
          cityName: city.n,
          countryName: city.c,
          lat: city.l,
          long: city.g,
        }));
    return memoisedCities
      .filter((city) =>
        (city.n + city.c)
          .replaceAll(" ", "")
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase().replaceAll(" ", "")),
      )
      .slice(0, 50)
      .map((city) => ({
        cityName: city.n,
        countryName: city.c,
        lat: city.l,
        long: city.g,
      }));
  }, [searchQuery, memoisedCities]);

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleAutoCompleteOptionClick = useCallback(
    (result: AutoComplete) => {
      if (map) {
        const latitude = Number(result.lat);
        const longitude = Number(result.long);
        hideMobileSearchBar();
        map.flyTo([latitude, longitude], 13, { animate: true, duration: 2 });
        setSearchQuery(result.cityName);
        setCurrentCity(result);
      }
    },
    [map, setCurrentCity],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setAutoCompleteState((prev) => {
        return {
          ...prev,
          focusedOptionIndex: Math.min(
            prev.focusedOptionIndex + 1,
            matchingCities.length - 1,
          ),
        };
      });
    } else if (e.key === "ArrowUp") {
      setAutoCompleteState((prev) => {
        return {
          ...prev,
          focusedOptionIndex: Math.max(prev.focusedOptionIndex - 1, 0),
        };
      });
    } else if (e.key === "Enter" && autoCompleteState.focusedOptionIndex >= 0) {
      const selectedResult =
        matchingCities[autoCompleteState.focusedOptionIndex];
      handleAutoCompleteOptionClick(selectedResult);
    }
  };

  return (
    <div className="absolute shadow-lg rounded-lg top-4 left-1/2 -translate-x-1/2 w-full max-w-[min(20rem,75vh)] z-[18] md:w-80 group">
      <div className="bg-white w-full flex items-center gap-3 rounded-lg py-2 px-3">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g style={{ opacity: ".5" }}>
              <path
                d="m20.71 19.29-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 1 0 1.42-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z"
                style={{ fill: "#919191" }}
                transform="translate(-.111)"
              />
            </g>
          </svg>
        </div>
        <input
          className="min-w-0 w-full outline-none text-sm bg-transparent"
          type="text"
          placeholder="Type your city"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div
        className={cn(
          "bg-white mt-2 rounded-lg overflow-clip hidden",
          searchQuery.length > 0 && searchQuery !== currentCity.cityName
            ? "group-focus-within:block"
            : "",
        )}
      >
        <ul className="max-h-[50vh] overflow-y-auto thin-scrollbar">
          {matchingCities.map((result, index) => (
            <li
              className={cn(
                "px-4 py-2 first:pt-4 last:pb-4 text-sm font-medium hover:bg-gray-100 focus-within:bg-gray-100 focus-within:outline-none cursor-pointer",
                autoCompleteState.focusedOptionIndex == index
                  ? "bg-gray-100"
                  : "",
              )}
              key={index}
              tabIndex={0}
              onClick={() => handleAutoCompleteOptionClick(result)}
            >
              {(result.cityName + ", " + result.countryName).substring(0, 30)}{" "}
              {(result.cityName + ", " + result.countryName).length > 30
                ? "..."
                : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
