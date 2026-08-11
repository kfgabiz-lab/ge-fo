import { notFound } from "next/navigation";
import type { TrainingVariant } from "../data/trainingContent";
import { fetchTrainingCategories, toCategoryMap } from "../data/trainingData";
import {
  fetchProductNamesForRows,
  fetchTrainingCurriculum,
  fetchTrainingDetailRows,
  fetchTrainingTypeCodes,
  isCurriculumVisible,
  toTrainingCourseDetail,
} from "../data/trainingDetailData";
import TrainingDetailHero from "./TrainingDetailHero";
import TrainingDetailSchedule from "./TrainingDetailSchedule";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, buildPageGraph, pageUrl } from "@/lib/structuredData/builders";
import { ORG_ID, SITE_URL, WEBSITE_ID } from "@/lib/structuredData/siteConfig";
import "@/assets/css/training.css";

const VARIANT_LABELS: Record<TrainingVariant, string> = {
  sales: "Sales Training",
  engineering: "Engineering Training",
  service: "Service Training",
};

export default async function TrainingDetailPage({
  variant,
  courseId,
}: {
  variant: TrainingVariant;
  courseId: string;
}) {
  const [rows, curriculum, categoryCodes, trainingTypeCodes] =
    await Promise.all([
      fetchTrainingDetailRows(courseId),
      fetchTrainingCurriculum(courseId),
      fetchTrainingCategories(),
      fetchTrainingTypeCodes(),
    ]);

  if (!curriculum || !isCurriculumVisible(curriculum)) {
    notFound();
  }

  const productNameMap = await fetchProductNamesForRows(rows);
  const categoryMap = toCategoryMap(categoryCodes);
  const trainingTypeMap = toCategoryMap(trainingTypeCodes);

  const detail = toTrainingCourseDetail(
    rows,
    courseId,
    curriculum,
    categoryMap,
    trainingTypeMap,
    productNameMap,
  );

  const hrefPrefix = `/services/${variant}-training`;

  const currentUrl = pageUrl(`${hrefPrefix}/${courseId}`);
  const courseNode = {
    "@type": "Course",
    "@id": `${currentUrl}#course`,
    name: detail.title,
    description: detail.descriptionLines.join(" "),
    provider: { "@id": ORG_ID },
    hasCourseInstance: detail.schedule.sessions.map((s) => ({
      "@type": "CourseInstance",
      name: s.title,
      courseMode: s.location ? "In-Person" : "Virtual",
      startDate: s.isoDate,
      endDate: s.isoDateTo,
      ...(s.location
        ? { location: { "@type": "Place", address: { "@type": "PostalAddress", streetAddress: s.location } } }
        : {}),
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        url: `${pageUrl(`${hrefPrefix}/${courseId}/${s.id}`)}#session-registration`,
      },
    })),
  };
  const jsonLdGraph = buildPageGraph([
    {
      "@type": "WebPage",
      "@id": `${currentUrl}#webpage`,
      url: currentUrl,
      name: detail.title,
      description: detail.descriptionLines.join(" "),
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
      mainEntity: { "@id": `${currentUrl}#course` },
    },
    courseNode,
    breadcrumbList(currentUrl, [
      { name: "Services", url: `${SITE_URL}#services` },
      { name: VARIANT_LABELS[variant], url: pageUrl(hrefPrefix) },
      { name: "Course", url: currentUrl },
    ]),
  ]);

  return (
    <main
      className={`support-page support-page--${variant}-training-detail`}
      id="P-FO-SERV-030100P"
    >
      <JsonLd data={jsonLdGraph} />
      <TrainingDetailHero detail={detail} />
      <TrainingDetailSchedule
        detail={detail}
        hrefPrefix={hrefPrefix}
        trainingTypeCodes={trainingTypeCodes}
      />
    </main>
  );
}
