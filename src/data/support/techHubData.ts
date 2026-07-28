// Tech Hub(Support > Tech Hub) 실데이터 조회 헬퍼
// - 데이터 소스: 신규 BE 엔드포인트(/api/v1/fo/tech-hub/*, contents_master/version/category 기반). page_data slug 아님.
// - LV1>LV2 카테고리 계층은 신규 체계를 만들지 않고 category-data(devices 카테고리)를 재사용한다
//   (productsSystemsData 의 fetchTopCategories/fetchCategoryChildren — category.code 반환).
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
import { fetchApi } from "@/lib/api";
import { fetchData } from "@/lib/pageDataApi";
import { flattenPageDataItem } from "@/lib/pageData";
import {
  fetchTopCategories,
  fetchCategoryChildren,
} from "@/app/()/products-systems/data/productsSystemsData";
import { fetchDevicesTreeRows } from "@/data/gnb/devicesTree";
import { getYoutubeIdFromUrl, getYoutubePosterSrc } from "@/lib/youtubeEmbed";
import type { DownloadCategoryOption } from "@/data/support/downloadCenterContent";

// ---------------- 목록 카드 ----------------

export interface TechHubCard {
  id: number;
  title: string;
  sourceUpdatedAt: string | null;
  categoryL1Id: string | null;
  categoryL2Id: string | null;
  videoUrl: string | null;
  versionCount: number;
}

export interface TechHubContentsPage {
  content: TechHubCard[];
  totalElements: number;
  totalPages: number;
  page: number; // 0-based (BE 기준)
  size: number;
}

export interface TechHubContentsParams {
  q?: string;
  categories?: string[]; // 선택된 LV2 코드 목록
  certs?: string[]; // 선택된 인증 코드 목록("ul" / "iec"). 미전달 시 인증 조건 없음(전체).
  page?: number; // 0-based
  size?: number;
}

// 목록 조회. 실패 시 빈 페이지(섹션은 Empty 로 표시).
export async function fetchTechHubContents(
  params: TechHubContentsParams,
): Promise<TechHubContentsPage> {
  const page = params.page ?? 0;
  const size = params.size ?? 12;
  const sp = new URLSearchParams();
  if (params.q && params.q.trim()) sp.set("q", params.q.trim());
  if (params.categories && params.categories.length > 0) {
    sp.set("categories", params.categories.join(","));
  }
  // 인증 필터(CSV, 그룹 내 OR). BE 는 대소문자 무시. 미전달 시 하위호환(인증 조건 없음).
  if (params.certs && params.certs.length > 0) {
    sp.set("certs", params.certs.join(","));
  }
  sp.set("page", String(page));
  sp.set("size", String(size));
  try {
    return await fetchApi<TechHubContentsPage>(
      `/api/v1/fo/tech-hub/contents?${sp.toString()}`,
    );
  } catch {
    return { content: [], totalElements: 0, totalPages: 0, page, size };
  }
}

// ---------------- 상세(콘텐츠 = master) ----------------

// 챕터(= contents_version). 다버전 콘텐츠의 Chapter 사이드바용. chapterName = version_name(번호).
export interface TechHubChapter {
  versionId: number;
  chapterName: string | null;
  sortKey: number;
  videoUrl: string | null;
}

// 상세 응답(BE TechHubDetailResponse).
export interface TechHubDetail {
  id: number;
  title: string;
  sourceUpdatedAt: string | null;
  categoryL1Id: string | null;
  categoryL2Id: string | null;
  versionCount: number;
  chapters: TechHubChapter[]; // sort_key DESC(Chapter 1 먼저)
  relatedVideos: TechHubCard[]; // 단일버전일 때만 채워짐(동일 LV2 최신 3)
}

// 상세 조회. 미존재/미노출(BE 404) 또는 실패 시 null → 라우트에서 notFound() 처리.
export async function fetchTechHubContentDetail(
  masterId: number,
): Promise<TechHubDetail | null> {
  try {
    return await fetchApi<TechHubDetail>(
      `/api/v1/fo/tech-hub/contents/${masterId}`,
    );
  } catch {
    return null;
  }
}

