// Tech Hub(Support > Tech Hub) 실데이터 조회 헬퍼
// - 데이터 소스: 신규 BE 엔드포인트(/api/v1/fo/tech-hub/*, contents_master/version/category 기반). page_data slug 아님.
// - LV1>LV2 카테고리 계층은 신규 체계를 만들지 않고 category-data(devices 카테고리)를 재사용한다
//   (productsSystemsData 의 fetchTopCategories/fetchCategoryChildren — category.code 반환).
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
import { fetchApi } from "@/lib/api";
import {
  fetchTopCategories,
  fetchCategoryChildren,
} from "@/app/()/products-systems/data/productsSystemsData";
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
