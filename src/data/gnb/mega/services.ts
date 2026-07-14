import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import type { GnbSimpleMegaMenu } from "@/data/gnb/types";

/** Figma 3670:14629 — Services mega (2 columns) */
export const servicesMegaMenu: GnbSimpleMegaMenu = {
  type: "simple",
  panelId: GNB_MEGA_PANEL_ID.services,
  layout: "sections",
  sections: [
    {
      id: "ls-electric-services",
      label: "LS ELECTRIC Services",
      items: [
        {
          id: "Service-center",
          title: "Service Center",
          description: "General service info & requests.",
          href: "/services/service-center",
        },
        {
          id: "warranty-policy",
          title: "Warranty Policy",
          description: "Product warranty terms & extensions.",
          href: "/services/warranty-policy",
        },
        {
          id: "request-for-service",
          title: "Request for Service",
          description: "Submit a service request online.",
          href: "https://gics.ls-electric.com/public/index.do",
          external: true,
        },
      ],
    },
    {
      id: "training",
      label: "Training",
      items: [
        {
          id: "sales-training",
          title: "Sales Training",
          description: "Training for Product configuration and order placement",
          disabled: true,
        },
        {
          id: "engineering-training",
          title: "Engineering Training",
          description: "Training for engineering works",
          href: "/services/engineering-training",
        },
        {
          id: "service-training",
          title: "Service Training",
          description: "Training for field serivces",
          disabled: true,
        },
        {
          id: "request-for-training",
          title: "Request for Training",
          description: "Submit a request for custom training",
          href: "/services/request-for-training",
        },
      ],
    },
  ],
};
