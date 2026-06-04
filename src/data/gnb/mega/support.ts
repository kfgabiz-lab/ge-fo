import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import { GNB_MEGA_SECTION_DESC } from "@/data/gnb/shared";
import type { GnbSimpleMegaMenu } from "@/data/gnb/types";

/** Figma 2769:35780 — Support mega menu */
export const supportMegaMenu: GnbSimpleMegaMenu = {
  type: "simple",
  panelId: GNB_MEGA_PANEL_ID.support,
  layout: "sections",
  sections: [
    {
      id: "resources",
      label: "Resources",
      items: [
        {
          id: "connect-portal",
          title: "Connect Portal",
          description: "High-reliability vacuum arc interruption.",
          href: "",
        },
        {
          id: "download-center",
          title: "Download Center",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
        },
        {
          id: "tech-hub",
          title: "Tech Hub",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
        },
        {
          id: "where-to-buy",
          title: "Where to Buy",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
        },
        {
          id: "contact-us",
          title: "Contact Us",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
        },
      ],
    },
    {
      id: "portals",
      label: "Portals & Tools",
      items: [
        {
          id: "product-finder",
          title: "Product Finder",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
          external: true,
        },
        {
          id: "product-match",
          title: "Product Match Guide",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
          external: true,
        },
        {
          id: "pre-engineering",
          title: "LS Pre-Engineering",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
          external: true,
        },
        {
          id: "request-service",
          title: "Request for Service",
          description: GNB_MEGA_SECTION_DESC,
          href: "",
          external: true,
        },
      ],
    },
    {
      id: "training",
      label: "Training",
      items: [
        { id: "sales-training", title: "Sales Training", href: "" },
        { id: "engineering-training", title: "Engineering Training", href: "" },
        { id: "service-training", title: "Service Training", href: "" },
      ],
    },
  ],
};
