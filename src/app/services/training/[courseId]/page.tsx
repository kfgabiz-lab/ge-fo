import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import TrainingDetailPage from "@/app/services/training/components/TrainingDetailPage";
import { buildCourseMetadata } from "@/app/services/training/data/trainingDetailData";
import { resolveContentId } from "@/lib/contentSlugOrId";

type PageProps = {
  params: Promise<{ courseId: string }>;
};

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { courseId: courseIdOrSlug } = await params;
  const courseId = await resolveContentId("currMgmt-data", courseIdOrSlug);
  if (courseId == null) return {};
  return buildCourseMetadata(courseId, parent);
}

export default async function TrainingCourseRoute({ params }: PageProps) {
  const { courseId } = await params;
  return <TrainingDetailPage courseId={courseId} />;
}
