// Discover Our Products 섹션(MainProducts) 데이터 조회 헬퍼
// - 서버 컴포넌트(MainProducts)에서 호출하여 결과를 클라이언트 컴포넌트(MainProductsClient)에 props 로 전달
// - 설계 문서: fo/docs/dev/main/prdGrp-data.md
// - BE(STEP5): GET /api/v1/fo/product-groups (bo-api, 쿼리파라미터 없음)
//   · 그룹은 이미 isVisible=001 필터 + prdGrpOrd ASC, id ASC 정렬 상태로 내려옴
//   · ms(제품)도 이미 sortOrder ASC, id ASC 정렬 + dangling 제거 상태로 내려옴 → FE 추가 필터/정렬 불필요
import { fetchApi } from "@/lib/api";

// 그룹 내부 제품 1건(ms 배열 요소) — BE 응답 원본(flatten) 구조
export interface FoProductGroupItem {
  id: number;
  productNm: string;
  prdSubDesc: string;
  // 수상 코드값(빈 문자열 가능). 값 존재 시 배지 노출(라벨 변환 불필요)
  awards: string;
  // 대표 이미지 URL. 미입력 시 null → 화면에서 플레이스홀더 폴백
  image: string | null;
  // SEO 슬러그. 미입력 시 null → 링크 비활성화
  slug: string | null;
  // BE(FoProductGroupResponse.Product)가 원본 문자열로 응답 — 숫자 변환은 BE 정렬 시에만 사용, 응답은 문자열 유지
  sortOrder: string;
}

// 제품 그룹 1건(prdGrp-data) — BE 응답 원본 구조
export interface FoProductGroupResponse {
  id: number;
  prdGrpNm: string;
  // BE(FoProductGroupResponse)가 원본 문자열로 응답
  prdGrpOrd: string;
  ms: FoProductGroupItem[];
}

// 제품 그룹 목록 조회(쿼리파라미터 없음, 배열 직접 반환).
// 조회 실패/빈 응답 시 빈 배열 → 호출부(MainProducts)에서 섹션 미렌더링 처리.
export async function fetchProductGroups(): Promise<FoProductGroupResponse[]> {
  const res = await fetchApi<FoProductGroupResponse[]>(
    "/api/v1/fo/product-groups",
  );
  return res ?? [];
}
