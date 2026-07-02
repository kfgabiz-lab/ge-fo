import type { ProductDownloadItem } from "@/app/()/products-systems/data/productDetailContent";
import { searchAllDocuments } from "@/data/search/searchAllContent";
import {
  searchProductActiveFilterDefaults,
  searchProductCategories,
  searchProductDocumentTypes,
  searchProductsPage,
} from "@/data/search/searchProductsContent";

/** Figma 4701:85037 — Search Documents tab + filter */
export const searchDocumentsPage = searchProductsPage;

export const searchDocumentActiveFilterDefaults = searchProductActiveFilterDefaults;

export const searchDocumentCategories = searchProductCategories;

export const searchDocumentTypes = searchProductDocumentTypes;

const documentPool: ProductDownloadItem[] = [...searchAllDocuments];

export function getSearchDocumentPageItems(
  page: number,
  pageSize: number,
): ProductDownloadItem[] {
  const start = (page - 1) * pageSize;
  const items: ProductDownloadItem[] = [];

  for (let i = 0; i < pageSize; i++) {
    const globalIndex = start + i;
    const source = documentPool[globalIndex % documentPool.length];
    items.push({
      ...source,
      id: `${source.id}-${globalIndex}`,
    });
  }

  return items;
}
