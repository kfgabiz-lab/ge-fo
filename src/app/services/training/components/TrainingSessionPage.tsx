import { notFound } from "next/navigation";
import type { TrainingVariant } from "../data/trainingContent";
import { fetchTrainingCategories, toCategoryMap } from "../data/trainingData";
import {
  fetchProductNamesForRows,
  fetchTrainingCurriculum,
  fetchTrainingDetailRows,
  fetchTrainingTypeCodes,
  isCurriculumVisible,
  toTrainingSessionDetail,
} from "../data/trainingDetailData";
import TrainingSessionDetail from "./TrainingSessionDetail";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, buildPageGraph, pageUrl } from "@/lib/structuredData/builders";
import { SITE_URL, WEBSITE_ID } from "@/lib/structuredData/siteConfig";
import "@/assets/css/training.css";

const VARIANT_LABELS: Record<TrainingVariant, string> = {
  sales: "Sales Training",
  engineering: "Engineering Training",
  service: "Service Training",
};

export default async function TrainingSessionPage({
  variant,
  courseId,
  sessionId,
}: {
  variant: TrainingVariant;
  courseId: string;
  sessionId: string;
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

  const session = toTrainingSessionDetail(
    rows,
    courseId,
    sessionId,
    curriculum,
    categoryMap,
    trainingTypeMap,
    productNameMap,
  );
  if (!session) {
    notFound();
  }

  const hrefPrefix = `/services/${variant}-training`;
  const courseUrl = pageUrl(`${hrefPrefix}/${courseId}`);
  const currentUrl = pageUrl(`${hrefPrefix}/${courseId}/${sessionId}`);
  const sessionHasAddress = Boolean(session.sidebar.location.address);
  const sessionNode = {
    "@type": "CourseInstance",
    "@id": `${currentUrl}#session`,
    name: session.event?.title ?? session.title,
    courseMode: sessionHasAddress ? "In-Person" : "Virtual",
    startDate: session.event?.startIso ?? "",
    endDate: session.event?.endIso ?? "",
    underName: { "@id": `${courseUrl}#course` },
    location: sessionHasAddress
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "US",
            ...(session.sidebar.location.streetAddress
              ? { streetAddress: session.sidebar.location.streetAddress }
              : {}),
            ...(session.sidebar.location.extendedAddress
              ? { extendedAddress: session.sidebar.location.extendedAddress }
              : {}),
          },
        }
      : { "@type": "VirtualLocation" },
    ...(session.sidebar.productNames && session.sidebar.productNames.length
      ? { about: session.sidebar.productNames.map((name) => ({ "@type": "Product", name })) }
      : {}),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: `${currentUrl}#session-registration`,
    },
    potentialAction: [
      {
        "@type": "RegisterAction",
        name: "Register for this Session",
        target: `${currentUrl}#session-registration`,
      },
    ],
  };
  const jsonLdGraph = buildPageGraph([
    {
      "@type": "WebPage",
      "@id": `${currentUrl}#webpage`,
      url: currentUrl,
      name: session.title,
      description: session.content,
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
      mainEntity: { "@id": `${currentUrl}#session` },
    },
    sessionNode,
    breadcrumbList(currentUrl, [
      { name: "Services", url: `${SITE_URL}#services` },
      { name: VARIANT_LABELS[variant], url: pageUrl(hrefPrefix) },
      { name: "Course", url: courseUrl },
      { name: "Session", url: currentUrl },
    ]),
  ]);

  return (
    <main
      className={`support-page support-page--${variant}-training-session`}
      id="P-FO-SERV-030101P"
      data-slug="currDtlMgmt-data"
    >
      <JsonLd data={jsonLdGraph} />
      <TrainingSessionDetail session={session} variant={variant} />
    </main>
  );
}
