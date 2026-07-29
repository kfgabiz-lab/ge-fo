import CompanyAboutTitleSection from "@/app/company/components/CompanyAboutTitleSection";

export default function TrainingTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return <CompanyAboutTitleSection title={title} description={description} />;
}
