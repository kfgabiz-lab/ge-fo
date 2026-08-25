"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DownloadFilterOption } from "@/data/support/downloadCenterContent";
import { fetchDownloadDocTypeFilters } from "@/data/support/downloadCenterData";

function buildFilterId(optionId: string) {
  return `pd-doc-${optionId}`;
}

function buildCheckedState(
  options: DownloadFilterOption[],
  resolve: (optionId: string) => boolean,
): Record<string, boolean> {
  const checked: Record<string, boolean> = {};

  for (const option of options) {
    checked[buildFilterId(option.id)] = resolve(option.id);
  }

  return checked;
}

type DevicesProductDownloadsFilterContextValue = {
  isChecked: (id: string) => boolean;
  toggleFilter: (id: string, checked: boolean) => void;
  clearSection: () => void;
  selectedDocTypes: string[];
  documentTypes: DownloadFilterOption[];
};

const DevicesProductDownloadsFilterContext =
  createContext<DevicesProductDownloadsFilterContextValue | null>(null);

export function useDevicesProductDownloadsFilter() {
  const context = useContext(DevicesProductDownloadsFilterContext);

  if (!context) {
    throw new Error(
      "useDevicesProductDownloadsFilter must be used within DevicesProductDownloadsFilterProvider",
    );
  }

  return context;
}

export function DevicesProductDownloadsFilterBoundary({
  children,
  productCodes = [],
  docTypeOptions = [],
  appliedKeyword = "",
}: {
  children: ReactNode;
  productCodes?: string[];
  docTypeOptions?: DownloadFilterOption[];
  appliedKeyword?: string;
}) {
  const context = useContext(DevicesProductDownloadsFilterContext);

  if (context) {
    return children;
  }

  return (
    <DevicesProductDownloadsFilterProvider
      productCodes={productCodes}
      docTypeOptions={docTypeOptions}
      appliedKeyword={appliedKeyword}
    >
      {children}
    </DevicesProductDownloadsFilterProvider>
  );
}

export function DevicesProductDownloadsFilterProvider({
  children,
  productCodes = [],
  docTypeOptions = [],
  appliedKeyword = "",
}: {
  children: ReactNode;
  productCodes?: string[];
  docTypeOptions?: DownloadFilterOption[];
  appliedKeyword?: string;
}) {
  const [documentTypes, setDocumentTypes] =
    useState<DownloadFilterOption[]>(docTypeOptions);
  const [checked, setChecked] = useState(() =>
    buildCheckedState(docTypeOptions, () => false),
  );

  const productCodeKey = [...productCodes].sort().join(",");

  useEffect(() => {
    let alive = true;
    const codes = productCodeKey ? productCodeKey.split(",") : [];
    fetchDownloadDocTypeFilters({
      productCodes: codes,
      q: appliedKeyword,
      fallbackCount: 0,
    }).then((options) => {
      if (!alive) return;
      setDocumentTypes(options);
      setChecked((current) =>
        buildCheckedState(
          options,
          (optionId) => current[buildFilterId(optionId)] ?? false,
        ),
      );
    });
    return () => {
      alive = false;
    };
  }, [productCodeKey, appliedKeyword]);

  const isChecked = useCallback((id: string) => Boolean(checked[id]), [checked]);

  const toggleFilter = useCallback((id: string, nextChecked: boolean) => {
    setChecked((current) => ({ ...current, [id]: nextChecked }));
  }, []);

  const clearSection = useCallback(() => {
    setChecked((current) => ({
      ...current,
      ...buildCheckedState(documentTypes, () => false),
    }));
  }, [documentTypes]);

  const selectedDocTypes = useMemo(
    () =>
      documentTypes
        .filter((option) => checked[buildFilterId(option.id)])
        .map((option) => option.id),
    [checked, documentTypes],
  );

  const value = useMemo(
    () => ({
      isChecked,
      toggleFilter,
      clearSection,
      selectedDocTypes,
      documentTypes,
    }),
    [clearSection, documentTypes, isChecked, selectedDocTypes, toggleFilter],
  );

  return (
    <DevicesProductDownloadsFilterContext.Provider value={value}>
      {children}
    </DevicesProductDownloadsFilterContext.Provider>
  );
}

export function getDevicesProductDownloadsFilterId(optionId: string) {
  return buildFilterId(optionId);
}
