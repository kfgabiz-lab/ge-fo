import TrainingDetailPage from "@/app/services/training/components/TrainingDetailPage";

/** P-FO-SERV-030100P — Engineering Training 코스 상세 (1뎁스) */
type PageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function EngineeringTrainingDetailRoute({
  params,
}: PageProps) {
  const { courseId } = await params;
  return <TrainingDetailPage variant="engineering" courseId={courseId} />;
}
