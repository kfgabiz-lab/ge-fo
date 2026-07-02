import CompanyAboutTitleSection from "@/app/()/company/components/CompanyAboutTitleSection";
import { requestForTrainingPage } from "@/data/services/requestForTrainingContent";

export default function RequestForTrainingTitle() {
  const { title, description } = requestForTrainingPage;

  return <CompanyAboutTitleSection title={title} description={description} />;
}
