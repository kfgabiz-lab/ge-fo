import CompanyAboutTitleSection from "@/app/()/company/components/CompanyAboutTitleSection";
import { warrantyPolicyPage } from "@/data/services/warrantyPolicyContent";

export default function WarrantyPolicyTitle() {
  return (
    <CompanyAboutTitleSection
      title={warrantyPolicyPage.title}
      description={warrantyPolicyPage.description}
    />
  );
}
