"use client";

import { useCallback, useEffect, useState } from "react";
import {
  markReturnIntentOnLeavingToDetail,
  rememberListFilters,
  rememberListPage,
  rememberListSearch,
  restoreListStateIfReturning,
  watchForFreshListEntryClicks,
  type CompanyListVariant,
} from "@/app/company/lastListSession";

/**
 * blog/press/events/articles 목록 페이지 공통: 페이지 번호·검색어·필터(카테고리·정렬·월/년
 * 등)는 URL에 싣지 않고 sessionStorage로만 기억한다. LIST 버튼 복귀·브라우저 뒤로가기 시에는
 * 기억된 값으로 복원하고, GNB 등으로 새로 진입(같은 페이지에 있는 채로 재클릭한 경우 포함)하면
 * 전부 초기화한다. 자세한 판단 기준은 lastListSession.ts 참고.
 *
 * 필터는 페이지마다 종류가 달라서(카테고리, 정렬, 월, 년 등) 타입을 고정하지 않고
 * Record<string, string>으로 자유롭게 담는다 — 각 페이지가 자기 필터 키를 넣고 읽는다.
 *
 * 초기 state는 항상 서버와 동일하게 1페이지·빈 검색어·빈 필터로 시작하고, 복원은 마운트 직후
 * useEffect에서 patch한다 — 렌더 중 sessionStorage 값으로 초기 state를 계산하면 SSR과
 * 달라져 하이드레이션 불일치가 나기 때문(자세한 이유는 restoreListStateIfReturning 참고).
 * 모든 관련 네비게이션이 하드 리로드(완전한 새 마운트)라 effect 기반 복원이 안전하다.
 */
export function useListPageMemory(variant: CompanyListVariant, basePath: string) {
  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    restoreListStateIfReturning(variant, basePath, {
      pageIndex: setPageIndex,
      search: setSearch,
      filters: setFilters,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, basePath]);

  useEffect(
    () =>
      watchForFreshListEntryClicks(variant, basePath, () => {
        setPageIndex(0);
        setSearch("");
        setFilters({});
        rememberListSearch(variant, "");
      }),
    [variant, basePath],
  );

  useEffect(
    () => markReturnIntentOnLeavingToDetail(variant, basePath),
    [variant, basePath],
  );

  const goToPage = useCallback(
    (page: number) => {
      const nextIndex = Math.max(0, page - 1);
      setPageIndex(nextIndex);
      rememberListPage(variant, nextIndex + 1);
    },
    [variant],
  );

  const submitSearch = useCallback(
    (value: string) => {
      setSearch(value);
      rememberListSearch(variant, value);
    },
    [variant],
  );

  /** 필터 하나(또는 여러 개)를 갱신하고 기억해 둔다 — 기존 필터 값 위에 병합한다. */
  const updateFilters = useCallback(
    (patch: Record<string, string>) => {
      setFilters((current) => {
        const next = { ...current, ...patch };
        rememberListFilters(variant, next);
        return next;
      });
    },
    [variant],
  );

  return {
    pageIndex,
    setPageIndex,
    goToPage,
    search,
    setSearch,
    submitSearch,
    filters,
    updateFilters,
  };
}
