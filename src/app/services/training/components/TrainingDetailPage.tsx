import { notFound } from "next/navigation";
import type { TrainingVariant } from "../data/trainingContent";
import { fetchTrainingCategories, toCategoryMap } from "../data/trainingData";
import {
  fetchTrainingCurriculum,
  fetchTrainingDetailRows,
  fetchTrainingProductNameMaps,
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
  const [rows, curriculum, categoryCodes, trainingTypeCodes, productNameMaps] =
    await Promise.all([
      fetchTrainingDetailRows(courseId),
      fetchTrainingCurriculum(courseId),
      fetchTrainingCategories(),
      fetchTrainingTypeCodes(),
      fetchTrainingProductNameMaps(),
    ]);

  if (!curriculum || !isCurriculumVisible(curriculum)) {
    notFound();
  }

  const categoryMap = toCategoryMap(categoryCodes);
  const trainingTypeMap = toCategoryMap(trainingTypeCodes);

  const detail = toTrainingCourseDetail(
    rows,
    courseId,
    curriculum,
    categoryMap,
    trainingTypeMap,
    productNameMaps,
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
