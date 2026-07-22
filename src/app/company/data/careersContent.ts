import { flattenPageDataItem, type PageDataItem } from "@/lib/pageData";
import { fetchData } from "@/lib/pageDataApi";

const IMG = "/img/company/careers";

export const careersPageTitle = {
  title: "Careers at LS ELECTRIC America",
  description:
    "We're looking for exceptional talent to grow and dream together with LS ELECTRIC.",
} as const;

export const careersLinkedInCta = {
  label: "Go to LinkedIn",
  href: "https://www.linkedin.com/company/lselectricamerica/jobs/",
} as const;

export const careersJobsSection = {
  title: "Job Description",
  backgroundImage: `${IMG}/jobs-bg.png`,
} as const;

// ---------------- PageData(slug: careers-data) 실데이터 연동 ----------------
// 설계 근거: fo/docs/dev/company/careers-data.md (STEP3/STEP4 확정, 신규 API 없음)
// 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지)
// 공통 계층 근거: fo/docs/FO-RULE.md 핵심원칙 9 — 화면 전용 fetchXxx 신규 작성 금지,
//   실제 조회/매핑/정렬은 전부 공통 계층 fetchData + 리턴함수가 수행한다.
//   선례: fo/src/app/company/data/eventsData.ts(eventsFeaturedQuery 등) — 리턴함수 콜백 안에서
//   flatten + 가공 + 정렬을 캡슐화한다. 아래 fetchCareersJobs도 동일하게 fetchData 위임만 한다.

// 화면 바인딩용 채용공고 1건.
// sort는 DB에 문자열로 저장되어 있어 원본 문자열 그대로 보관하고, 정렬 시 Number로 캐스팅한다.
// updatedAt은 sort 동률일 때 최신순(DESC) tie-breaker 용도.
// ⚠️ BO(dataJson.careers) 실제 필드명은 `sort_order`다. 내부 타입 필드명은 `sort`로 유지하되,
//    API 응답 매핑은 반드시 `row.sort_order`에서 읽어야 한다(toCareersJob 참고).
export type CareersJob = {
  id: string;
  title: string;
  description: string;
  sort: string;
  isVisible: string;
  updatedAt: string;
};

// API 원본 1건 → 화면 바인딩용 CareersJob 가공.
// careers 단일 섹션이라 flattenPageDataItem 후 필드가 root로 병합됨(title/description/sort_order/is_visible).
// ⚠️ BO 실제 필드명은 `sort_order`다(라이브 API 응답 실측). `row.sort`가 아니라 `row.sort_order`에서 읽어야
//    정렬(sortCareersJobs)이 정상 동작한다. 내부 타입 필드명만 sort로 유지한다.
function toCareersJob(item: PageDataItem): CareersJob {
  const row = flattenPageDataItem(item);
  return {
    id: String(item.id),
    title: (row.title as string) ?? "",
    description: (row.description as string) ?? "",
    sort: (row.sort_order as string) ?? "",
    isVisible: (row.is_visible as string) ?? "",
    updatedAt: (row.updatedAt as string) ?? "",
  };
}

// 클라이언트 정렬: sort 오름차순(숫자 캐스팅), 동률이면 updatedAt DESC(최신순).
// sort가 비어있거나 숫자가 아니면 맨 뒤로 밀어 표시(방어).
// ASC 정렬이므로 결측치는 최댓값(MAX_SAFE_INTEGER)으로 취급해야 맨 뒤로 밀린다.
// (서버 sort는 sort_order가 문자열이라 사전식 정렬 오류 → 서버 정렬 미사용, 클라이언트에서 처리)
function sortCareersJobs(jobs: CareersJob[]): CareersJob[] {
  return [...jobs].sort((a, b) => {
    const na = Number(a.sort);
    const nb = Number(b.sort);
    const sa = Number.isFinite(na) ? na : Number.MAX_SAFE_INTEGER;
    const sb = Number.isFinite(nb) ? nb : Number.MAX_SAFE_INTEGER;
    if (sa !== sb) return sa - sb;
    // updatedAt은 ISO 문자열 → 문자열 비교로 최신순(b, a 순서)
    return (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "");
  });
}

// 공개 채용공고 목록 조회 후 클라이언트 정렬까지 적용해서 반환.
// 실제 조회/매핑/정렬은 공통 계층 fetchData + 리턴함수가 수행하고, 이 함수는 단순 위임만 한다.
// - slug: careers-data, size 100(다건)
// - where: eq_careers.is_visible=001 — dot-notation(섹션키 careers) 표기 유지(STEP4 확정, eq_is_visible로 바꾸지 말 것)
// - 공개 필터는 서버 where가 처리하므로 리턴함수 내 추가 필터 없음(events-data.ts 선례)
// - sort는 서버에 위임하지 않고(문자열 sort_order의 사전식 정렬 오류 회피) 리턴함수에서 클라이언트 정렬
export async function fetchCareersJobs(): Promise<CareersJob[]> {
  const res = await fetchData<CareersJob>({
    slug: "careers-data",
    size: 100,
    where: { "eq_careers.is_visible": "001" },
    리턴함수: (rows: PageDataItem[]): CareersJob[] =>
      sortCareersJobs(rows.map(toCareersJob)),
  });
  return res.content;
}

export const careersLinkedInBanner = {
  backgroundImage: `${IMG}/linkedin-banner.jpg`,
  backgroundImageMo: `${IMG}/linkedin-banner-mo.jpg`,
  title: "Explore Open Positions on LinkedIn",
  titleMo: ["Explore Open Positions ", "on LinkedIn"] as const,
  description: [
    "Discover your next career opportunity with LS ELECTRIC America.",
    "Visit our official LinkedIn page to view all current job openings, explore our company culture, and apply to join our team of industry innovators.",
  ],
  descriptionMo:
    "Discover your next career opportunity with LS ELECTRIC America. Visit our official LinkedIn page to view all current job openings, explore our company culture, and apply to join our team of industry innovators.",
  cta: careersLinkedInCta,
} as const;
