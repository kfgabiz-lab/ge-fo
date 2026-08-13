"use client";

import { useEffect, useRef } from "react";
import type { SupportFilterContextValue } from "./createSupportFilterStore";
import type {
  DownloadCategoryOption,
  DownloadFilterOption,
} from "@/data/support/downloadCenterContent";
import {
  fetchDownloadCenterCategoryTree,
  fetchDownloadDocTypeFilters,
  type DownloadCenterFilterParams,
} from "@/data/support/downloadCenterData";

const CATEGORY_SECTION = "category";
const DOCUMENT_SECTION = "document";

type SupportDownloadFilterOptionsLoaderProps = {
  useFilter: () => SupportFilterContextValue;
  query?: string;
  onCategoriesChange: (options: DownloadCategoryOption[]) => void;
  onDocumentTypesChange: (options: DownloadFilterOption[]) => void;
  onCategoriesLoadedChange?: (loaded: boolean) => void;
};

function toKey(values: string[]): string {
  return [...values].sort().join(",");
}

function toList(key: string): string[] {
  return key ? key.split(",") : [];
}

export default function SupportDownloadFilterOptionsLoader({
  useFilter,
  query = "",
  onCategoriesChange,
  onDocumentTypesChange,
  onCategoriesLoadedChange,
}: SupportDownloadFilterOptionsLoaderProps) {
  const { getSelectedCategoryValues, getSelectedCategoryParentValues } =
    useFilter();

  const q = query.trim();
  const categoryKey = toKey(getSelectedCategoryValues(CATEGORY_SECTION));
  const parentCategoryKey = toKey(
    getSelectedCategoryParentValues(CATEGORY_SECTION),
  );
  const docTypeKey = toKey(getSelectedCategoryValues(DOCUMENT_SECTION));

  const handlersRef = useRef({
    onCategoriesChange,
    onDocumentTypesChange,
    onCategoriesLoadedChange,
  });

  useEffect(() => {
    handlersRef.current = {
      onCategoriesChange,
      onDocumentTypesChange,
      onCategoriesLoadedChange,
    };
  });

  useEffect(() => {
    const params: DownloadCenterFilterParams = {
      q,
      categories: toList(categoryKey),
      parentCategories: toList(parentCategoryKey),
      docTypes: toList(docTypeKey),
    };
    let alive = true;
    fetchDownloadCenterCategoryTree(params)
      .then((tree) => {
        if (!alive) return;
        handlersRef.current.onCategoriesChange(tree);
      })
      .finally(() => {
        if (!alive) return;
        handlersRef.current.onCategoriesLoadedChange?.(true);
      });
    return () => {
      alive = false;
    };
  }, [q, categoryKey, parentCategoryKey, docTypeKey]);

  useEffect(() => {
    const params: DownloadCenterFilterParams = {
      q,
      categories: toList(categoryKey),
      parentCategories: toList(parentCategoryKey),
      docTypes: toList(docTypeKey),
    };
    let alive = true;
    fetchDownloadDocTypeFilters(params).then((options) => {
      if (!alive) return;
      handlersRef.current.onDocumentTypesChange(options);
    });
    return () => {
      alive = false;
    };
  }, [q, categoryKey, parentCategoryKey, docTypeKey]);

  return null;
}
