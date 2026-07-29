import {
  trainingContent,
  type TrainingVariant,
} from "../data/trainingContent";
import TrainingCurriculum from "./TrainingCurriculum";
import TrainingTitle from "./TrainingTitle";
import "@/assets/css/company.css";
import "@/assets/css/training.css";

export default function TrainingCurriculumPage({
  variant,
}: {
  variant: TrainingVariant;
}) {
  const content = trainingContent[variant];

  return (
    <main className={content.mainClassName} id={content.pageId}>
      <TrainingTitle title={content.title} description={content.description} />
      <TrainingCurriculum
        curriculum={content.curriculum}
        variant={variant}
        sectionId={content.sectionId}
        ariaLabel={content.ariaLabel}
        detailHrefPrefix={content.detailHrefPrefix}
      />
    </main>
  );
}
