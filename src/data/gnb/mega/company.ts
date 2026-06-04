import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import { GNB_MEGA_SECTION_DESC } from "@/data/gnb/shared";
import type { GnbSimpleMegaMenu } from "@/data/gnb/types";

/** Figma 2769:35523 — Company mega menu */
export const companyMegaMenu: GnbSimpleMegaMenu = {
  type: "simple",
  panelId: GNB_MEGA_PANEL_ID.company,
  layout: "sections",
  sections: [
    {
      id: "about-us",
      label: "About Us",
      items: [
        {
          id: "ls-electric-america",
          title: "LS ELECTRIC America",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
        },
        {
          id: "ls-electric",
          title: "LS ELECTRIC",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
        },
        {
          id: "affiliate-in-america",
          title: "Affiliate in America",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
        },
        {
          id: "esg",
          title: "ESG",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
        },
      ],
    },
    {
      id: "articles",
      label: "Articles",
      items: [
        {
          id: "blog",
          title: "Blog",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
        },
        {
          id: "press",
          title: "Press",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
        },
        {
          id: "events",
          title: "Events",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
        },
        {
          id: "magazine-articles",
          title: "Magazine Articles",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
        },
      ],
    },
  ],
};
