import CompanyAboutTitleSection from "@/app/()/company/components/CompanyAboutTitleSection";
import { engineeringTrainingPage } from "@/data/services/engineeringTrainingContent";

export default function EngineeringTrainingTitle() {
  const { title, description } = engineeringTrainingPage;

  return <CompanyAboutTitleSection title={title} description={description} />;
}
