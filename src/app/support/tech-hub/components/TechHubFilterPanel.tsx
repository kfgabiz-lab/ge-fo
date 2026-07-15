"use client";

import SupportFilterPanel from "@/app/support/components/SupportFilterPanel";
import {
  techHubCertifications,
  techHubProductCategories,
} from "@/data/support/techHubContent";
import { useTechHubFilter } from "./TechHubFilterProvider";

type TechHubFilterPanelProps = {
  variant?: "sidebar" | "modal";
};

export default function TechHubFilterPanel({
  variant = "sidebar",
}: TechHubFilterPanelProps) {
  const filter = useTechHubFilter();

  return (
    <SupportFilterPanel
      variant={variant}
      filter={filter}
      categories={techHubProductCategories}
      categoryIdPrefix="th-category"
      secondaryTitle="Certification"
      secondaryVariant="certification"
      secondaryIdPrefix="th-cert"
      secondarySection="certification"
      secondaryOptions={techHubCertifications}
    />
  );
}