// ---------------- 카테고리 건수 ----------------

export interface TechHubCategoryCount {
  categoryL2Id: string;
  count: number;
}

export async function fetchTechHubCategoryCounts(): Promise<
  TechHubCategoryCount[]
> {
  try {
    return await fetchApi<TechHubCategoryCount[]>(
      `/api/v1/fo/tech-hub/category-counts`,
    );
  } catch {
    return [];
  }
}

// ---------------- 인증(Certification) 건수 ----------------

// 인증별 실카운트 1건. certCode = "ul" / "iec"(응답 순서 ul → iec 고정).
// ⚠️ 하나의 콘텐츠가 UL/IEC 를 동시에 가질 수 있어 각 count 의 합이 전체 건수와 일치하지 않는 것이 정상이다.
export interface TechHubCertCount {
  certCode: string;
  count: number;
}

// 인증 필터 옆 건수 배지용 실카운트. 실패 시 빈 배열(호출부에서 배지 미표시).
export async function fetchTechHubCertCounts(): Promise<TechHubCertCount[]> {
  try {
    return await fetchApi<TechHubCertCount[]>(
      `/api/v1/fo/tech-hub/cert-counts`,
    );
  } catch {
    return [];
  }
}

// ---------------- LV1>LV2 필터 트리(category-data 재사용 + 건수 병합) ----------------

// 필터 아코디언용 카테고리 옵션(코드 기반). option.id = category.code(L01 / L01-02 ...).
// - 상위(LV1) = depth1, 하위(nested LV2) = depth2. 각 LV2 옆 숫자는 category-counts 병합(없으면 0).
// - 콘텐츠 0건 LV2도 그대로 노출(0 표시) — 스펙: Admin 전체 LV1>LV2 노출.
export async function fetchTechHubCategoryTree(): Promise<
  DownloadCategoryOption[]
> {
  try {
    const [tops, counts] = await Promise.all([
      fetchTopCategories(),
      fetchTechHubCategoryCounts(),
    ]);
    const countMap = new Map(counts.map((c) => [c.categoryL2Id, c.count]));

    const options = await Promise.all(
      tops.map(async (top) => {
        const children = await fetchCategoryChildren(top.id);
        const nested = children.map((child) => ({
          id: child.code,
          label: child.title,
          count: countMap.get(child.code) ?? 0,
        }));
        const total = nested.reduce((sum, n) => sum + (n.count ?? 0), 0);
        return {
          id: top.code,
          label: top.title,
          hasArrow: nested.length > 0,
          count: total,
          nested,
        } satisfies DownloadCategoryOption;
      }),
    );
    return options;
  } catch {
    return [];
  }
}

// ---------------- 제품상세 Tech Hub 배너(CommonBanner03) ----------------

// 제품상세(/product/[slug]) 하단 Tech Hub 배너에 필요한 데이터 묶음.
// - categoryCodes: 해당 제품이 속한 Lv2 카테고리 코드(복수 소속이면 합집합)
// - lv2Name: 배너 문구에 넣을 Lv2 카테고리 이름(category.title). 복수 소속이면 첫 번째를 대표로 사용
// - totalCount: 그 카테고리들의 Tech Hub 콘텐츠 총 건수(배너 건수 문구용 — 노출조건 판단에 쓰는 값과 동일)
// - latest: 그 카테고리들의 Tech Hub 콘텐츠 중 최신 1건(서버 고정 정렬 source_updated_at DESC, id DESC)
// - posterSrc: latest.videoUrl 에서 파생한 YouTube 썸네일(응답에 썸네일 필드가 없어 FE 파생 — TechHubVideoCard 와 동일 방식)
// - href: 해당 카테고리가 프리필터로 걸린 Tech Hub 목록 URL
export interface ProductTechHubBanner {
  categoryCodes: string[];
  lv2Name: string;
  totalCount: number;
  latest: TechHubCard;
  posterSrc: string | null;
  href: string;
}

