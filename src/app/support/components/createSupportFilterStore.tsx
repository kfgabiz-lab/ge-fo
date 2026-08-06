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
  getSelectedCategoryParentValues: (section: string) => string[];
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
  isCategoryParent: boolean;
};

type CategoryMaps = {
  childrenMap: Map<string, string[]>;
  descendantsMap: Map<string, string[]>;
  parentMap: Map<string, string>;
};

export type SupportFilterStore = {
  Provider: (props: {
    children: ReactNode;
    categories?: DownloadCategoryOption[];
    secondaryOptions?: DownloadFilterOption[];
  }) => React.ReactElement;
  Boundary: (props: { children: ReactNode }) => ReactNode;
  useFilter: () => SupportFilterContextValue;
};

function walkCategories(
  options: DownloadCategoryOption[],
  visit: (option: DownloadCategoryOption, parent?: DownloadCategoryOption) => void,
  parent?: DownloadCategoryOption,
) {
  for (const option of options) {
    visit(option, parent);

    if (option.nested?.length) {
      walkCategories(option.nested, visit, option);
    }
  }
}

function collectDescendantIds(
  option: DownloadCategoryOption,
  categoryIdPrefix: string,
): string[] {
  const ids: string[] = [];

  for (const nested of option.nested ?? []) {
    ids.push(`${categoryIdPrefix}-${nested.id}`);
    ids.push(...collectDescendantIds(nested, categoryIdPrefix));
  }

  return ids;
}

function buildFilterRegistry(
  categories: DownloadCategoryOption[],
  config: SupportFilterStoreConfig,
  secondaryOptions: DownloadFilterOption[],
): FilterMeta[] {
  const {
    categoryIdPrefix,
    categoryGroup,
    categorySection,
    secondaryIdPrefix,
    secondaryGroup,
    secondarySection,
  } = config;
  const registry: FilterMeta[] = [];

  walkCategories(categories, (option, parent) => {
    const hasNested = (option.nested ?? []).length > 0;
    registry.push({
      id: `${categoryIdPrefix}-${option.id}`,
      optionId: option.id,
      label: option.label,
      group: categoryGroup,
      section: categorySection,
      isLeaf: !hasNested,
      isCategoryParent: !parent,
    });
  });

  for (const option of secondaryOptions) {
    registry.push({
      id: `${secondaryIdPrefix}-${option.id}`,
      optionId: option.id,
      label: option.label,
      group: secondaryGroup,
      section: secondarySection,
      isLeaf: true,
      isCategoryParent: false,
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
  const descendantsMap = new Map<string, string[]>();
  const parentMap = new Map<string, string>();

  walkCategories(categories, (option, parent) => {
    const id = `${categoryIdPrefix}-${option.id}`;
    const childIds = (option.nested ?? []).map(
      (nested) => `${categoryIdPrefix}-${nested.id}`,
    );

    if (childIds.length) {
      childrenMap.set(id, childIds);
      descendantsMap.set(id, collectDescendantIds(option, categoryIdPrefix));
    }

    if (parent) {
      parentMap.set(id, `${categoryIdPrefix}-${parent.id}`);
    }
  });

  return { childrenMap, descendantsMap, parentMap };
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

function syncCategoryAncestors(
  next: Record<string, boolean>,
  startParentId: string | undefined,
  childrenMap: Map<string, string[]>,
  parentMap: Map<string, string>,
) {
  let parentId = startParentId;

  while (parentId) {
    syncCategoryParentState(next, parentId, childrenMap);
    parentId = parentMap.get(parentId);
  }
}

function applyDefaultChecked(
  next: Record<string, boolean>,
  option: DownloadCategoryOption,
  categoryIdPrefix: string,
  childrenMap: Map<string, string[]>,
  descendantsMap: Map<string, string[]>,
) {
  const id = `${categoryIdPrefix}-${option.id}`;

  if (option.defaultChecked) {
    next[id] = true;

    for (const descendantId of descendantsMap.get(id) ?? []) {
      next[descendantId] = true;
    }

    return;
  }

  for (const nested of option.nested ?? []) {
    applyDefaultChecked(
      next,
      nested,
      categoryIdPrefix,
      childrenMap,
      descendantsMap,
    );
  }

  syncCategoryParentState(next, id, childrenMap);
}

function buildInitialChecked(
  categories: DownloadCategoryOption[],
  config: SupportFilterStoreConfig,
  registry: FilterMeta[],
  childrenMap: Map<string, string[]>,
  descendantsMap: Map<string, string[]>,
  parentMap: Map<string, string>,
  secondaryOptions: DownloadFilterOption[],
): Record<string, boolean> {
  const { categoryIdPrefix, secondaryIdPrefix } = config;
  const checked: Record<string, boolean> = {};

  for (const meta of registry) checked[meta.id] = false;

  for (const option of categories) {
    applyDefaultChecked(
      checked,
      option,
      categoryIdPrefix,
      childrenMap,
      descendantsMap,
    );
    syncCategoryAncestors(
      checked,
      `${categoryIdPrefix}-${option.id}`,
      childrenMap,
      parentMap,
    );
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
    walkCategories(categories, (option) => {
      syncCategoryAncestors(
        checked,
        `${config.categoryIdPrefix}-${option.id}`,
        childrenMap,
        parentMap,
      );
    });
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
    secondaryOptions: propSecondaryOptions,
  }: {
    children: ReactNode;
    categories?: DownloadCategoryOption[];
    secondaryOptions?: DownloadFilterOption[];
  }) {
    const categories = propCategories ?? config.categories;
    const secondaryOptions = propSecondaryOptions ?? config.secondaryOptions;

    const registry = useMemo(
      () => buildFilterRegistry(categories, config, secondaryOptions),
      [categories, secondaryOptions],
    );
    const { childrenMap, descendantsMap, parentMap } = useMemo(
      () => buildCategoryMaps(categories, config),
      [categories],
    );

    const [checked, setChecked] = useState<Record<string, boolean>>(() =>
      buildInitialChecked(
        categories,
        config,
        registry,
        childrenMap,
        descendantsMap,
        parentMap,
        secondaryOptions,
      ),
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
        const base = buildInitialChecked(
          categories,
          config,
          registry,
          childrenMap,
          descendantsMap,
          parentMap,
          secondaryOptions,
        );
        for (const id of Object.keys(base)) {
          if (current[id] !== undefined) base[id] = current[id];
        }
        return base;
      });
    }, [
      signature,
      categories,
      registry,
      childrenMap,
      descendantsMap,
      parentMap,
      secondaryOptions,
    ]);

    const isChecked = useCallback(
      (id: string) => Boolean(checked[id]),
      [checked],
    );

    const toggleFilter = useCallback(
      (id: string, nextChecked: boolean) => {
        setChecked((current) => {
          const next = { ...current, [id]: nextChecked };
          const descendantIds = descendantsMap.get(id);
          if (descendantIds) {
            for (const descendantId of descendantIds) {
              next[descendantId] = nextChecked;
            }
          }
          syncCategoryAncestors(
            next,
            parentMap.get(id),
            childrenMap,
            parentMap,
          );
          return next;
        });
      },
      [childrenMap, descendantsMap, parentMap],
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

    const getSelectedCategoryParentValues = useCallback(
      (section: string) =>
        registry
          .filter(
            (meta) =>
              meta.section === section && meta.isCategoryParent && checked[meta.id],
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
        getSelectedCategoryParentValues,
      }),
      [
        activeChips,
        clearAll,
        clearSection,
        getSelectedCategoryValues,
        getSelectedCategoryParentValues,
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
