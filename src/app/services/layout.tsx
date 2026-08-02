import { headers } from "next/headers";
import SubHeader from "@/components/layout/markets/SubHeader";
import SubFooter from "@/components/layout/markets/SubFooter";
import type { BreadcrumbServerOverride } from "@/components/layout/shared/HeaderBreadcrumb";
import { fetchDevicesMegaMenu, fetchGnbMenuData } from "@/data/gnb";
import { fetchTrainingCourseTitle } from "@/app/services/training/data/trainingDetailData";

const TRAINING_DETAIL_PATH_RE =
  /^\/services\/(?:sales|engineering|service)-training\/([^/]+)$/;
const TRAINING_SESSION_PATH_RE =
  /^\/services\/(sales|engineering|service)-training\/([^/]+)\/[^/]+$/;
const TRAINING_REQUEST_PATH_RE =
  /^\/services\/request-for-training(\/step-(2|3|4)(-type_01)?)?$/;

async function resolveBreadcrumbOverride(): Promise<BreadcrumbServerOverride> {
  const pathname = (await headers()).get("x-pathname");
  if (!pathname) return null;

  if (TRAINING_REQUEST_PATH_RE.test(pathname)) {
    return { pathname, current: "Training Request" };
  }

  const sessionMatch = pathname.match(TRAINING_SESSION_PATH_RE);
  if (sessionMatch) {
    const [, variant, courseId] = sessionMatch;
    const title = await fetchTrainingCourseTitle(courseId);
    if (!title) return null;
    const courseHref = `/services/${variant}-training/${courseId}`;
    return { pathname, crumb: { href: courseHref, label: title } };
  }

  const detailMatch = pathname.match(TRAINING_DETAIL_PATH_RE);
  if (detailMatch) {
    const title = await fetchTrainingCourseTitle(detailMatch[1]);
    return title ? { pathname, current: title } : null;
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
