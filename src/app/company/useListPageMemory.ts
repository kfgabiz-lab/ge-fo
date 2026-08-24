"use client";

import { useCallback, useEffect, useState } from "react";
import {
  rememberListPage,
  restoreListPageIfReturning,
  watchForFreshListEntryClicks,
  type CompanyListVariant,
} from "@/app/company/lastListSession";

/**
 * blog/press/events/articles 목록 페이지 공통: 페이지 번호는 URL에 싣지 않고
 * sessionStorage로만 기억한다. LIST 버튼 복귀·브라우저 뒤로가기 시에는 기억된 페이지로
 * 복원하고, GNB 등으로 새로 진입(같은 페이지에 있는 채로 재클릭한 경우 포함)하면 1페이지로
 * 초기화한다. 자세한 판단 기준은 lastListSession.ts 참고.
 */
export function useListPageMemory(variant: CompanyListVariant, basePath: string) {
  // SSR과 최초 클라이언트 렌더가 항상 1page로 일치하도록 0으로 초기화하고,
  // sessionStorage 복원은 하이드레이션 이후 effect에서만 수행한다(hydration mismatch 방지).
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    restoreListPageIfReturning(variant, (page) => setPageIndex(page - 1));
  }, [variant]);

  useEffect(
    () => watchForFreshListEntryClicks(variant, basePath, () => setPageIndex(0)),
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

  return { pageIndex, setPageIndex, goToPage };
}
