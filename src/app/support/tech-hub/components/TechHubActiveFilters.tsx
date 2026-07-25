"use client";

import { useTechHubFilter } from "./TechHubFilterProvider";

// 선택된 필터(LV1/LV2 카테고리) 태그 — Download Center 와 동일 마크업/CSS(support_download_active-filters) 재사용.
// 개별 X 로 해제, 전체 Reset. (검색어는 검색창의 clear 로 해제하므로 태그 대상 아님.)
export default function TechHubActiveFilters() {
  const { activeChips, toggleFilter, clearAll } = useTechHubFilter();

  if (activeChips.length === 0) {
    return null;
  }

  return (
    <div
      className="support_download_active-filters"
      role="region"
      aria-label="Active filters"
    >
      <ul className="support_download_active-filters__chips">
        {activeChips.map((chip) => (
          <li key={chip.id}>
            <button
              type="button"
              className="support_download_active-filters__chip"
              aria-label={`Remove ${chip.group} ${chip.value} filter`}
              onClick={() => toggleFilter(chip.id, false)}
            >
              <span className="support_download_active-filters__chip-text">
                {chip.group} : {chip.value}
              </span>
              <span
                className="support_download_active-filters__chip-icon"
                aria-hidden="true"
              >
                <img src="/ico/ico_clear_12.svg" alt="" width={12} height={12} />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="support_download_active-filters__clear"
        aria-label="Clear all filters"
        onClick={clearAll}
      >
        <span className="support_download_active-filters__clear-icon" aria-hidden>
          <img src="/ico/ico_clear_12.svg" alt="" width={12} height={12} />
        </span>
      </button>
    </div>
  );
}
