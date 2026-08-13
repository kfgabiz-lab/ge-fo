"use client";

import { useEffect, useRef } from "react";
import type {
  DownloadCategoryOption,
  DownloadFilterOption,
} from "@/data/support/downloadCenterContent";
import {
  fetchDownloadCenterCategoryTree,
  fetchDownloadDocTypeFilters,
  type DownloadCenterFilterParams,
} from "@/data/support/downloadCenterData";

type SupportDownloadFilterOptionsLoaderProps = {
  query?: string;
  onCategoriesChange: (options: DownloadCategoryOption[]) => void;
  onDocumentTypesChange: (options: DownloadFilterOption[]) => void;
  onCategoriesLoadedChange?: (loaded: boolean) => void;
};

export default function SupportDownloadFilterOptionsLoader({
  query = "",
  onCategoriesChange,
  onDocumentTypesChange,
  onCategoriesLoadedChange,
}: SupportDownloadFilterOptionsLoaderProps) {
  const q = query.trim();

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
    const params: DownloadCenterFilterParams = { q };
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
  }, [q]);

  useEffect(() => {
    const params: DownloadCenterFilterParams = { q };
    let alive = true;
    fetchDownloadDocTypeFilters(params).then((options) => {
      if (!alive) return;
      handlersRef.current.onDocumentTypesChange(options);
    });
    return () => {
      alive = false;
    };
  }, [q]);

  return null;
}
