import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import TrainingSessionPage from "@/app/services/training/components/TrainingSessionPage";
import { buildSessionMetadata } from "@/app/services/training/data/trainingDetailData";
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
  return buildSessionMetadata(id, parent);
}

export default async function TrainingSessionRoute({ params }: PageProps) {
  const { id } = await params;
  if (!isNumericId(id)) notFound();
  return <TrainingSessionPage sessionId={id} />;
}
