import {
  downloadCenterNoDataSearchQuery,
} from "@/data/support/downloadCenterContent";
import { techHubNoDataSearchQuery } from "@/data/support/techHubContent";
import type { SupportFilterPageVariant } from "@/app/support/components/SupportFilterPageShell";

export type SupportFilterNoDataPageConfig = {
  variant: SupportFilterPageVariant;
  pageId: string;
  initialQuery: string;
};

export const downloadCenterNoDataPageConfig: SupportFilterNoDataPageConfig = {
  variant: "download-center",
  pageId: "Page_support_download_center_no_data",
  initialQuery: downloadCenterNoDataSearchQuery,
};

export const techHubNoDataPageConfig: SupportFilterNoDataPageConfig = {
  variant: "tech-hub",
  pageId: "Page_support_tech_hub_no_data",
  initialQuery: techHubNoDataSearchQuery,
};
