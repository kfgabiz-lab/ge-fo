import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import TrainingDetailPage from "@/app/services/training/components/TrainingDetailPage";
import { buildCourseMetadata } from "@/app/services/training/data/trainingDetailData";
import { isNumericId } from "@/lib/isNumericId";

type PageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  if (!isNumericId(id)) notFound();
  return buildCourseMetadata(id, parent);
}

export default async function TrainingCourseRoute({ params }: PageProps) {
  const { id } = await params;
  if (!isNumericId(id)) notFound();
  return <TrainingDetailPage courseId={id} />;
}
