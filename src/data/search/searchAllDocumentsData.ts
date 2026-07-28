// 통합검색(/search) All 탭 "Documents" 섹션 실검색 헬퍼.
// - 검색 결과: 신규 BE 엔드포인트 GET /api/v1/fo/download-center/search?q=&limit= (STEP5 구현). page_data slug 아님.
//   응답 { total, items: DownloadCenterItem[] } — item 타입은 Download Center 와 동일하므로 DownloadCenterItem 을 재사용한다.
// - 카테고리 라벨(Lv1 > Lv2): Download Center 와 동일하게 category-data(devices 카테고리) 코드를 재사용한다.
//   item.categoryL1Id / categoryL2Id (== category.code) → 카테고리 트리에서 title 매핑. 매핑 안 되는 항목은 빈 문자열.
//   ※ Product 섹션은 devices-tree(productId) 기반이지만 Documents 는 category-data code 기반(다른 소스)이다.
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
import { fetchApi } from "@/lib/api";
import {
  fetchTopCategories,
  fetchCategoryChildren,
} from "@/app/()/products-systems/data/productsSystemsData";
import type { DownloadCenterItem } from "@/data/support/downloadCenterData";

// 검색 API 응답 본문(= bo-api DownloadCenterSearchResponse). items = DownloadCenterItem 그대로.
interface DownloadCenterSearchResponse {
  total: number;
  items: DownloadCenterItem[];
}

// 화면 사용 아이템 = DownloadCenterItem + 조립된 카테고리 라벨.
export interface SearchDocumentItem extends DownloadCenterItem {
  // "Lv1 > Lv2" 조립 결과. 매핑 안 되는(코드 없는/트리에 없는) 항목은 빈 문자열.
  categoryLabel: string;
}

// 화면 사용 결과: total(탭/헤더 카운트용) + 카테고리 라벨을 덧붙인 items.
export interface SearchAllDocumentsResult {
  total: number;
  items: SearchDocumentItem[];
}

// category-data(devices 카테고리) 전체 코드 → title 맵. Lv1(top) + Lv2(child) 모두 포함.
// - Download Center 의 fetchDownloadCenterCategoryTree 와 동일 원천(fetchTopCategories/fetchCategoryChildren).
// - 실패 시 빈 맵(라벨 전부 공백).
async function fetchCategoryCodeTitleMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const tops = await fetchTopCategories();
    tops.forEach((top) => {
      if (top.code) map.set(top.code, top.title ?? "");
    });
    const childLists = await Promise.all(
      tops.map((top) => fetchCategoryChildren(top.id)),
    );
    childLists.forEach((children) => {
      children.forEach((child) => {
        if (child.code) map.set(child.code, child.title ?? "");
      });
    });
  } catch {
    /* 카테고리 트리 조회 실패 — 빈 맵 반환(라벨 공백) */
  }
  return map;
}

// categoryL1Id / categoryL2Id(== category.code) → "Lv1 > Lv2". 매핑 실패한 레벨은 생략.
function buildCategoryLabel(
  codeTitle: Map<string, string>,
  categoryL1Id: string | null,
  categoryL2Id: string | null,
): string {
  const lv1 = (categoryL1Id && codeTitle.get(categoryL1Id)) || "";
  const lv2 = (categoryL2Id && codeTitle.get(categoryL2Id)) || "";
  return [lv1, lv2].filter(Boolean).join(" > ");
}

// All 탭 Documents 섹션 검색. q 빈값이면 호출 없이 빈 결과.
// - 검색 API + 카테고리 트리 병렬 조회. 실패/에러 시 빈 결과(화면 방어). 섹션 자체 미표시는 호출부에서 판단.
export async function fetchSearchAllDocuments(
  query: string,
  limit = 10,
): Promise<SearchAllDocumentsResult> {
  const q = query.trim();
  if (!q) return { total: 0, items: [] };

  try {
    const [res, codeTitle] = await Promise.all([
      fetchApi<DownloadCenterSearchResponse>(
        `/api/v1/fo/download-center/search?q=${encodeURIComponent(q)}&limit=${limit}`,
      ),
      fetchCategoryCodeTitleMap(),
    ]);

    const apiItems = Array.isArray(res?.items) ? res.items : [];
    const items: SearchDocumentItem[] = apiItems.map((it) => ({
      ...it,
      categoryLabel: buildCategoryLabel(
        codeTitle,
        it.categoryL1Id,
        it.categoryL2Id,
      ),
    }));

    return { total: typeof res?.total === "number" ? res.total : 0, items };
  } catch {
    return { total: 0, items: [] };
  }
}
