"use client";

import SupportFilterEmpty from "@/app/support/components/SupportFilterEmpty";
import { techHubEmptyContent } from "@/data/support/techHubContent";
import { useTechHubFilter, useTechHubQuery } from "./TechHubFilterProvider";

export default function TechHubEmpty() {
  const { clearAll } = useTechHubFilter();
  const { setQuery, notifyReset } = useTechHubQuery();

  // View All = 페이지 이동 없이 전체 초기화(카테고리/인증 선택 해제 + 검색어 해제). setQuery 가 내부에서 1페이지로도 리셋한다.
  // notifyReset: 검색창(TechHubSearch)의 로컬 입력값까지 비운다.
  // 카테고리 필터만으로 0건이 된 경우 query 는 원래 "" 라 값 변화가 없으므로, 신호(카운터)로 전달해야 확실히 비워진다.
  const handleViewAll = () => {
    clearAll();
    setQuery("");
    notifyReset();
  };

  return (
    <SupportFilterEmpty content={techHubEmptyContent} onViewAll={handleViewAll} />
  );
}
