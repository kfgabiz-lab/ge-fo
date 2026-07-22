import CompanyAboutTitleSection from "@/app/company/components/CompanyAboutTitleSection";

// Training 리스트 상단 타이틀. 기존 {X}TrainingTitle 과 동일하게 CompanyAboutTitleSection 재사용.
export default function TrainingTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return <CompanyAboutTitleSection title={title} description={description} />;
}
