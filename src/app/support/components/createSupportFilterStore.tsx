"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
 *
 * ⚠️ 2026-07-25 동적 카테고리 지원 확장:
 * - 기존: config.categories(정적) 로 모듈 로드 시 레지스트리/맵을 굳혔다(Download Center 방식).
 * - 확장: Provider 가 categories prop 을 받으면 그 값을 우선 사용(Tech Hub 는 category-data fetch 결과를 주입).
 *   레지스트리/맵/초기상태 계산을 Provider 내부 useMemo 로 옮겨, 동적 카테고리가 나중에 도착해도 재구성한다.
 * - 하위호환: Download Center 는 categories prop 없이 그대로 사용 → config.categories(정적) 로 동작(동작 불변).
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
  /**
   * 특정 섹션에서 체크된 "리프" 카테고리 옵션 id(코드) 목록.
   * 동적 카테고리(예: Tech Hub LV2 코드)로 API 필터할 때 사용한다.
   * (부모 카테고리 선택 시 자식 리프 코드들이 모두 포함된다. Download Center 는 미사용.)
   */
  getSelectedCategoryValues: (section: string) => string[];
};

export type SupportFilterStoreConfig = {
  /** 컨텍스트 디버깅용 이름 */
  displayName: string;
  /** 카테고리(중첩 지원) 섹션 */
  categoryIdPrefix: string;
  categoryGroup: string;
  categorySection: string;
  /** 정적 기본 카테고리(하위호환). Provider 의 categories prop 이 있으면 그 값이 우선. */
  categories: DownloadCategoryOption[];
  /** 두 번째 평면 섹션(문서유형 / 인증 등) */
  secondaryIdPrefix: string;
  secondaryGroup: string;
  secondarySection: string;
  secondaryOptions: DownloadFilterOption[];
};

type FilterMeta = {
  id: string;
  /** prefix 를 뗀 원본 옵션 id(카테고리 코드 등) */
  optionId: string;
  label: string;
  group: string;
  section: string;
  /** 리프 여부 — 자식이 없는 카테고리/2차옵션은 true, 자식을 가진 부모 카테고리는 false */
  isLeaf: boolean;
};

type CategoryMaps = {
  childrenMap: Map<string, string[]>;
  parentMap: Map<string, string>;
};

export type SupportFilterStore = {
  Provider: (props: {
    children: ReactNode;
    /** 동적 카테고리(있으면 config.categories 대신 사용) */
    categories?: DownloadCategoryOption[];
  }) => React.ReactElement;
  Boundary: (props: { children: ReactNode }) => ReactNode;
  useFilter: () => SupportFilterContextValue;
};

// ---------------- 순수 빌더(categories 를 인자로 받아 Provider 내부에서 memo) ----------------

function buildFilterRegistry(
  categories: DownloadCategoryOption[],
  config: SupportFilterStoreConfig,
): FilterMeta[] {
  const {
    categoryIdPrefix,
    categoryGroup,
    categorySection,
    secondaryIdPrefix,
    secondaryGroup,
    secondarySection,
    secondaryOptions,
  } = config;
  const registry: FilterMeta[] = [];

  for (const option of categories) {
    const hasNested = (option.nested ?? []).length > 0;
    registry.push({
      id: `${categoryIdPrefix}-${option.id}`,
      optionId: option.id,
      label: option.label,
      group: categoryGroup,
      section: categorySection,
      isLeaf: !hasNested,
    });

    for (const nested of option.nested ?? []) {
      registry.push({
        id: `${categoryIdPrefix}-${nested.id}`,
        optionId: nested.id,
        label: nested.label,
        group: categoryGroup,
        section: categorySection,
        isLeaf: true,
      });
    }
  }

  for (const option of secondaryOptions) {
    registry.push({
      id: `${secondaryIdPrefix}-${option.id}`,
      optionId: option.id,
      label: option.label,
      group: secondaryGroup,
      section: secondarySection,
      isLeaf: true,
    });
  }

  return registry;
}

function buildCategoryMaps(
  categories: DownloadCategoryOption[],
  config: SupportFilterStoreConfig,
): CategoryMaps {
  const { categoryIdPrefix } = config;
  const childrenMap = new Map<string, string[]>();
  const parentMap = new Map<string, string>();

  for (const option of categories) {
    const parentId = `${categoryIdPrefix}-${option.id}`;
    const childIds = (option.nested ?? []).map(
      (nested) => `${categoryIdPrefix}-${nested.id}`,
    );

    if (childIds.length === 0) continue;

    childrenMap.set(parentId, childIds);
    for (const childId of childIds) parentMap.set(childId, parentId);
  }

  return { childrenMap, parentMap };
}

