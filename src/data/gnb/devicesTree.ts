// devices-tree 단일 엔드포인트(GET /api/v1/fo/gnb/devices-tree) 공통 모듈.
// GNB 메가메뉴(fromCategoryData.ts)와 Contact Us 제품 카테고리 드롭다운이 동일한
// flat 행 타입 + 조회 함수를 공유하기 위해 이곳으로 추출했다(중복 정의 금지 규칙).
import { fetchApi } from "@/lib/api";

// devices-tree 엔드포인트 응답의 평평한 행 1개(= bo-api DevicesTreeRowResponse).
// depth1/2 행: category* 필드 + sortOrder 채워짐, product* 필드 null.
// depth3 행: product* 필드 채워짐, categoryTitle/categorySlug null. parentId 는 depth 공통.
export interface DevicesTreeRow {
  rowId: number | null;
  depth: string | null;
  parentId: string | null;
  categoryTitle: string | null;
  categorySlug: string | null;
  // 카테고리 설명 원본. "\n" 으로 줄바꿈된 일반 텍스트이며 값이 없으면 null.
  categoryDescription: string | null;
  sortOrder: string | null;
  productId: number | null;
  productSlug: string | null;
  productTitle: string | null;
  productDescription: string | null;
  productImage: string | null;
}

// devices-tree 단일 조회. X-Site-Id 헤더는 fetchApi 가 전역 주입(site_id=1)하므로 별도 지정 불필요.
// 실패 시 [] 반환(호출부가 정적 폴백 여부를 판단).
export async function fetchDevicesTreeRows(): Promise<DevicesTreeRow[]> {
  try {
    return await fetchApi<DevicesTreeRow[]>("/api/v1/fo/gnb/devices-tree");
  } catch {
    return [];
  }
}
