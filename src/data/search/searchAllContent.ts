import { downloadCenterPage } from "@/data/support/downloadCenterContent";

export const SEARCH_ALL_PATH = "/search";

export function buildSearchAllHref(query?: string): string {
  if (query === undefined) {
    return SEARCH_ALL_PATH;
  }
  const trimmed = query.trim();
  return trimmed
    ? `${SEARCH_ALL_PATH}?q=${encodeURIComponent(trimmed)}`
    : `${SEARCH_ALL_PATH}?q=`;
}

export function buildSearchTabHref(
  query: string,
  tab: Exclude<SearchTabId, "all">,
): string {
  return `${buildSearchAllHref(query)}&tab=${tab}`;
}

export const searchAllPage = {
  defaultQuery: "DC Device",
  searchPlaceholder: downloadCenterPage.searchPlaceholder,
  searchPlaceholderMobile: downloadCenterPage.searchPlaceholderMobile,
  popularSearchLabel: downloadCenterPage.popularSearchLabel,
  popularSearchLabelMobile: downloadCenterPage.popularSearchLabelMobile,
  popularTags: downloadCenterPage.popularTags,
  popularTagsMobile: downloadCenterPage.popularTagsMobile,
  aiDisclaimer: "AI-generated content may be incomplete. Verify important info.",
  aiTitle: "AI-generated summary of your search results",
} as const;

export type SearchTabId = "all" | "products" | "documents" | "media" | "pages";

export type SearchTab = {
  id: SearchTabId;
  label: string;
};

export const searchAllTabs: SearchTab[] = [
  { id: "all", label: "All" },
  { id: "products", label: "Products" },
  { id: "documents", label: "Documents" },
  { id: "media", label: "Media" },
  { id: "pages", label: "Pages" },
];

export type SearchProductItem = {
  id: string;
  href: string;
  image: string;
  category: string;
  highlight: string;
  title: string;
  description: string;
};

export type SearchMediaItem = {
  id: string;
  href: string;
  image: string;
  category: string;
  title: string;
  description?: string;
  highlight?: string;
  highlightPlacement?: "title" | "description";
  variant?: "default" | "video";
};

export type SearchPageItem = {
  id: string;
  href: string;
  category: string;
  title: string;
  mark?: string;
  highlight?: string;
  description: string;
};

export const searchEmptyResult = {
  title: "We could not find any results",
  notes: [
    "Ensure all search terms are spelled correctly.",
    "Narrow your results by using more specific keywords. (e.g. 'ACS 600 manual')",
    "Search is not case sensitive — 'acs 600' and 'ACS 600' return identical results.",
    "Wildcard searches are not supported. Please enter the full term instead. (e.g. 'transformer' instead of 'transf*')",
  ],
  contactNote: {
    before: "If you are unable to find the required information, please visit our ",
    linkLabel: "Contact Us",
    linkHref: "/support/contact-us",
    after: " page.",
  },
} as const;

export function toSearchTabId(value: string | null): SearchTabId | undefined {
  return searchAllTabs.find((tab) => tab.id === value)?.id;
}