function syncCategoryParentState(
  next: Record<string, boolean>,
  parentId: string,
  childrenMap: Map<string, string[]>,
) {
  const childIds = childrenMap.get(parentId);
  if (!childIds?.length) return;
  next[parentId] = childIds.every((childId) => next[childId]);
}

function buildInitialChecked(
  categories: DownloadCategoryOption[],
  config: SupportFilterStoreConfig,
  registry: FilterMeta[],
  childrenMap: Map<string, string[]>,
): Record<string, boolean> {
  const { categoryIdPrefix, secondaryIdPrefix, secondaryOptions } = config;
  const checked: Record<string, boolean> = {};

  for (const meta of registry) checked[meta.id] = false;

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

    syncCategoryParentState(checked, parentId, childrenMap);
  }

  for (const option of secondaryOptions) {
    if (option.defaultChecked) {
      checked[`${secondaryIdPrefix}-${option.id}`] = true;
    }
  }

  return checked;
}

export function createSupportFilterStore(
  config: SupportFilterStoreConfig,
): SupportFilterStore {
  const { displayName } = config;

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

  function Provider({
    children,
    categories: propCategories,
  }: {
    children: ReactNode;
    categories?: DownloadCategoryOption[];
  }) {
    // 동적 카테고리 우선(Tech Hub), 없으면 정적 config.categories(Download Center 하위호환)
    const categories = propCategories ?? config.categories;

    const registry = useMemo(
      () => buildFilterRegistry(categories, config),
      [categories],
    );
    const { childrenMap, parentMap } = useMemo(
      () => buildCategoryMaps(categories, config),
      [categories],
    );

    const [checked, setChecked] = useState<Record<string, boolean>>(() =>
      buildInitialChecked(categories, config, registry, childrenMap),
    );

    // 동적 카테고리가 나중에 도착/변경되면 checked 를 재구성한다.
    // (기존 체크값은 살아남는 id 에 한해 보존, 없어진 id 제거, 새 id 추가)
    const signature = useMemo(
      () => registry.map((m) => m.id).join("|"),
      [registry],
    );
    const prevSignature = useRef(signature);
    useEffect(() => {
      if (prevSignature.current === signature) return;
      prevSignature.current = signature;
      setChecked((current) => {
        const base = buildInitialChecked(categories, config, registry, childrenMap);
        for (const id of Object.keys(base)) {
          if (current[id] !== undefined) base[id] = current[id];
        }
        return base;
      });
    }, [signature, categories, registry, childrenMap]);

    const isChecked = useCallback(
      (id: string) => Boolean(checked[id]),
      [checked],
    );

    const toggleFilter = useCallback(
      (id: string, nextChecked: boolean) => {
        setChecked((current) => {
          const next = { ...current, [id]: nextChecked };
          const childIds = childrenMap.get(id);
          if (childIds) {
            for (const childId of childIds) next[childId] = nextChecked;
          }
          const parentId = parentMap.get(id);
          if (parentId) syncCategoryParentState(next, parentId, childrenMap);
          return next;
        });
      },
      [childrenMap, parentMap],
    );

    const clearSection = useCallback(
      (section: string) => {
        setChecked((current) => {
          const next = { ...current };
          for (const meta of registry) {
            if (meta.section === section) next[meta.id] = false;
          }
          return next;
        });
      },
      [registry],
    );

    const clearAll = useCallback(() => {
      setChecked((current) => {
        const next = { ...current };
        for (const id of Object.keys(next)) next[id] = false;
        return next;
      });
    }, []);

    const activeChips = useMemo(
      () =>
        registry
          .filter((meta) => {
            if (!checked[meta.id]) return false;
            const parentId = parentMap.get(meta.id);
            if (parentId && checked[parentId]) return false; // 부모 선택 시 자식 칩 숨김
            return true;
          })
          .map((meta) => ({ id: meta.id, group: meta.group, value: meta.label })),
      [checked, registry, parentMap],
    );

    const getSelectedCategoryValues = useCallback(
      (section: string) =>
        registry
          .filter(
            (meta) => meta.section === section && meta.isLeaf && checked[meta.id],
          )
          .map((meta) => meta.optionId),
      [registry, checked],
    );

    const value = useMemo(
      () => ({
        isChecked,
        toggleFilter,
        clearSection,
        clearAll,
        activeChips,
        getSelectedCategoryValues,
      }),
      [
        activeChips,
        clearAll,
        clearSection,
        getSelectedCategoryValues,
        isChecked,
        toggleFilter,
      ],
    );

    return (
      <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
    );
  }

  function Boundary({ children }: { children: ReactNode }) {
    const context = useContext(FilterContext);
    if (context) return children;
    return <Provider>{children}</Provider>;
  }

  return { Provider, Boundary, useFilter };
}
