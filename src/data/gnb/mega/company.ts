import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import type { GnbSimpleMegaMenu } from "@/data/gnb/types";

/** Figma 5683:60839 — Company mega (About Us · Articles · Careers) */
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
          description: "About LS ELECTRIC America",
          href: "/company/ls-electric-america",
        },
        {
          id: "ls-electric",
          title: "LS ELECTRIC",
          description: "About LS ELECTRIC",
          href: "/company/ls-electric",
        },
        {
          id: "affiliate-in-america",
          title: "Affiliate in America",
          description: "Our US affiliates and partners.",
          href: "/company/affiliate-in-america",
        },
        {
          id: "esg",
          title: "ESG",
          description: "Environmental, Social & Governance.",
          href: "/company/esg",
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
          description: "Read our latest blog posts",
          href: "/company/blog",
        },
        {
          id: "press",
          title: "Press",
          description: "Latest news and press releases",
          href: "/company/press",
        },
        {
          id: "events",
          title: "Events",
          description: "Upcoming conference schedules",
          href: "/company/events",
        },
        {
          id: "articles",
          title: "Articles",
          description: "Read featured articles & insights",
          href: "/company/articles",
        },
      ],
    },
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
