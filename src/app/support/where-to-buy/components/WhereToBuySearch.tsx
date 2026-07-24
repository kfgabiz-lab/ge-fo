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

// 자동완성 조회 최소 입력 길이 / 디바운스 지연(ms)
const AUTOCOMPLETE_MIN_LENGTH = 1;
const AUTOCOMPLETE_DEBOUNCE_MS = 250;

type WhereToBuySearchProps = {
  initialQuery?: string;
  /** Figma 5752:47215 — left column search inside contents */
  embedded?: boolean;
  /**
   * 검색좌표 확정 콜백. 지오코딩/내위치로 얻은 좌표를 상위(Contents)로 올린다.
   * null 이면 검색 해제(전체 목록 복귀).
   */
  onLocate?: (coord: GeoCoord | null) => void;
};

// 위치 획득 실패 사유별 사용자 알림 문구
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
}: WhereToBuySearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [busy, setBusy] = useState(false);
  // 주소 자동완성 후보 목록 + 드롭다운 표시 여부
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const hasQuery = query.length > 0;

  // 후보 선택/검색확정 직후 setQuery 로 인한 재조회를 1회 억제하는 플래그
  const suppressFetchRef = useRef(false);
  // 디바운스 타이머
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 바깥 클릭 감지용 컨테이너 참조
  const fieldWrapRef = useRef<HTMLDivElement>(null);

  // 입력 변화 시 디바운스 후 자동완성 후보 조회
  useEffect(() => {
    // 후보 선택/검색확정으로 인한 setQuery 는 재조회하지 않는다.
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
      fetchPlaceSuggestions(trimmed)
        .then((list) => {
          setSuggestions(list);
          setShowSuggestions(list.length > 0);
        })
        .catch(() => {
          // 조회 실패(자동완성 불가) 시 조용히 드롭다운만 숨기고 Enter/버튼 지오코딩 폴백에 맡긴다.
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

  // 바깥 클릭 시 드롭다운 닫기
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

  // 입력 문자열 → 좌표 지오코딩 후 상위로 전달(자동완성 없이 직접 입력·제출하는 폴백 경로)
  async function runSearch() {
    const trimmed = query.trim();
    if (!trimmed || busy) return;
    setShowSuggestions(false);
    setBusy(true);
    try {
      const coord = await geocodeAddress(trimmed);
      if (coord) {
        onLocate?.(coord);
      } else {
        window.alert(
          "We couldn't find that location. Please check the city, state, or ZIP and try again.",
        );
      }
    } catch {
      window.alert("Location search is temporarily unavailable. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  // 자동완성 후보 선택 → placeId 로 좌표 확정 + 검색창을 선택 주소로 갱신
  async function selectSuggestion(suggestion: PlaceSuggestion) {
    if (busy) return;
    // 아래 setQuery 로 인한 재조회 억제
    suppressFetchRef.current = true;
    setQuery(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
    setBusy(true);
    try {
      const coord = await geocodePlaceId(suggestion.placeId);
      if (coord) {
        onLocate?.(coord);
      } else {
        window.alert(
          "We couldn't find that location. Please check the city, state, or ZIP and try again.",
        );
      }
    } catch {
      window.alert("Location search is temporarily unavailable. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  // 검색 해제 → 전체 목록 복귀
  function clearSearch() {
    suppressFetchRef.current = true;
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    onLocate?.(null);
  }

  // 내 위치 사용 → geolocation 좌표를 검색좌표와 동일 파이프라인에 태움
  async function useMyLocation() {
    if (busy) return;
    setBusy(true);
    try {
      const coord = await getBrowserLocation();
      onLocate?.(coord);
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
            // 엔터 제출 — 폼 요소 추가 없이 입력창에서 바로 검색
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
                  // onMouseDown: input blur 전에 선택이 확정되도록 mousedown 에서 처리
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
