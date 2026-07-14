import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import type { GnbSimpleMegaMenu } from "@/data/gnb/types";

/** Figma 3670:14792 — Support mega (2 columns) */
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
          description: "Portal for product configurators and orders",
          href: "/support/connect-portal",
        },
        {
          id: "download-center",
          title: "Download Center",
          description: "Download documents and resources.",
          href: "/support/download-center",
        },
        {
          id: "tech-hub",
          title: "Tech Hub",
          description: "Video tutorials for our products.",
          href: "/support/tech-hub",
        },
        {
          id: "where-to-buy",
          title: "Where to Buy",
          description: "Find locations of our distributors.",
          href: "/support/where-to-buy",
        },
        {
          id: "contact-us",
          title: "Contact Us",
          description: "Reach out to us via contact form.",
          href: "/support/contact-us",
        },
      ],
    },
    {
      id: "portals",
      label: "Portals & Tools",
      items: [
        {
          id: "Knowledge-Base-Power",
          title: "Knowledge Base (Power)",
          description: "Information hub for power products",
          href: "https://gics.ls-electric.com/public/knowledgeBasePopup.do",
          external: true,
          externalIcon: false,
        },
        {
          id: "Knowledge-Base-Automation",
          title: "Knowledge Base (Automation)",
          description: "Information hub for automation products",
          href: "https://sol.ls-electric.com/us/en/community/blog",
          external: true,
          externalIcon: false,
        },
        {
          id: "product-match",
          title: "Product Match Guide",
          description: "Find LS ELECTRIC product crossover",
          href: "https://pmg.ls-electric.com/",
          external: true,
        },
        {
          id: "pre-engineering",
          title: "LS Pre-Engineering",
          description: "Quotes & drawings for custom products",
          href: "https://lspe-x.ls-electric.com/",
          external: true,
        },
        {
          id: "request-service",
          title: "Request for Service",
          description: "Submit a support request online.",
          href: "https://gics.ls-electric.com/public/index.do",
          external: true,
        },
      ],
    },
  ],
};
