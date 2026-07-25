"use client";

import SupportFilterEmpty from "@/app/support/components/SupportFilterEmpty";
import { techHubEmptyContent } from "@/data/support/techHubContent";
import { useTechHubFilter, useTechHubQuery } from "./TechHubFilterProvider";

export default function TechHubEmpty() {
  const { clearAll } = useTechHubFilter();
  const { setQuery } = useTechHubQuery();

  // View All = 페이지 이동 없이 전체 초기화(카테고리 선택 해제 + 검색어 해제). setQuery 가 내부에서 1페이지로도 리셋한다.
  const handleViewAll = () => {
    clearAll();
    setQuery("");
  };

  return (
    <SupportFilterEmpty content={techHubEmptyContent} onViewAll={handleViewAll} />
  );
}
