import type { Metadata, ResolvingMetadata } from "next";
import TrainingCurriculumPage from "@/app/services/training/components/TrainingCurriculumPage";
import {
  TRAINING_LIST_SIZE,
  TRAINING_SLUG,
  fetchTrainingCategories,
  toCategoryMap,
  toTrainingCard,
  trainingStatusWhere,
} from "@/app/services/training/data/trainingData";
import { fetchData } from "@/lib/pageDataApi";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import JsonLd from "@/components/seo/JsonLd";
import { buildTrainingListGraph } from "@/lib/structuredData/trainingListGraph";

const PATHNAME = "/services/service-training";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function ServiceTrainingPage() {
  const [meta, categories] = await Promise.all([
    fetchMenuMeta(PATHNAME),
    fetchTrainingCategories(),
  ]);
  const categoryMap = toCategoryMap(categories);
  const res = await fetchData({
    slug: TRAINING_SLUG,
    page: 0,
    size: TRAINING_LIST_SIZE,
    where: trainingStatusWhere("service"),
    sort: "createdAt,desc",
    리턴함수: (rows) => rows.map((row) => toTrainingCard(row, categoryMap)),
  });
  const graph = buildTrainingListGraph({ pathname: PATHNAME, meta, courses: res.content });
  return (
    <>
      <JsonLd data={graph} />
      <TrainingCurriculumPage variant="service" />
    </>
  );
}
