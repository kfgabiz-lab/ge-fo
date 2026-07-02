import {
  downloadProductCategories,
  type DownloadCategoryOption,
  type DownloadFilterOption,
} from "@/data/support/downloadCenterContent";
import { emptyStateIconSrc } from "@/data/commonAssets";

export { type DownloadCategoryOption, type DownloadFilterOption };

export const techHubPage = {
  title: "LS ELECTRIC Tech Hub",
  description: "Access Manuals, Tutorials, and Support Resources",
  searchPlaceholder: "Find products, solutions, or resources for your business",
  defaultSearchQuery: "",
  totalResults: 2658,
  pageSize: 12,
} as const;

/** Figma 3670:30917 — Tech Hub / No Data */
export const techHubNoDataSearchQuery = "" as const;

export const techHubEmptyContent = {
  title: "There are no results",
  subtitle: "Try changing your search term, adjusting filters, or viewing all products.",
  iconSrc: emptyStateIconSrc,
  viewAllLabel: "View All",
  viewAllHref: "/support/tech-hub",
} as const;

/** Figma 3670:30813 — Certification filter */
export const techHubCertifications: DownloadFilterOption[] = [
  { id: "ul", label: "UL", count: 100 },
  { id: "iec", label: "IEC", count: 100 },
];

export type TechHubVideoItem = {
  id: string;
  title: string | string[];
  poster: string;
  ariaLabel?: string;
};

const techHubVideoSeed: TechHubVideoItem[] = [
  {
    id: "th-1",
    title: ["[VCB] VL Type_Insertion VCB", "using trolley"],
    poster: "/img/support/tech-hub/thumb-vcb.jpg",
  },
  {
    id: "th-2",
    title: ["[VCB] VL Type_Insertion VCB", "using trolley"],
    poster: "/img/support/tech-hub/thumb-vcb.jpg",
  },
  {
    id: "th-3",
    title: ["[VCB] VL Type_Insertion VCB", "using trolley"],
    poster: "/img/support/tech-hub/thumb-vcb.jpg",
  },
  {
    id: "th-4",
    title: "[GIMAC-IV] Appearance and Composition",
    poster: "/img/support/tech-hub/thumb-gimac.jpg",
  },
  {
    id: "th-5",
    title: "[EMPR] MMP Rated Current and CT Ratio Setting Manual",
    poster: "/img/support/tech-hub/thumb-empr.jpg",
  },
  {
    id: "th-6",
    title: "[ACB] UVT Coil Replacement Manual",
    poster: "/img/support/tech-hub/thumb-acb.jpg",
  },
  {
    id: "th-7",
    title: ["[VCB] VL Type_Insertion VCB", "using trolley"],
    poster: "/img/support/tech-hub/thumb-vcb.jpg",
  },
  {
    id: "th-8",
    title: ["[VCB] VL Type_Insertion VCB", "using trolley"],
    poster: "/img/support/tech-hub/thumb-vcb.jpg",
  },
  {
    id: "th-9",
    title: "[GIMAC-IV] Appearance and Composition",
    poster: "/img/support/tech-hub/thumb-gimac.jpg",
  },
  {
    id: "th-10",
    title: "[EMPR] MMP Rated Current and CT Ratio Setting Manual",
    poster: "/img/support/tech-hub/thumb-empr.jpg",
  },
  {
    id: "th-11",
    title: "[ACB] UVT Coil Replacement Manual",
    poster: "/img/support/tech-hub/thumb-acb.jpg",
  },
  {
    id: "th-12",
    title: ["[VCB] VL Type_Insertion VCB", "using trolley"],
    poster: "/img/support/tech-hub/thumb-vcb.jpg",
  },
];

export const techHubVideos: TechHubVideoItem[] = techHubVideoSeed;

export const techHubProductCategories = downloadProductCategories;

/** Figma 3670:31687 — Tech Hub View */
export type TechHubSeriesItem = {
  id: string;
  chapter: string;
  title: string | string[];
  poster: string;
  href: string;
  isActive?: boolean;
};

export type TechHubViewDetail = {
  chapter: string;
  title: string;
  date: string;
  youtubeVideoId: string;
  poster: string;
  seriesTitle: string;
  series: TechHubSeriesItem[];
  listHref: string;
};

const techHubViewPoster = "/img/support/tech-hub/thumb-vcb.jpg";

export const techHubViewDetail: TechHubViewDetail = {
  chapter: "Chapter2",
  title: "[MC] Terminal Cover Installation Manual",
  date: "Dec 9, 2025",
  youtubeVideoId: "WtQN9rcdI-0",
  poster: techHubViewPoster,
  seriesTitle: "More in This Series",
  listHref: "/support/tech-hub",
  series: [
    {
      id: "series-ch1",
      chapter: "Chapter1",
      title: ["[X-GIPAM] HMI User", "Manual for Records View"],
      poster: techHubViewPoster,
      href: "/support/tech-hub/view",
    },
    {
      id: "series-ch2",
      chapter: "Chapter2",
      title: "[MC] Terminal Cover Installation Manual",
      poster: techHubViewPoster,
      href: "/support/tech-hub/view",
    },
    {
      id: "series-ch3",
      chapter: "Chapter3",
      title: "[X-GIPAM] HMI User Manual for Power Syst...",
      poster: techHubViewPoster,
      href: "/support/tech-hub/view",
      isActive: true,
    },
    {
      id: "series-ch4",
      chapter: "Chapter4",
      title: ["[X-GIPAM] HMI User", "Manual for Records View"],
      poster: techHubViewPoster,
      href: "/support/tech-hub/view",
    },
    {
      id: "series-ch5",
      chapter: "Chapter5",
      title: "[MC] Terminal Cover Installation Manual",
      poster: techHubViewPoster,
      href: "/support/tech-hub/view",
    },
    {
      id: "series-ch6",
      chapter: "Chapter6",
      title: "[X-GIPAM] HMI User Manual for Power Syst...",
      poster: techHubViewPoster,
      href: "/support/tech-hub/view",
    },
  ],
};

export const techHubViewPath = "/support/tech-hub/view" as const;

export function getTechHubViewHref(): string {
  return techHubViewPath;
}
