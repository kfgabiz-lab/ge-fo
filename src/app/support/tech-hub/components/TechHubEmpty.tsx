"use client";

import SupportFilterEmpty from "@/app/support/components/SupportFilterEmpty";
import { techHubEmptyContent } from "@/data/support/techHubContent";
import { useTechHubFilter, useTechHubQuery } from "./TechHubFilterProvider";

export default function TechHubEmpty() {
  const { clearAll } = useTechHubFilter();
  const { setQuery, notifyReset } = useTechHubQuery();

  const handleViewAll = () => {
    clearAll();
    setQuery("");
    notifyReset();
  };

  return (
    <SupportFilterEmpty content={techHubEmptyContent} onViewAll={handleViewAll} />
  );
}
