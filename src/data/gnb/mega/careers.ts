import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import type { GnbSimpleMegaMenu } from "@/data/gnb/types";

/** Figma 2769:35857 — Careers mega menu */
export const careersMegaMenu: GnbSimpleMegaMenu = {
  type: "simple",
  panelId: GNB_MEGA_PANEL_ID.careers,
  layout: "sections",
  sections: [
    {
      id: "careers",
      label: "Careers",
      items: [
        {
          id: "careers-at-lsea",
          title: "Careers at LS ELECTRIC America",
          description: "Read our latest blog posts",
          href: "/company/careers",
        },
        {
          id: "search-and-apply",
          title: "Search and Apply",
          description: "Critical short-circuit protection for MV grids.",
          href: "https://www.linkedin.com/company/lselectricamerica/jobs/",
          external: true,
        },
      ],
    },
  ],
};
