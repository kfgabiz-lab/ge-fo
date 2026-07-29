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
import {
  downloadDocTypeCodes,
  downloadDocumentTypes,
  productDownloadsDefaultDocTypes,
  type DownloadFilterOption,
} from "@/data/support/downloadCenterContent";
import { fetchDownloadCenterDocTypeCounts } from "@/data/support/downloadCenterData";

const DOC_TYPE_API_CODES = new Set<string>(downloadDocTypeCodes);
const DEFAULT_CHECKED_DOC_TYPES = new Set<string>(
  productDownloadsDefaultDocTypes,
);

// 실카운트가 도착하기 전에는 정적 샘플 건수(count: 100)를 노출하지 않는다.
// count 가 undefined 면 라벨에 "(n)" 자체가 렌더되지 않는다.
const DOC_TYPES_PENDING: DownloadFilterOption[] = downloadDocumentTypes.map(
  (option) =>
    DOC_TYPE_API_CODES.has(option.id) ? { ...option, count: undefined } : option,
);

function buildFilterId(optionId: string) {
  return `pd-doc-${optionId}`;
}

function buildInitialChecked(): Record<string, boolean> {
  const checked: Record<string, boolean> = {};

  for (const option of downloadDocumentTypes) {
    checked[buildFilterId(option.id)] =
      DEFAULT_CHECKED_DOC_TYPES.has(option.id) || Boolean(option.defaultChecked);
  }

  return checked;
}

type DevicesProductDownloadsFilterContextValue = {
  isChecked: (id: string) => boolean;
  toggleFilter: (id: string, checked: boolean) => void;
  clearSection: () => void;
  selectedDocTypes: string[];
  /** 문서 유형 목록 + 실제 검색결과 건수(도착 전에는 count undefined) */
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
}: {
  children: ReactNode;
  productCodes?: string[];
}) {
  const context = useContext(DevicesProductDownloadsFilterContext);

  if (context) {
    return children;
  }

  return (
    <DevicesProductDownloadsFilterProvider productCodes={productCodes}>
      {children}
    </DevicesProductDownloadsFilterProvider>
  );
}

export function DevicesProductDownloadsFilterProvider({
  children,
  productCodes = [],
}: {
  children: ReactNode;
  productCodes?: string[];
}) {
  const [checked, setChecked] = useState(buildInitialChecked);
  const [documentTypes, setDocumentTypes] =
    useState<DownloadFilterOption[]>(DOC_TYPES_PENDING);

  const productCodeKey = [...productCodes].sort().join(",");

  // 이 제품(productCodes)에 해당하는 문서 유형별 실제 건수를 조회해 필터 라벨에 반영한다.
  useEffect(() => {
    let alive = true;
    const codes = productCodeKey ? productCodeKey.split(",") : [];
    fetchDownloadCenterDocTypeCounts(codes).then((counts) => {
      if (!alive) return;
      const countMap = new Map(counts.map((c) => [c.docType, c.count]));
      setDocumentTypes(
        downloadDocumentTypes.map((option) =>
          DOC_TYPE_API_CODES.has(option.id)
            ? { ...option, count: countMap.get(option.id) ?? 0 }
            : option,
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
    setChecked((current) => {
      const next = { ...current };

      for (const option of downloadDocumentTypes) {
        next[buildFilterId(option.id)] = false;
      }

      return next;
    });
  }, []);

  const selectedDocTypes = useMemo(
    () =>
      downloadDocumentTypes
        .filter(
          (option) =>
            DOC_TYPE_API_CODES.has(option.id) && checked[buildFilterId(option.id)],
        )
        .map((option) => option.id),
    [checked],
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
