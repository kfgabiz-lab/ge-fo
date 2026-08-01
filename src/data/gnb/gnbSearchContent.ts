import { buildSearchAllHref } from "@/data/search/searchAllContent";
import { downloadCenterPage } from "@/data/support/downloadCenterContent";

export type GnbSearchTag = {
  label: string;
  href: string;
};

function toTags(labels: readonly string[]): GnbSearchTag[] {
  return labels.map((label) => ({
    label,
    href: buildSearchAllHref(label),
  }));
}

/** Figma 7334:131967 (PC) · 7334:131884 (MO) — GNB search overlay */
export const gnbSearchContent = {
  searchPlaceholder: downloadCenterPage.searchPlaceholder,
  searchPlaceholderMobile: downloadCenterPage.searchPlaceholderMobile,
  popularSearchLabel: "Popular Keywords :",
  popularTags: toTags(downloadCenterPage.popularTags),
  popularTagsMobile: {
    row1: toTags(downloadCenterPage.popularTagsMobile.row1),
    row2: toTags(downloadCenterPage.popularTagsMobile.row2),
  },
} as const;
