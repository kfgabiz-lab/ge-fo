import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import { GNB_MEGA_SECTION_DESC } from "@/data/gnb/shared";
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
          title: "Careers at LSEA",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
        },
        {
          id: "search-and-apply",
          title: "Search and Apply",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
          external: true,
        },
      ],
    },
  ],
};
