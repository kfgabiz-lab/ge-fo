import { notFound } from "next/navigation";
import type { TrainingVariant } from "../data/trainingContent";
import {
  TRAINING_COURSE_DETAIL_HREF_PREFIX,
  TRAINING_SESSION_DETAIL_HREF_PREFIX,
  TRAINING_VARIANT_BY_COURSE_CODE,
  fetchTrainingCategories,
  toCategoryMap,
} from "../data/trainingData";
import {
  fetchProductNamesForRows,
  fetchTrainingCurriculum,
  fetchTrainingDetailRows,
  fetchTrainingTypeCodes,
  isCurriculumVisible,
  toTrainingCourseDetail,
} from "../data/trainingDetailData";
import { contentDetailPath } from "@/lib/contentDetailPath";
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
  courseId,
}: {
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

  const variant: TrainingVariant =
    TRAINING_VARIANT_BY_COURSE_CODE[curriculum.training_course ?? ""] ?? "sales";
  const canonicalCourseSlug = curriculum.slug || courseId;

  const productNameMap = await fetchProductNamesForRows(rows);
  const categoryMap = toCategoryMap(categoryCodes);
  const trainingTypeMap = toCategoryMap(trainingTypeCodes);

  const detail = toTrainingCourseDetail(
    rows,
    canonicalCourseSlug,
    curriculum,
    categoryMap,
    trainingTypeMap,
    productNameMap,
  );

  const hrefPrefix = "/services/training";
  const variantListHref = `${hrefPrefix}/${variant}`;

  const currentUrl = pageUrl(
    contentDetailPath(
      TRAINING_COURSE_DETAIL_HREF_PREFIX,
      courseId,
      curriculum.slug,
    ),
  );
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
      location: s.location
        ? {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressCountry: "US",
              ...(s.streetAddress ? { streetAddress: s.streetAddress } : {}),
              ...(s.extendedAddress ? { extendedAddress: s.extendedAddress } : {}),
            },
          }
        : { "@type": "VirtualLocation" },
      ...(s.productNames && s.productNames.length
        ? { about: s.productNames.map((name) => ({ "@type": "Product", name })) }
        : {}),
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        url: `${pageUrl(
          contentDetailPath(
            TRAINING_SESSION_DETAIL_HREF_PREFIX,
            s.id,
            s.slug,
          ),
        )}#session-registration`,
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
      { name: VARIANT_LABELS[variant], url: pageUrl(variantListHref) },
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
        trainingTypeCodes={trainingTypeCodes}
      />
    </main>
  );
}
