import { headers } from "next/headers";
import SubHeader from "@/components/layout/markets/SubHeader";
import SubFooter from "@/components/layout/markets/SubFooter";
import type { BreadcrumbServerOverride } from "@/components/layout/shared/HeaderBreadcrumb";
import { fetchDevicesMegaMenu, fetchGnbMenuData } from "@/data/gnb";
import {
  fetchTrainingCourseIdBySession,
  resolveTrainingSessionCourseHref,
  resolveTrainingVariantListHref,
} from "@/app/services/training/data/trainingDetailData";
import { isNumericId } from "@/lib/isNumericId";
import { TRAINING_VARIANT_LABELS } from "@/data/breadcrumbConfig";

function getTrainingVariantCrumb(variantHref: string | null) {
  if (!variantHref) return null;

  const variant = variantHref.split("/").pop();

  if (
    variant !== "sales" &&
    variant !== "engineering" &&
    variant !== "service"
  ) {
    return null;
  }

  return {
    label: TRAINING_VARIANT_LABELS[variant],
    href: variantHref,
  };
}

const TRAINING_DETAIL_PATH_RE =
  /^\/services\/training\/course\/([^/]+)(?:\/[^/]+)?$/;
const TRAINING_SESSION_PATH_RE =
  /^\/services\/training\/session\/([^/]+)(?:\/[^/]+)?$/;
const TRAINING_REQUEST_PATH_RE =
  /^\/services\/training\/request(\/step-(2|3|4)(-type_01)?)?$/;

async function resolveBreadcrumbOverride(): Promise<BreadcrumbServerOverride> {
  const pathname = (await headers()).get("x-pathname");
  if (!pathname) return null;

  if (TRAINING_REQUEST_PATH_RE.test(pathname)) {
    return { pathname, current: "Training Request" };
  }

  /* 브레드크럼은 부가 정보라 조회 실패가 페이지 렌더링 자체를 막으면 안 됨 —
     courseId/sessionId가 존재하지 않거나 API 오류가 나도 여기서 흡수하고 override 없이 진행 */
  try {
    const courseDetailMatch = pathname.match(TRAINING_DETAIL_PATH_RE);
    if (courseDetailMatch) {
      const [, courseId] = courseDetailMatch;
      if (!isNumericId(courseId)) return null;

      const variantHref = await resolveTrainingVariantListHref(courseId);
      const variantCrumb = getTrainingVariantCrumb(variantHref);

      return {
        pathname,
        current: "Course",
        replaceCrumbs: [
          { label: "Services" },
          { label: "Training" },
          ...(variantCrumb ? [variantCrumb] : []),
        ],
      };
    }


    const sessionMatch = pathname.match(TRAINING_SESSION_PATH_RE);
    if (sessionMatch) {
      const [, sessionId] = sessionMatch;
      if (!isNumericId(sessionId)) return null;

      const courseId = await fetchTrainingCourseIdBySession(sessionId);
      if (courseId == null) return null;

      const [courseHref, variantHref] = await Promise.all([
        resolveTrainingSessionCourseHref(sessionId),
        resolveTrainingVariantListHref(courseId),
      ]);

      const variantCrumb = getTrainingVariantCrumb(variantHref);

      return {
        pathname,
        current: "Session",
        replaceCrumbs: [
          { label: "Services" },
          { label: "Training" },
          ...(variantCrumb ? [variantCrumb] : []),
          ...(courseHref ? [{ label: "Course", href: courseHref }] : []),
        ],
      };
    }

  } catch {
    return null;
  }

  return null;
}

export default async function ServicesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [gnbMenuData, devicesMegaMenu, breadcrumbOverride] = await Promise.all([
    fetchGnbMenuData(),
    fetchDevicesMegaMenu(),
    resolveBreadcrumbOverride(),
  ]);

  return (
    <>
      <SubHeader
        gnbMenuData={gnbMenuData}
        devicesMegaMenu={devicesMegaMenu}
        breadcrumbOverride={breadcrumbOverride}
      />
      {children}
      <SubFooter />
    </>
  );
}
