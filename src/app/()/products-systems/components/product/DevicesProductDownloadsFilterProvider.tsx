"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { downloadDocumentTypes } from "@/data/support/downloadCenterContent";

function buildFilterId(optionId: string) {
  return `pd-doc-${optionId}`;
}

function buildInitialChecked(): Record<string, boolean> {
  const checked: Record<string, boolean> = {};

  for (const option of downloadDocumentTypes) {
    checked[buildFilterId(option.id)] = Boolean(option.defaultChecked);
  }

  return checked;
}

type DevicesProductDownloadsFilterContextValue = {
  isChecked: (id: string) => boolean;
  toggleFilter: (id: string, checked: boolean) => void;
  clearSection: () => void;
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

  const value = useMemo(
    () => ({
      isChecked,
      toggleFilter,
      clearSection,
    }),
    [clearSection, isChecked, toggleFilter],
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
