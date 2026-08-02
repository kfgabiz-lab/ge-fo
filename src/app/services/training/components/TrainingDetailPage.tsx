import { notFound } from "next/navigation";
import type { TrainingVariant } from "../data/trainingContent";
import { fetchTrainingCategories, toCategoryMap } from "../data/trainingData";
import {
  fetchProductNamesForRows,
  fetchTrainingCurriculum,
  fetchTrainingDetailRows,
  fetchTrainingTypeCodes,
  isCurriculumVisible,
  toTrainingCourseDetail,
} from "../data/trainingDetailData";
import TrainingDetailHero from "./TrainingDetailHero";
import TrainingDetailSchedule from "./TrainingDetailSchedule";
import "@/assets/css/training.css";

export default async function TrainingDetailPage({
  variant,
  courseId,
}: {
  variant: TrainingVariant;
  courseId: string;
}) {
  const [rows, curriculum, categoryCodes, trainingTypeCodes] =
    await Promise.all([
      fetchTrainingDetailRows(courseId),
      fetchTrainingCurriculum(courseId),
      fetchTrainingCategories(),
      fetchTrainingTypeCodes(),
    ]);

  if (!curriculum || !isCurriculumVisible(curriculum)) {
    notFound();
  }

  const productNameMap = await fetchProductNamesForRows(rows);
  const categoryMap = toCategoryMap(categoryCodes);
  const trainingTypeMap = toCategoryMap(trainingTypeCodes);

  const detail = toTrainingCourseDetail(
    rows,
    courseId,
    curriculum,
    categoryMap,
    trainingTypeMap,
    productNameMap,
  );

  const hrefPrefix = `/services/${variant}-training`;

  return (
    <main
      className={`support-page support-page--${variant}-training-detail`}
      id="P-FO-SERV-030100P"
    >
      <TrainingDetailHero detail={detail} />
      <TrainingDetailSchedule
        detail={detail}
        hrefPrefix={hrefPrefix}
        trainingTypeCodes={trainingTypeCodes}
      />
    </main>
  );
}
