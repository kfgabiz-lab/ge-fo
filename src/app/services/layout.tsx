import { headers } from "next/headers";
import SubHeader from "@/components/layout/markets/SubHeader";
import SubFooter from "@/components/layout/markets/SubFooter";
import type { BreadcrumbServerOverride } from "@/components/layout/shared/HeaderBreadcrumb";
import { fetchDevicesMegaMenu, fetchGnbMenuData } from "@/data/gnb";

const TRAINING_RESERVED_TOP = "sales|engineering|service|request";
const TRAINING_DETAIL_PATH_RE = new RegExp(
  `^/services/training/(?!(?:${TRAINING_RESERVED_TOP})$)([^/]+)$`,
);
const TRAINING_SESSION_PATH_RE = new RegExp(
  `^/services/training/(?!(?:${TRAINING_RESERVED_TOP})(?:/|$))([^/]+)/[^/]+$`,
);
const TRAINING_REQUEST_PATH_RE =
  /^\/services\/training\/request(\/step-(2|3|4)(-type_01)?)?$/;

async function resolveBreadcrumbOverride(): Promise<BreadcrumbServerOverride> {
  const pathname = (await headers()).get("x-pathname");
  if (!pathname) return null;

  if (TRAINING_REQUEST_PATH_RE.test(pathname)) {
    return { pathname, current: "Training Request" };
  }

  const sessionMatch = pathname.match(TRAINING_SESSION_PATH_RE);
  if (sessionMatch) {
    const [, courseId] = sessionMatch;
    const courseHref = `/services/training/${courseId}`;
    return { pathname, crumb: { href: courseHref, label: "Course" } };
  }

  const detailMatch = pathname.match(TRAINING_DETAIL_PATH_RE);
  if (detailMatch) {
    return { pathname, current: "Course" };
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
