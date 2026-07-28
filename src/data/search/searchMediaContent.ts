import type { SearchMediaItem } from "@/data/search/searchAllContent";
import type { DownloadFilterOption } from "@/data/support/downloadCenterContent";

/** Figma 6430:112128 — Search Media tab + filter */
export const searchMediaPage = {
  totalResults: 2658,
  pageSize: 10,
} as const;

export const searchMediaTypes: DownloadFilterOption[] = [
  { id: "tech-hub", label: "Tech Hub", count: 100 },
  { id: "blog", label: "Blog", count: 100 },
  { id: "press", label: "Press", count: 100 },
  { id: "articles", label: "Articles", count: 100 },
];

const mediaPool: SearchMediaItem[] = [
  {
    id: "sm-1",
    href: "/company/blog/detail",
    image: "/img/company/blog/list_01.jpg",
    category: "Blog",
    title: "The Significance of Arc Resistance in Material Selection DC Device",
    highlight: "DC Device",
    description:
      "Electrical faults and equipment failures can halt operations, cause costly downtime,\nand pose a threat to worker safety. In fact, around 80% of electrical injuries involve thermal...",
  },
  {
    id: "sm-2",
    href: "/company/tech-hub/detail",
    image: "/img/company/press/detail_video_poster.png",
    category: "Tech Hub",
    title: "[ACB] Response Manual for Electrical Closing Failure DC Device",
    highlight: "DC Device",
    variant: "video",
  },
  {
    id: "sm-3",
    href: "/company/press/detail",
    image: "/img/company/press/list_01.png",
    category: "Press",
    title: "LS ELECTRIC to shake up the industry in the era of a ‘Supercycle’",
    description:
      "Stated at the annual general meeting of shareholders held on the 26th at LS Tower in Anyang ··· All agenda items passed as proposed. Power market entering an “ultra supercycle” Stated...",
  },
  {
    id: "sm-4",
    href: "/company/events/detail",
    image: "/img/company/events/featured_01.png",
    category: "Event",
    title: "All Planned Exhibitions and Webinars DC Device",
    highlight: "DC Device",
    description:
      "Events : IEEE PES T&D  /  Venue : Chicago  /  Dates : Apr 17, 2025 ~ Apr 19, 2025",
  },
  {
    id: "sm-5",
    href: "/company/blog/detail",
    image: "/img/company/blog/list_01.jpg",
    category: "Blog",
    title: "What is a Relay: Types, Functions, and Industrial Applications",
    highlight: "DC Device",
    description:
      "DC Device Electrical faults and equipment failures can halt operations, cause costly downtime,\nand pose a threat to worker safety. In fact, around 80% of electrical injuries involve thermal...",
  },
  {
    id: "sm-6",
    href: "/company/press/detail",
    image: "/img/company/press/list_01.png",
    category: "Press",
    title: "LS ELECTRIC to shake up the industry in the era of a ‘Supercycle’",
    highlight: "DC Device",
    description:
      "Stated at the annual general meeting of shareholders held on the 26th at LS Tower in Anyang ··· All agenda items passed as proposed. Power market DC Device entering an “ultra...",
  },
  {
    id: "sm-7",
    href: "/company/press/detail",
    image: "/img/company/press/list_01.png",
    category: "Press",
    title: "LS ELECTRIC to shake up the industry in the era of a ‘DC Device’",
    highlight: "DC Device",
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
