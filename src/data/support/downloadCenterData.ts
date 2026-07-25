// Download Center(Support > Download Center) 실데이터 조회 헬퍼
// - 데이터 소스: 신규 BE 엔드포인트(/api/v1/fo/download-center/*, contents_master/version/file/category 기반). page_data slug 아님.
// - LV1>LV2 카테고리 계층은 신규 체계를 만들지 않고 category-data(devices 카테고리)를 재사용한다
//   (productsSystemsData 의 fetchTopCategories/fetchCategoryChildren — category.code 반환). Tech Hub 와 동일 사상.
// - 파일 다운로드/URL 복사는 기존 CTP 엔드포인트(GET /api/v1/fo/ctpApi/fileDownUrl)를 그대로 재사용한다.
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi/fetchApiText 경유)
import { fetchApi, fetchApiText } from "@/lib/api";
import {
  fetchTopCategories,
  fetchCategoryChildren,
} from "@/app/()/products-systems/data/productsSystemsData";
import type { DownloadCategoryOption } from "@/data/support/downloadCenterContent";

// ---------------- 응답 타입(BE DownloadCenter* record 와 1:1) ----------------

// 파일 1건(contents_file). filePath 를 CTP 다운로드 엔드포인트에 넘겨 fresh SAS URL 을 발급받는다.
export interface DownloadCenterFile {
  fileId: number | null;
  fileName: string | null;
  fileExt: string | null;
  fileSize: number | null;
  fileSizeText: string | null;
  sourceSystem: string | null;
  filePath: string | null;
}

// 버전 1건(contents_version). files = 해당 버전 노출 파일. sortKey 클수록 최신.
export interface DownloadCenterVersion {
  versionId: number;
  versionName: string | null;
  sortKey: number;
  files: DownloadCenterFile[];
}

// 카드 1건(contents_master). versions 는 sortKey DESC(최신 먼저).
export interface DownloadCenterItem {
  id: number;
  docType: string | null;
  docTypeLabel: string | null;
  title: string | null;
  date: string | null; // YYYY-MM-DD(nullable)
  categoryL1Id: string | null;
  categoryL2Id: string | null;
  versions: DownloadCenterVersion[];
}

export interface DownloadCenterContentsPage {
  content: DownloadCenterItem[];
  totalElements: number;
  totalPages: number;
  page: number; // 0-based(BE 기준)
  size: number;
}

// 정렬 파라미터 — "" 는 미지정(BE 기본 newest).
export type DownloadCenterSort = "" | "newest" | "oldest" | "title";

export interface DownloadCenterContentsParams {
  q?: string;
  categories?: string[]; // 선택된 LV2 코드 목록(그룹 내 OR)
  docTypes?: string[]; // 선택된 문서유형 코드 목록(C/M/D/S/R/O)
  sort?: DownloadCenterSort;
  page?: number; // 0-based
  size?: number;
}

// 목록 조회. 실패 시 빈 페이지(섹션은 Empty 로 표시).
export async function fetchDownloadCenterContents(
  params: DownloadCenterContentsParams,
): Promise<DownloadCenterContentsPage> {
  const page = params.page ?? 0;
  const size = params.size ?? 12;
  const sp = new URLSearchParams();
  if (params.q && params.q.trim()) sp.set("q", params.q.trim());
  if (params.categories && params.categories.length > 0) {
    sp.set("categories", params.categories.join(","));
  }
  if (params.docTypes && params.docTypes.length > 0) {
    sp.set("docTypes", params.docTypes.join(","));
  }
  if (params.sort) sp.set("sort", params.sort);
  sp.set("page", String(page));
  sp.set("size", String(size));
  try {
    return await fetchApi<DownloadCenterContentsPage>(
      `/api/v1/fo/download-center/contents?${sp.toString()}`,
    );
  } catch {
    return { content: [], totalElements: 0, totalPages: 0, page, size };
  }
}

// ---------------- 카테고리 건수 ----------------

export interface DownloadCenterCategoryCount {
  categoryL2Id: string;
  count: number;
}

export async function fetchDownloadCenterCategoryCounts(): Promise<
  DownloadCenterCategoryCount[]
> {
  try {
    return await fetchApi<DownloadCenterCategoryCount[]>(
      `/api/v1/fo/download-center/category-counts`,
    );
  } catch {
    return [];
  }
}

// ---------------- 문서유형(Document Type) 건수 ----------------

// 문서유형별 실카운트 1건. docType = BE 코드(C/M/D/S/R/O). OS/Firmware 는 대응 코드가 없어 응답에 포함되지 않는다.
export interface DownloadCenterDocTypeCount {
  docType: string;
  docTypeLabel: string;
  count: number;
}

// 문서유형 필터 옆 건수 배지용 실카운트. 실패 시 빈 배열(호출부에서 정적 폴백).
export async function fetchDownloadCenterDocTypeCounts(): Promise<
  DownloadCenterDocTypeCount[]
> {
  try {
    return await fetchApi<DownloadCenterDocTypeCount[]>(
      `/api/v1/fo/download-center/doctype-counts`,
    );
  } catch {
    return [];
  }
}

// ---------------- LV1>LV2 필터 트리(category-data 재사용 + 건수 병합) ----------------

// 필터 아코디언용 카테고리 옵션(코드 기반). option.id = category.code(L01 / L01-02 ...).
// - 상위(LV1) = depth1, 하위(nested LV2) = depth2. 각 LV2 옆 숫자는 category-counts 병합(없으면 0).
// - 콘텐츠 0건 LV2도 그대로 노출(0 표시) — Admin 전체 LV1>LV2 노출. Tech Hub fetchTechHubCategoryTree 와 동일 구조.
export async function fetchDownloadCenterCategoryTree(): Promise<
  DownloadCategoryOption[]
> {
  try {
    const [tops, counts] = await Promise.all([
      fetchTopCategories(),
      fetchDownloadCenterCategoryCounts(),
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

// ---------------- 파일 다운로드/URL 복사(CTP fresh URL 발급) ----------------

// filePath(예: "CTP/Catalog/UL_VCB_EN_C050E2-12-202512.pdf") → 그때그때 발급되는 fresh 다운로드 URL.
// - 기존 CtpFileDownloadController(String 반환, text/plain)라 fetchApiText 로 받는다.
// - 로컬 개발환경에서는 외부 CTP 연동이 안 되어 500 이 날 수 있다(인프라 제약). 호출부에서 try/catch 로 방어한다.
// - 실패/빈 경로 시 "" 반환.
export async function fetchDownloadCenterFileUrl(
  filePath: string | null | undefined,
): Promise<string> {
  if (!filePath) return "";
  try {
    const text = await fetchApiText(
      `/api/v1/fo/ctpApi/fileDownUrl?filePath=${encodeURIComponent(filePath)}`,
    );
    // text/plain 이 아닌 JSON 문자열("...")로 오는 환경 대비 앞뒤 따옴표 제거.
    return text.replace(/^"|"$/g, "").trim();
  } catch {
    return "";
  }
}
