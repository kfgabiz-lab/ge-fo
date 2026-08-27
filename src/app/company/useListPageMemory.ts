"use client";

import { useCallback, useEffect, useState } from "react";
import {
  computeInitialListState,
  markReturnIntentOnLeavingToDetail,
  rememberListPage,
  rememberListSearch,
  watchForFreshListEntryClicks,
  type CompanyListVariant,
} from "@/app/company/lastListSession";

/**
 * blog/press/events/articles 목록 페이지 공통: 페이지 번호·검색어는 URL에 싣지 않고
 * sessionStorage로만 기억한다. LIST 버튼 복귀·브라우저 뒤로가기 시에는 기억된 페이지/검색어로
 * 복원하고, GNB 등으로 새로 진입(같은 페이지에 있는 채로 재클릭한 경우 포함)하면 1페이지·빈
 * 검색어로 초기화한다. 자세한 판단 기준은 lastListSession.ts 참고.
 *
 * 복원 여부는 렌더 중(useState lazy initializer)에 동기적으로 확정한다 — useEffect에서
 * 복원하면 라우터 캐시 재사용 등으로 effect가 안 붙는 경우 복원이 아예 누락될 수 있다.
 */
export function useListPageMemory(variant: CompanyListVariant, basePath: string) {
  const [initial] = useState(() => computeInitialListState(variant));
  const [pageIndex, setPageIndex] = useState(initial.pageIndex);
  const [search, setSearch] = useState(initial.search);

  useEffect(
    () =>
      watchForFreshListEntryClicks(variant, basePath, () => {
        setPageIndex(0);
        setSearch("");
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

  return { pageIndex, setPageIndex, goToPage, search, setSearch, submitSearch };
}
