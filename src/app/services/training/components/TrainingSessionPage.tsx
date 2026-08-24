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
  fetchTrainingCourseIdBySession,
  fetchTrainingCurriculum,
  fetchTrainingDetailRows,
  fetchTrainingTypeCodes,
  isCurriculumVisible,
  toTrainingSessionDetail,
} from "../data/trainingDetailData";
import { contentDetailPath } from "@/lib/contentDetailPath";
import type { PageDataItem } from "@/lib/pageData";
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

function slugOf(raw: PageDataItem | undefined): string | null {
  const seo = (raw?.dataJson as { seo?: { slug?: string } } | undefined)?.seo;
  return seo?.slug || null;
}

export default async function TrainingSessionPage({
  sessionId,
}: {
  sessionId: string;
}) {
  const courseId = await fetchTrainingCourseIdBySession(sessionId);
  if (courseId == null) notFound();

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
  const sessionSlug = slugOf(rows.find((r) => String(r.id) === sessionId));
  const courseHref = contentDetailPath(
    TRAINING_COURSE_DETAIL_HREF_PREFIX,
    courseId,
    curriculum.slug,
  );

  const productNameMap = await fetchProductNamesForRows(rows);
  const categoryMap = toCategoryMap(categoryCodes);
  const trainingTypeMap = toCategoryMap(trainingTypeCodes);

  const session = toTrainingSessionDetail(
    rows,
    courseHref,
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

  const hrefPrefix = "/services/training";
  const variantListHref = `${hrefPrefix}/${variant}`;
  const courseUrl = pageUrl(courseHref);
  const currentUrl = pageUrl(
    contentDetailPath(
      TRAINING_SESSION_DETAIL_HREF_PREFIX,
      sessionId,
      sessionSlug,
    ),
  );
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
      { name: VARIANT_LABELS[variant], url: pageUrl(variantListHref) },
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
