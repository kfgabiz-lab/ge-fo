import { notFound } from "next/navigation";
import type { TrainingVariant } from "../data/trainingContent";
import { fetchTrainingCategories, toCategoryMap } from "../data/trainingData";
import {
  fetchProductNamesForRows,
  fetchTrainingCurriculum,
  fetchTrainingDetailRows,
  fetchTrainingTypeCodes,
  isCurriculumVisible,
  toTrainingSessionDetail,
} from "../data/trainingDetailData";
import TrainingSessionDetail from "./TrainingSessionDetail";
import "@/assets/css/training.css";

export default async function TrainingSessionPage({
  variant,
  courseId,
  sessionId,
}: {
  variant: TrainingVariant;
  courseId: string;
  sessionId: string;
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

  const session = toTrainingSessionDetail(
    rows,
    courseId,
    sessionId,
    curriculum,
    categoryMap,
    trainingTypeMap,
    productNameMap,
  );
  if (!session) {
    notFound();
  }

  return (
    <main
      className={`support-page support-page--${variant}-training-session`}
      id="P-FO-SERV-030101P"
      data-slug="currDtlMgmt-data"
    >
      <TrainingSessionDetail session={session} variant={variant} />
    </main>
  );
}
