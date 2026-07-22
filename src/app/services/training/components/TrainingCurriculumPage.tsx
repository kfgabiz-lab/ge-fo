import {
  trainingContent,
  type TrainingVariant,
} from "../data/trainingContent";
import TrainingCurriculum from "./TrainingCurriculum";
import TrainingTitle from "./TrainingTitle";
import "@/assets/css/company.css";
import "@/assets/css/training.css";

// Training 리스트 공통 조립 래퍼 (CompanyFeedPage 패턴).
// variant로 pageId/클래스/콘텐츠/섹션id/ariaLabel/상세링크접두어를 분기한다.
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
