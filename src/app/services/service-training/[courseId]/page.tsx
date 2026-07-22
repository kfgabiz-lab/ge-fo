import TrainingDetailPage from "@/app/services/training/components/TrainingDetailPage";

/** P-FO-SERV-030100P_1 — Service Training 코스 상세 (1뎁스) */
type PageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function ServiceTrainingDetailRoute({
  params,
}: PageProps) {
  const { courseId } = await params;
  return <TrainingDetailPage variant="service" courseId={courseId} />;
}
