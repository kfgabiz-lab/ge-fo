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
  getSelectedCategoryValues: (section: string) => string[];
};

export type SupportFilterStoreConfig = {
  displayName: string;
  categoryIdPrefix: string;
  categoryGroup: string;
  categorySection: string;
  categories: DownloadCategoryOption[];
  secondaryIdPrefix: string;
  secondaryGroup: string;
  secondarySection: string;
  secondaryOptions: DownloadFilterOption[];
  extraDefaultCheckedIds?: string[];
};

type FilterMeta = {
  id: string;
  optionId: string;
  label: string;
  group: string;
  section: string;
  isLeaf: boolean;
};

type CategoryMaps = {
  childrenMap: Map<string, string[]>;
  parentMap: Map<string, string>;
};

export type SupportFilterStore = {
  Provider: (props: {
    children: ReactNode;
    categories?: DownloadCategoryOption[];
  }) => React.ReactElement;
  Boundary: (props: { children: ReactNode }) => ReactNode;
  useFilter: () => SupportFilterContextValue;
};

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

  if (config.extraDefaultCheckedIds?.length) {
    for (const id of config.extraDefaultCheckedIds) {
      checked[id] = true;
    }
    for (const option of categories) {
      syncCategoryParentState(
        checked,
        `${config.categoryIdPrefix}-${option.id}`,
        childrenMap,
      );
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
            if (parentId && checked[parentId]) return false;
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