// 제품상세 Tech Hub 배너(CommonBanner03) 문구 묶음. 값이 없으면 필드를 비워
// CommonBanner03 의 기본 문구(props default)가 그대로 유지되게 한다.
export interface ProductTechHubBannerCopy {
  title?: string;
  description?: string[];
  countText?: string;
}

// 배너 문구 생성 — HW 제품상세(GenericProductDetail) 전용.
// ⚠️ SW 제품상세는 기획서 포맷이 다르다(software.png). 반드시 buildSwProductTechHubBannerCopy 를 쓸 것.
// 기획서(product.png) 표기:
//   타이틀 "{Product Lv.2 Name} Video Tutorials"
//   본문   "Need help with ...? Watch step-by-step video guides for the {Product Lv.2} series in our Tech Hub."
//   건수   "{count} {Product Lv.2 Name} Video Tutorials Available"
// ⚠️ 기획서 예시의 Lv2 약어(MCCB 등)에 해당하는 필드가 데이터에 없으므로 항상 Lv2 이름을 그대로 쓴다.
// ⚠️ lv2Name 이 비면(카테고리 제목 조회 실패) 빈 객체를 돌려 기존 기본 문구를 유지한다 — 잘못된 제품명 노출 방지.
export function buildHwProductTechHubBannerCopy(
  banner: ProductTechHubBanner,
): ProductTechHubBannerCopy {
  const name = banner.lv2Name.trim();
  if (!name) return {};
  return {
    title: `${name} Video Tutorials`,
    description: [
      "Need help with installation, configuration, troubleshooting, or maintenance?",
      `Watch step-by-step video guides for the ${name} series in our Tech Hub.`,
    ],
    countText: `${banner.totalCount} ${name} Video Tutorials Available`,
  };
}

// 배너 문구 생성 — SW 제품상세(SwProductDetail) 전용. HW 와 포맷이 다르므로 함수를 분리한다.
// 기획서(software.png) 표기:
//   타이틀 "Video Tutorials"  ← Lv2 이름을 붙이지 않는 고정 문구(HW 와 다른 지점)
//   본문   "Need installation or support help? Watch video guides for {Lv2 카테고리명} in our Tech Hub."
//   건수   스펙에 없음 → countText 를 만들지 않는다(CommonBanner03 이 미전달 시 미렌더).
// 본문은 한 문장이 자연 줄바꿈되는 형태라 배열 원소 1개(= <p> 1개)로 넘긴다.
// 영상 0건이어도 문구는 그대로 적용한다(SW 배너는 노출조건 없이 항상 렌더 — 기존 동작 유지).
// lv2Name 이 비면 본문만 기본값으로 두고 고정 타이틀은 유지한다.
export function buildSwProductTechHubBannerCopy(
  lv2Name: string,
): ProductTechHubBannerCopy {
  const name = lv2Name.trim();
  return {
    title: "Video Tutorials",
    description: name
      ? [
          `Need installation or support help? Watch video guides for ${name} in our Tech Hub.`,
        ]
      : undefined,
  };
}

