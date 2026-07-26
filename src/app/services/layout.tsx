import { headers } from "next/headers";
import SubHeader from "@/components/layout/markets/SubHeader";
import SubFooter from "@/components/layout/markets/SubFooter";
import type { BreadcrumbServerOverride } from "@/components/layout/shared/HeaderBreadcrumb";
import { fetchDevicesMegaMenu, fetchGnbMenuData } from "@/data/gnb";
import { fetchTrainingCourseTitle } from "@/app/services/training/data/trainingDetailData";

// 트레이닝 코스 상세(1뎁스) 경로: /services/{variant}-training/{courseId} (단일 courseId 세그먼트)
const TRAINING_DETAIL_PATH_RE =
  /^\/services\/(?:sales|engineering|service)-training\/([^/]+)$/;
// 트레이닝 세션 상세(2뎁스) 경로: /services/{variant}-training/{courseId}/{sessionId}
const TRAINING_SESSION_PATH_RE =
  /^\/services\/(sales|engineering|service)-training\/([^/]+)\/[^/]+$/;

// 헤더 브레드크럼을 SSR 시점에 실 코스 제목으로 채우기 위한 서버 오버라이드 산출.
// - 현재 경로는 middleware 가 실어준 x-pathname 헤더로 얻는다(App Router 부모 레이아웃은 하위 세그먼트를 모름).
// - 코스상세(1뎁스): 마지막 current 텍스트를 실 코스 제목으로 교체.
// - 세션상세(2뎁스): 중간 "코스로 돌아가기" 크럼(코스상세 href) 라벨을 실 코스 제목으로 교체.
//   두 경우 모두 fetchTrainingCourseTitle 은 page/generateMetadata 와 동일 인자라 fetch memoization 으로
//   실제 네트워크는 요청당 1회(추가 조회 없음). 상세 경로가 아니거나 제목 조회 실패 시 null → 정적 폴백.
async function resolveBreadcrumbOverride(): Promise<BreadcrumbServerOverride> {
  const pathname = (await headers()).get("x-pathname");
  if (!pathname) return null;

  // 세션상세(2뎁스) 먼저 검사 — 중간 크럼(코스상세 링크) 라벨 오버라이드.
  const sessionMatch = pathname.match(TRAINING_SESSION_PATH_RE);
  if (sessionMatch) {
    const [, variant, courseId] = sessionMatch;
    const title = await fetchTrainingCourseTitle(courseId);
    if (!title) return null;
    // breadcrumbConfig 의 세션 크럼 href(`/services/{variant}-training/{courseId}`)와 정확히 일치해야 매칭됨.
    const courseHref = `/services/${variant}-training/${courseId}`;
    return { pathname, crumb: { href: courseHref, label: title } };
  }

  // 코스상세(1뎁스) — 마지막 current 텍스트 오버라이드.
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
  // GNB 트리 조회(실패 시 내부에서 빈 배열/폴백 → 정적 데이터 사용) + 트레이닝 상세면 브레드크럼 제목 조회
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
