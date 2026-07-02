import type { SearchMediaItem } from "@/data/search/searchAllContent";
import { searchAllMedia } from "@/data/search/searchAllContent";
import type { DownloadFilterOption } from "@/data/support/downloadCenterContent";

/** Figma 4701:84177 — Search Media tab + filter */
export const searchMediaPage = {
  totalResults: 2659,
  pageSize: 10,
} as const;

export const searchMediaTypes: DownloadFilterOption[] = [
  { id: "tech-hub", label: "Tech Hub", count: 100 },
  { id: "blog", label: "Blog", count: 100 },
  { id: "press", label: "Press", count: 100 },
  { id: "articles", label: "Articles", count: 100 },
];

const mediaPool: SearchMediaItem[] = [
  ...searchAllMedia,
  {
    id: "sm-5",
    href: "/company/blog/detail",
    image: "/img/company/blog/list_01.jpg",
    category: "Blog",
    title: "What is a Relay: Types, Functions, and Industrial Applications",
    description:
      "Electrical faults and equipment failures can halt operations, cause costly downtime,\nand pose a threat to worker safety. In fact, around 80% of electrical injuries involve thermal...",
  },
  {
    id: "sm-6",
    href: "/company/articles",
    image: "/img/company/press/list_01.png",
    category: "Articles",
    title: "LS ELECTRIC to shake up the industry in the era of a ‘Supercycle’",
    description:
      "Stated at the annual general meeting of shareholders held on the 26th at LS Tower in Anyang ··· All agenda items passed as proposed. Power market entering an “ultra supercycle” Stated...",
  },
];

export function getSearchMediaPageItems(page: number, pageSize: number): SearchMediaItem[] {
  const start = (page - 1) * pageSize;
  const items: SearchMediaItem[] = [];

  for (let i = 0; i < pageSize; i++) {
    const globalIndex = start + i;
    const source = mediaPool[globalIndex % mediaPool.length];
    items.push({
      ...source,
      id: `${source.id}-${globalIndex}`,
    });
  }

  return items;
}