// 제품 → Tech Hub 배너 데이터 조회. 연결 Lv2가 없거나 해당 Lv2의 콘텐츠가 0건이면 null(호출부에서 배너 미렌더).
// ⚠️ 제품 row 에는 Lv2 코드 필드가 없다. 연결고리는 category-data depth3 junction 이며
//    fetchProductLv2Context(productsSystemsData) 와 동일한 로직을 쓴다.
//    product_code 접두사 매칭 방식은 폐기됐으므로 절대 사용하지 않는다.
// ⚠️ 이 헬퍼는 techHubData 에 둔다(productsSystemsData 에 두면 techHubData → productsSystemsData 순환 import 발생).
export async function fetchProductTechHubBanner(
  productId: number,
): Promise<ProductTechHubBanner | null> {
  try {
    // ① 제품이 속한 Lv2(page_data id) 집합 — devices-tree 의 depth3 junction 행에서 parentId 수집.
    const treeRows = await fetchDevicesTreeRows();
    const lv2Ids = new Set(
      treeRows
        .filter((r) => r.depth === "3" && r.productId === productId)
        .map((r) => r.parentId)
        .filter((p): p is string => p != null && p !== ""),
    );
    if (lv2Ids.size === 0) return null;

    // ② Lv2 page_data id → category.code/title 변환 맵(devices-tree 응답에는 둘 다 없어 한 단계 더 필요).
    //    fetchCategoryBySlug 와 동일한 fetchData + flattenPageDataItem 패턴.
    const categoryRes = await fetchData<Record<string, unknown>>({
      slug: "category-data",
      where: { "eq_category.depth": "2" },
      unpaged: true,
      리턴함수: (rows) => rows.map((item) => flattenPageDataItem(item)),
    });
    //    code 는 Tech Hub 조회 조건, title 은 배너 문구용 Lv2 이름이다(같은 응답에서 함께 뽑아 추가 조회 없음).
    const lv2ById = new Map<number, { code: string; title: string }>();
    for (const row of categoryRes.content) {
      lv2ById.set(Number(row._id), {
        code: String(row["category.code"] ?? ""),
        title: String(row["category.title"] ?? ""),
      });
    }

    // ③ id → code/title 변환. 빈 코드 제외 + 코드 기준 중복 제거.
    //    제품이 복수 Lv2에 속하면 합집합(CSV)으로 처리한다(API가 CSV OR(IN) 지원).
    const lv2List: { code: string; title: string }[] = [];
    const seenCodes = new Set<string>();
    for (const id of lv2Ids) {
      const lv2 = lv2ById.get(Number(id));
      if (!lv2 || lv2.code === "" || seenCodes.has(lv2.code)) continue;
      seenCodes.add(lv2.code);
      lv2List.push(lv2);
    }
    const codes = lv2List.map((lv2) => lv2.code);
    if (codes.length === 0) return null;
    // 배너 문구용 Lv2 이름 — 복수 Lv2 소속이면 devices-tree 등장 순 첫 번째를 대표로 쓴다.
    const lv2Name = lv2List[0]?.title ?? "";

    // ④ 최신 1건 조회. totalElements 로 존재여부, content[0] 로 최신 1건을 한 번에 얻는다.
    //    0건이면 배너 자체를 렌더하지 않는다(= null 반환).
    const latestPage = await fetchTechHubContents({
      categories: codes,
      page: 0,
      size: 1,
    });
    const latest = latestPage.content[0];
    if (latestPage.totalElements === 0 || !latest) return null;

    // ⑤ 썸네일 — videoUrl 에서 videoId 파생 실패/미입력이면 null(호출부에서 기본 정적 이미지 폴백).
    const videoId = latest.videoUrl ? getYoutubeIdFromUrl(latest.videoUrl) : "";
    const posterSrc = videoId ? getYoutubePosterSrc(videoId) : null;

    // ⑥ 카테고리 프리필터가 걸린 Tech Hub 목록 URL(CSV). 코드 각각을 인코딩하고 구분자 콤마는 유지한다.
    const href = `/support/tech-hub?categories=${codes
      .map((code) => encodeURIComponent(code))
      .join(",")}`;

    // totalCount 는 ④에서 이미 받은 값을 그대로 넘긴다(건수 문구 전용 추가 조회 없음).
    return {
      categoryCodes: codes,
      lv2Name,
      totalCount: latestPage.totalElements,
      latest,
      posterSrc,
      href,
    };
  } catch {
    // 기존 헬퍼 관례와 동일 — 조회 실패 시 null(배너 미렌더)
    return null;
  }
}
