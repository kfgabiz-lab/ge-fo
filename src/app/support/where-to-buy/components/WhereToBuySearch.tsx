"use client";

import { InputAdornment, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { whereToBuyPage } from "@/data/support/whereToBuyContent";
import type { GeoCoord } from "@/lib/geo/distance";
import { geocodeAddress } from "@/lib/geo/geocode";
import {
  BrowserLocationError,
  getBrowserLocation,
} from "@/lib/geo/geolocation";
import {
  fetchPlaceSuggestions,
  geocodePlaceId,
  type PlaceSuggestion,
} from "@/lib/geo/places";

const AUTOCOMPLETE_MIN_LENGTH = 1;
const AUTOCOMPLETE_DEBOUNCE_MS = 250;

export type WhereToBuyLocateSource = "device" | "address";

type WhereToBuySearchProps = {
  initialQuery?: string;
  embedded?: boolean;
  onLocate?: (coord: GeoCoord | null, source: WhereToBuyLocateSource) => void;
  onTextFallback?: (query: string) => void;
  onReset?: () => void;
};

function geolocationMessage(error: unknown): string {
  if (error instanceof BrowserLocationError) {
    switch (error.reason) {
      case "denied":
        return "Location permission was denied. Please allow location access or search by city, state, or ZIP.";
      case "unsupported":
        return "This browser does not support location services. Please search by city, state, or ZIP.";
      case "timeout":
        return "Getting your location took too long. Please try again.";
      default:
        return "We couldn't determine your location. Please search by city, state, or ZIP.";
    }
  }
  return "We couldn't determine your location. Please search by city, state, or ZIP.";
}

export default function WhereToBuySearch({
  initialQuery = "",
  embedded = false,
  onLocate,
  onTextFallback,
  onReset,
}: WhereToBuySearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [busy, setBusy] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const hasQuery = query.length > 0;

  const suppressFetchRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRequestIdRef = useRef(0);
  const fieldWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (suppressFetchRef.current) {
      suppressFetchRef.current = false;
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length < AUTOCOMPLETE_MIN_LENGTH) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      const requestId = ++suggestionsRequestIdRef.current;
      fetchPlaceSuggestions(trimmed)
        .then((list) => {
          if (suggestionsRequestIdRef.current !== requestId) return;
          setSuggestions(list);
          setShowSuggestions(list.length > 0);
        })
        .catch(() => {
          if (suggestionsRequestIdRef.current !== requestId) return;
          setSuggestions([]);
          setShowSuggestions(false);
        });
    }, AUTOCOMPLETE_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    if (!showSuggestions) return;
    function handlePointerDown(event: MouseEvent) {
      if (
        fieldWrapRef.current &&
        !fieldWrapRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [showSuggestions]);

  async function runSearch() {
    const trimmed = query.trim();
    if (busy) return;
    if (!trimmed) {
      onReset?.();
      return;
    }
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    suggestionsRequestIdRef.current += 1;
    setShowSuggestions(false);
    setBusy(true);
    try {
      const coord = await geocodeAddress(trimmed);
      if (coord) {
        onLocate?.(coord, "address");
      } else {
        onTextFallback?.(trimmed);
      }
    } catch {
      window.alert("Location search is temporarily unavailable. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function selectSuggestion(suggestion: PlaceSuggestion) {
    if (busy) return;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    suggestionsRequestIdRef.current += 1;
    suppressFetchRef.current = true;
    setQuery(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
    setBusy(true);
    try {
      const coord = await geocodePlaceId(suggestion.placeId);
      if (coord) {
        onLocate?.(coord, "address");
      }
    } catch {
      window.alert("Location search is temporarily unavailable. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function clearSearch() {
    suppressFetchRef.current = true;
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    onLocate?.(null, "address");
  }

  async function useMyLocation() {
    if (busy) return;
    setBusy(true);
    try {
      const coord = await getBrowserLocation();
      onLocate?.(coord, "device");
    } catch (error) {
      window.alert(geolocationMessage(error));
    } finally {
      setBusy(false);
    }
  }

  const field = (
    <>
      <div className="support_where_to_buy_search__field-wrap" ref={fieldWrapRef}>
        <TextField
          className={`guide_field guide_field--search support_where_to_buy_search__field${
            hasQuery ? " support_where_to_buy_search__field--filled" : ""
          }`}
          placeholder={whereToBuyPage.searchPlaceholder}
          aria-label={whereToBuyPage.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void runSearch();
            }
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment
                  position="end"
                  className="guide_field__search-adorn support_where_to_buy_search__adorn"
                >
                  {hasQuery ? (
                    <button
                      type="button"
                      className="support_where_to_buy_search__clear"
                      aria-label="Clear search"
                      onClick={clearSearch}
                    >
                      <span
                        className="support_where_to_buy_search__clear-icon"
                        aria-hidden
                      >
                        <img
                          src="/ico/ico_clear_12.svg"
                          alt=""
                          width={12}
                          height={12}
                        />
                      </span>
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="guide_field__search-icon-button"
                    aria-label="Search locations"
                    onClick={() => void runSearch()}
                    disabled={busy}
                  >
                    <img
                      src="/ico/ico_search_24.svg"
                      alt=""
                      width={embedded ? 18 : 26}
                      height={embedded ? 18 : 26}
                    />
                  </button>
                </InputAdornment>
              ),
            },
          }}
        />

        {showSuggestions ? (
          <ul
            className="support_where_to_buy_search__suggestions"
            role="listbox"
            aria-label="Address suggestions"
          >
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.placeId}
                className="support_where_to_buy_search__suggestion"
                role="option"
                aria-selected={false}
              >
                <button
                  type="button"
                  className="support_where_to_buy_search__suggestion-button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    void selectSuggestion(suggestion);
                  }}
                >
                  {suggestion.description}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <button
        type="button"
        className="support_where_to_buy_search__location"
        onClick={useMyLocation}
        disabled={busy}
      >
        <img
          src="/ico/ico_location_20.svg"
          alt=""
          width={20}
          height={20}
          aria-hidden
        />
        {whereToBuyPage.useMyLocationLabel}
      </button>
    </>
  );

  if (embedded) {
    return (
      <div
        className="support_where_to_buy_search support_where_to_buy_search--embedded"
        id="support-where-to-buy-search"
      >
        {field}
      </div>
    );
  }

  return (
    <section className="support_where_to_buy_search" id="support-where-to-buy-search">
      <div className="inner">{field}</div>
    </section>
  );
}
