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
}: {
  children: ReactNode;
  productCodes?: string[];
  docTypeOptions?: DownloadFilterOption[];
}) {
  const context = useContext(DevicesProductDownloadsFilterContext);

  if (context) {
    return children;
  }

  return (
    <DevicesProductDownloadsFilterProvider
      productCodes={productCodes}
      docTypeOptions={docTypeOptions}
    >
      {children}
    </DevicesProductDownloadsFilterProvider>
  );
}

export function DevicesProductDownloadsFilterProvider({
  children,
  productCodes = [],
  docTypeOptions = [],
}: {
  children: ReactNode;
  productCodes?: string[];
  docTypeOptions?: DownloadFilterOption[];
}) {
  const [documentTypes, setDocumentTypes] =
    useState<DownloadFilterOption[]>(docTypeOptions);
  const [checked, setChecked] = useState(() =>
    buildCheckedState(docTypeOptions, () => false),
  );

  const productCodeKey = [...productCodes].sort().join(",");

  /* LV3(제품 상세) 페이지 진입 자체가 1차검색이므로 Document type 개수는 productCodes 기준으로 고정된다 —
     Downloads 영역 내 키워드 검색은 결과 목록/Total에만 반영하고, 이 개수는 절대 재계산하지 않는다 */
  useEffect(() => {
    let alive = true;
    const codes = productCodeKey ? productCodeKey.split(",") : [];
    fetchDownloadDocTypeFilters({
      productCodes: codes,
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
  }, [productCodeKey]);

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
