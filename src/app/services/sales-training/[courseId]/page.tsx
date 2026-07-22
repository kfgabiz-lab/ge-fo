import TrainingDetailPage from "@/app/services/training/components/TrainingDetailPage";

/** P-FO-SERV-030100P_2 — Sales Training 코스 상세 (1뎁스) */
type PageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function SalesTrainingDetailRoute({
  params,
}: PageProps) {
  const { courseId } = await params;
  return <TrainingDetailPage variant="sales" courseId={courseId} />;
}
