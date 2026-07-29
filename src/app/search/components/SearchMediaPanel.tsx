"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import SupportFilterModal from "@/app/support/components/SupportFilterModal";
import PageNumbering from "@/components/pagination/PageNumbering";
import SearchMediaFilterPanel from "./SearchMediaFilterPanel";
import {
  SearchMediaFilterProvider,
  useSearchMediaFilter,
} from "./SearchMediaFilterProvider";
import SearchEmptyResult from "./SearchEmptyResult";
import SearchMediaList from "./SearchMediaList";
import { searchMediaPage } from "@/data/search/searchMediaContent";
import {
  fetchSearchMedia,
  type SearchMediaResult,
} from "@/data/search/searchMediaData";

// Media 탭 페이지 크기(퍼블리싱 기준 10건)
const { pageSize: PAGE_SIZE } = searchMediaPage;

function SearchMediaPanelContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  // 최초 로딩 전에는 counts 를 빈 객체로 두어 필터 라벨에 "(0)" 이 잠깐 스치지 않게 한다.
  const [result, setResult] = useState<SearchMediaResult>({
    items: [],
    totalElements: 0,
    totalPages: 0,
    counts: {},
  });
  // 최초 응답 도착 여부. 도착 전에는 Empty State 를 띄우지 않는다(로딩 중 깜빡임 방지).
  const [loaded, setLoaded] = useState(false);

  // 검색어(q)는 URL ?q= 에서 읽는다(All 탭/Products 탭과 동일 소스).
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  // 선택된 문서유형(소스) 옵션 id 목록. 정렬해 안정 의존성 키로 사용.
  const { getSelectedCategoryValues } = useSearchMediaFilter();
  const selectedSources = getSelectedCategoryValues("document");
  const sourcesKey = [...selectedSources].sort().join(",");

  const pageItems = result.items;
  const totalResults = result.totalElements;
  const totalPages = Math.max(1, result.totalPages);
  // 응답이 도착한 뒤 0건일 때만 공통 Empty State 를 노출한다.
  const isEmptyResult = loaded && pageItems.length === 0;

  // 검색어/필터 변경 시 1페이지로(최초 실행 제외).
  const firstResetRef = useRef(true);
  useEffect(() => {
    if (firstResetRef.current) {
      firstResetRef.current = false;
      return;
    }
    setCurrentPage(1);
  }, [query, sourcesKey]);

  // 실검색(검색어/선택 소스/페이지 변경 시). 실패 시 빈 결과 폴백은 헬퍼가 처리.
  useEffect(() => {
    let alive = true;
    void fetchSearchMedia(query, {
      sources: selectedSources,
      // 화면 페이지는 1-based, API page 는 0-based.
      page: currentPage - 1,
      size: PAGE_SIZE,
    }).then((res) => {
      if (!alive) return;
      setResult(res);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
    // selectedSources 는 sourcesKey 로 대표(매 렌더 새 배열이라 직접 의존 불가).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sourcesKey, currentPage]);

  return (
    <section className="search_media devices_product_downloads" id="search-media">
      <div className="inner">
        <div className="search_media__body devices_product_downloads__body">
          <SearchMediaFilterPanel
            variant="sidebar"
            sidebarClassName="search_media__filter devices_product_downloads__filter-stack--pc"
            counts={result.counts}
          />

          <div className="search_media__main">
            <div className="search_media__list-block">
              <div className="search_media__mo-filter-wrap">
                <button
                  type="button"
                  className="search_media__mo-filter"
                  onClick={() => setFilterOpen(true)}
                >
                  <span className="search_media__mo-filter-label">Filter by</span>
                  <span className="search_media__mo-filter-icon" aria-hidden>
                    <img
                      src="/ico/ico_filter_14.svg"
                      alt=""
                      width={14}
                      height={14}
                    />
                  </span>
                </button>
              </div>

              <div className="search_media__results">
                <p className="search_media__count">
                  Total <strong>{totalResults.toLocaleString()}</strong>
                </p>

                {isEmptyResult ? (
                  <SearchEmptyResult />
                ) : (
                  <SearchMediaList items={pageItems} variant="card" />
                )}
              </div>
            </div>

            {isEmptyResult ? null : (
              <PageNumbering
                className="search_media__pagination"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                ariaLabel="Search media pagination"
              />
            )}
          </div>
        </div>
      </div>

      <SupportFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        applyLabel="Apply"
      >
        <SearchMediaFilterPanel variant="modal" counts={result.counts} />
      </SupportFilterModal>
    </section>
  );
}

export default function SearchMediaPanel() {
  return (
    <SearchMediaFilterProvider>
      <SearchMediaPanelContent />
    </SearchMediaFilterProvider>
  );
}
