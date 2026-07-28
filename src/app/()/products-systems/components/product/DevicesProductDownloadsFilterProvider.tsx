"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  downloadDocTypeCodes,
  downloadDocumentTypes,
  productDownloadsDefaultDocTypes,
} from "@/data/support/downloadCenterContent";

// contents API docTypes 로 내보낼 수 있는 코드(BE 대응 없는 옵션은 제외).
const DOC_TYPE_API_CODES = new Set<string>(downloadDocTypeCodes);
// 제품상세 Downloads 필터 초기 체크(기획서: Catalog, Manual). 공유 데이터가 아닌 화면 전용 상수를 쓴다.
const DEFAULT_CHECKED_DOC_TYPES = new Set<string>(
  productDownloadsDefaultDocTypes,
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
  /** 체크된 문서유형 중 BE 대응 코드만 — contents API 의 docTypes 파라미터로 그대로 전달한다. */
  selectedDocTypes: string[];
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
}: {
  children: ReactNode;
}) {
  const context = useContext(DevicesProductDownloadsFilterContext);

  if (context) {
    return children;
  }

  return (
    <DevicesProductDownloadsFilterProvider>{children}</DevicesProductDownloadsFilterProvider>
  );
}

export function DevicesProductDownloadsFilterProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [checked, setChecked] = useState(buildInitialChecked);

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

  // 체크 상태 → 조회 파라미터로 나갈 코드 목록. 옵션 정의 순서를 유지한다.
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
    }),
    [clearSection, isChecked, selectedDocTypes, toggleFilter],
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
