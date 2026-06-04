import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import type { GnbSimpleMegaMenu } from "@/data/gnb/types";

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
          id: "service",
          title: "Service",
          description: "High-reliability vacuum arc interruption.",
          href: "",
        },
        {
          id: "warranty-policy",
          title: "Warranty Policy",
          description: "Critical short-circuit protection for MV grids.",
          href: "",
        },
        {
          id: "request-for-service",
          title: "Request for Service",
          description: "Critical short-circuit protection for MV grids.",
          href: "",
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
          description: "Critical short-circuit protection for MV grids.",
          href: "",
        },
        {
          id: "engineering-training",
          title: "Engineering Training",
          description: "Critical short-circuit protection for MV grids.",
          href: "",
        },
        {
          id: "service-training",
          title: "Service Training",
          description: "Critical short-circuit protection for MV grids.",
          href: "",
        },
      ],
    },
  ],
};
