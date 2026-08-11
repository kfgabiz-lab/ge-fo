import type { TrainingCardItem } from "@/app/services/training/data/trainingData";
import { breadcrumbList, buildPageGraph, crumbsFromBreadcrumbConfig, pageUrl, type JsonLdNode } from "./builders";
import { ORG_ID, WEBSITE_ID } from "./siteConfig";

export function buildTrainingListGraph(input: {
  pathname: string;
  meta: { metaTitle: string; metaDescription: string };
  courses: TrainingCardItem[];
}): { "@context": string; "@graph": JsonLdNode[] } {
  const { pathname, meta, courses } = input;
  const currentUrl = pageUrl(pathname);
  return buildPageGraph([
    {
      "@type": "CollectionPage",
      "@id": `${currentUrl}#webpage`,
      url: currentUrl,
      name: meta.metaTitle,
      description: meta.metaDescription,
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
      mainEntity: {
        "@type": "ItemList",
        name: meta.metaTitle,
        itemListElement: courses.map((course, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Course",
            name: course.title,
            description: course.description,
            provider: { "@id": ORG_ID },
          },
        })),
      },
    },
    breadcrumbList(currentUrl, crumbsFromBreadcrumbConfig(pathname, currentUrl)),
  ]);
}
