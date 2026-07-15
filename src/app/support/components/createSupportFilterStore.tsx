"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  DownloadCategoryOption,
  DownloadFilterOption,
} from "@/data/support/downloadCenterContent";

/**
 * Download Center / Tech Hub 필터 상태 공통 스토어 팩토리.
 * 두 페이지의 체크박스 필터 로직(카테고리 중첩 + 평면 2차 섹션)이 완전히 동일하여,
 * 데이터·prefix·라벨만 config로 주입받아 Provider/Boundary/useFilter 훅을 생성한다.
 * 마크업이 없는 순수 상태 로직만 공통화한 것이며, UI/데이터 구조가 다르면 이 팩토리를 쓰지 않는다.
 */

/** 활성 필터 칩 (그룹/값은 페이지별 라벨이므로 문자열로 일반화) */
export type SupportFilterActiveChip = {
  id: string;
  group: string;
  value: string;
};

export type SupportFilterContextValue = {
  isChecked: (id: string) => boolean;
  toggleFilter: (id: string, checked: boolean) => void;
  clearSection: (section: string) => void;
  clearAll: () => void;
  activeChips: SupportFilterActiveChip[];
};

export type SupportFilterStoreConfig = {
  /** 컨텍스트 디버깅용 이름 */
  displayName: string;
  /** 카테고리(중첩 지원) 섹션 */
  categoryIdPrefix: string;
  categoryGroup: string;
  categorySection: string;
  categories: DownloadCategoryOption[];
  /** 두 번째 평면 섹션(문서유형 / 인증 등) */
  secondaryIdPrefix: string;
  secondaryGroup: string;
  secondarySection: string;
  secondaryOptions: DownloadFilterOption[];
};

type FilterMeta = {
  id: string;
  label: string;
  group: string;
  section: string;
};

export type SupportFilterStore = {
  Provider: (props: { children: ReactNode }) => React.ReactElement;
  Boundary: (props: { children: ReactNode }) => ReactNode;
  useFilter: () => SupportFilterContextValue;
};

export function createSupportFilterStore(
  config: SupportFilterStoreConfig,
): SupportFilterStore {
  const {
    displayName,
    categoryIdPrefix,
    categoryGroup,
    categorySection,
    categories,
    secondaryIdPrefix,
    secondaryGroup,
    secondarySection,
    secondaryOptions,
  } = config;

  // 필터 레지스트리 구성 (모듈 로드 시 1회)
  const filterRegistry: FilterMeta[] = [];

  for (const option of categories) {
    filterRegistry.push({
      id: `${categoryIdPrefix}-${option.id}`,
      label: option.label,
      group: categoryGroup,
      section: categorySection,
    });

    for (const nested of option.nested ?? []) {
      filterRegistry.push({
        id: `${categoryIdPrefix}-${nested.id}`,
        label: nested.label,
        group: categoryGroup,
        section: categorySection,
      });
    }
  }

  for (const option of secondaryOptions) {
    filterRegistry.push({
      id: `${secondaryIdPrefix}-${option.id}`,
      label: option.label,
      group: secondaryGroup,
      section: secondarySection,
    });
  }

  // 카테고리 부모-자식 매핑
  const categoryChildrenMap = new Map<string, string[]>();
  const categoryParentMap = new Map<string, string>();

  for (const option of categories) {
    const parentId = `${categoryIdPrefix}-${option.id}`;
    const childIds = (option.nested ?? []).map(
      (nested) => `${categoryIdPrefix}-${nested.id}`,
    );

    if (childIds.length === 0) {
      continue;
    }

    categoryChildrenMap.set(parentId, childIds);

    for (const childId of childIds) {
      categoryParentMap.set(childId, parentId);
    }
  }

  function syncCategoryParentState(
    next: Record<string, boolean>,
    parentId: string,
  ) {
    const childIds = categoryChildrenMap.get(parentId);

    if (!childIds?.length) {
      return;
    }

    next[parentId] = childIds.every((childId) => next[childId]);
  }

  function buildInitialChecked(): Record<string, boolean> {
    const checked: Record<string, boolean> = {};

    for (const meta of filterRegistry) {
      checked[meta.id] = false;
    }

    for (const option of categories) {
      const parentId = `${categoryIdPrefix}-${option.id}`;

      if (option.defaultChecked) {
        checked[parentId] = true;

        for (const nested of option.nested ?? []) {
          checked[`${categoryIdPrefix}-${nested.id}`] = true;
        }

        continue;
      }

      for (const nested of option.nested ?? []) {
        if (nested.defaultChecked) {
          checked[`${categoryIdPrefix}-${nested.id}`] = true;
        }
      }

      syncCategoryParentState(checked, parentId);
    }

    for (const option of secondaryOptions) {
      if (option.defaultChecked) {
        checked[`${secondaryIdPrefix}-${option.id}`] = true;
      }
    }

    return checked;
  }

  const FilterContext = createContext<SupportFilterContextValue | null>(null);
  FilterContext.displayName = `${displayName}FilterContext`;

  function useFilter(): SupportFilterContextValue {
    const context = useContext(FilterContext);

    if (!context) {
      throw new Error(
        `use${displayName}Filter must be used within ${displayName}FilterProvider`,
      );
    }

    return context;
  }

  function Provider({ children }: { children: ReactNode }) {
    const [checked, setChecked] = useState(buildInitialChecked);

    const isChecked = useCallback(
      (id: string) => Boolean(checked[id]),
      [checked],
    );

    const toggleFilter = useCallback((id: string, nextChecked: boolean) => {
      setChecked((current) => {
        const next = { ...current, [id]: nextChecked };
        const childIds = categoryChildrenMap.get(id);

        if (childIds) {
          for (const childId of childIds) {
            next[childId] = nextChecked;
          }
        }

        const parentId = categoryParentMap.get(id);

        if (parentId) {
          syncCategoryParentState(next, parentId);
        }

        return next;
      });
    }, []);

    const clearSection = useCallback((section: string) => {
      setChecked((current) => {
        const next = { ...current };

        for (const meta of filterRegistry) {
          if (meta.section === section) {
            next[meta.id] = false;
          }
        }

        return next;
      });
    }, []);

    const clearAll = useCallback(() => {
      setChecked((current) => {
        const next = { ...current };

        for (const id of Object.keys(next)) {
          next[id] = false;
        }

        return next;
      });
    }, []);

    const activeChips = useMemo(
      () =>
        filterRegistry
          .filter((meta) => {
            if (!checked[meta.id]) {
              return false;
            }

            const parentId = categoryParentMap.get(meta.id);

            if (parentId && checked[parentId]) {
              return false;
            }

            return true;
          })
          .map((meta) => ({
            id: meta.id,
            group: meta.group,
            value: meta.label,
          })),
      [checked],
    );

    const value = useMemo(
      () => ({
        isChecked,
        toggleFilter,
        clearSection,
        clearAll,
        activeChips,
      }),
      [activeChips, clearAll, clearSection, isChecked, toggleFilter],
    );

    return (
      <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
    );
  }

  function Boundary({ children }: { children: ReactNode }) {
    const context = useContext(FilterContext);

    if (context) {
      return children;
    }

    return <Provider>{children}</Provider>;
  }

  return { Provider, Boundary, useFilter };
}
