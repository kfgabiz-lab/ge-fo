import { buildSearchAllHref } from "@/data/search/searchAllContent";
import { downloadCenterPage } from "@/data/support/downloadCenterContent";

export type GnbSearchTag = {
  label: string;
  href: string;
};

export const gnbSearchContent = {
  searchPlaceholder: downloadCenterPage.searchPlaceholder,
  popularSearchLabel: downloadCenterPage.popularSearchLabel,
  popularTags: downloadCenterPage.popularTags.map((label) => ({
    label,
    href: buildSearchAllHref(label),
  })) satisfies GnbSearchTag[],
} as const;
