import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import TrainingSessionPage from "@/app/services/training/components/TrainingSessionPage";
import { buildSessionMetadata } from "@/app/services/training/data/trainingDetailData";
import { resolveContentId } from "@/lib/contentSlugOrId";

type PageProps = {
  params: Promise<{ courseId: string; sessionId: string }>;
};

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { courseId: courseIdOrSlug, sessionId: sessionIdOrSlug } = await params;
  const courseId = await resolveContentId("currMgmt-data", courseIdOrSlug);
  const sessionId = await resolveContentId("currDtlMgmt-data", sessionIdOrSlug);
  if (courseId == null || sessionId == null) return {};
  return buildSessionMetadata(courseId, sessionId, parent);
}

export default async function TrainingSessionRoute({ params }: PageProps) {
  const { courseId, sessionId } = await params;
  return <TrainingSessionPage courseId={courseId} sessionId={sessionId} />;
}
