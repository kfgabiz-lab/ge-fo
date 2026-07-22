import TrainingSessionPage from "@/app/services/training/components/TrainingSessionPage";

/** P-FO-SERV-030101P_1 — Service Training 세션 상세 (2뎁스) */
type PageProps = {
  params: Promise<{ courseId: string; sessionId: string }>;
};

export default async function ServiceTrainingSessionRoute({
  params,
}: PageProps) {
  const { courseId, sessionId } = await params;
  return (
    <TrainingSessionPage
      variant="service"
      courseId={courseId}
      sessionId={sessionId}
    />
  );
}
