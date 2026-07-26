import CompanyAboutTitleSection from "@/app/company/components/CompanyAboutTitleSection";
import { requestForTrainingPage } from "@/data/services/requestForTrainingContent";

// Training Request 상단 타이틀. 기존 {X}TrainingTitle 과 동일하게 CompanyAboutTitleSection 재사용.
export default function RequestForTrainingTitle() {
  const { title, description } = requestForTrainingPage;

  return <CompanyAboutTitleSection title={title} description={description} />;
}
