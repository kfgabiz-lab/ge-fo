"use client";

import SupportFilterPanel from "@/app/support/components/SupportFilterPanel";
import { useTechHubFilter, useTechHubQuery } from "./TechHubFilterProvider";

type TechHubFilterPanelProps = {
  variant?: "sidebar" | "modal";
};

export default function TechHubFilterPanel({
  variant = "sidebar",
}: TechHubFilterPanelProps) {
  const filter = useTechHubFilter();
  const { categories, certifications } = useTechHubQuery();

  return (
    <SupportFilterPanel
      variant={variant}
      filter={filter}
      categories={categories}
      categoryIdPrefix="th-category"
      secondaryTitle="Certification"
      secondaryVariant="certification"
      secondaryIdPrefix="th-cert"
      secondarySection="certification"
      secondaryOptions={certifications}
    />
  );
}
