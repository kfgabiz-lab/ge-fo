import CompanyAboutTitleSection from "@/app/()/company/components/CompanyAboutTitleSection";
import { serviceCenterPage } from "@/data/services/serviceCenterContent";

export default function ServiceCenterTitle() {
  return (
    <CompanyAboutTitleSection
      title={serviceCenterPage.title}
      description={serviceCenterPage.description}
    />
  );
}
