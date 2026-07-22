// Warranty Policy 제품 보증표(coverage.tableRows) 데이터 조회 헬퍼
// - WarrantyPolicyCoverage(서버 컴포넌트)에서 보증표 <tbody> 행만 이 결과로 렌더한다.
//   (title/cards/notes 등 그 외 섹션은 정적 데이터 warrantyPolicyContent.ts 유지)
// - 설계 문서: fo/docs/dev/services/warrantyPolicy-data.md
// - 재사용 엔드포인트(신규 BE 없음): GET /api/v1/fo/page-data/warrantyPolicy-data
//   헤더 X-Site-Id: 1, size=100(전건). BE에 eq_/sort 미적용(2세대 필드 혼재로 구세대 누락 방지)
//   → 전건 조회 후 FE에서 필터(is_visible=001)·정렬(id ASC)·코드라벨 변환 수행
// - 필드 fallback: 신 snake_case(product_name 등) ?? 구 camelCase(productNm 등)
//   (bo 2026-07-13 폼키 변경으로 2세대 혼재 → pickField로 양세대 영구 fallback. 설계 문서 6번 비고)
// - 조회/매핑 계층: 공통 fetchData(slug 조회)로 호출하고, flatten된 row는 pickField로 읽는다.
//   (fo-data-binding-가이드.md 4절 "공통 조회+매핑 계층" — 컴포넌트/헬퍼에서 URL 손조립·수동 언랩 금지)
import { fetchData } from "@/lib/pageDataApi";
import { pickField } from "@/lib/pageData";

// 보증표 1행 렌더 모델(WarrantyPolicyCoverage tbody 에서 사용)
export interface WarrantyCoverageRow {
  id: string;
  product: string;
  category: string;
  warranty: string;
}

// PRODUCTTYPE 코드 → 영문 라벨(FO는 정적 영문 페이지, i18n/코드메시지 인프라 없음 → 하드코딩 맵)
// 설계 문서 6번 비고 3: FoCodeController 는 한글만 반환해 부적합
const PRODUCT_TYPE_LABEL: Record<string, string> = {
  "001": "Power Production",
  "002": "Power Orders",
  "003": "Automation",
};

// 제품 보증표 행 목록 조회.
// 조회 실패/빈 응답 시 빈 배열 → 보증표는 빈 tbody 로 렌더(표 구조는 유지, 화면 깨지지 않음).
export async function fetchWarrantyCoverageRows(): Promise<WarrantyCoverageRow[]> {
  let content: Record<string, unknown>[];
  try {
    // BE eq_/sort 미적용(전건). X-Site-Id: 1 은 공통 fetchApi에서 전역 주입되므로 여기서 별도 지정 불필요.
    // content는 이미 flatten된 row 배열(섹션 warranty_policy/warrantyPolicyForm이 root에 병합됨).
    const res = await fetchData({ slug: "warrantyPolicy-data", size: 100 });
    content = res.content;
  } catch {
    // fetch 실패 시 빈 목록 폴백(표 구조는 유지)
    return [];
  }

  return content
    .map((row) => ({
      id: row._id as number,
      productName: (pickField(row, "product_name", "productNm") as string) ?? "",
      productType: (pickField(row, "product_type", "productType") as string) ?? "",
      warranty: (pickField(row, "warranty_period", "warrantyPeriod") as string) ?? "",
      isVisible: (pickField(row, "is_visible", "isVisible") as string) ?? "",
    }))
    // 1) 공개(001)만 통과
    .filter((row) => row.isVisible === "001")
    // 2) id 오름차순
    .sort((a, b) => a.id - b.id)
    // 3)~4) 코드라벨 변환 + 표 행 매핑
    .map((row) => ({
      id: String(row.id),
      product: row.productName,
      // 매칭되는 코드가 없으면 원문 코드 유지
      category: PRODUCT_TYPE_LABEL[row.productType] ?? row.productType,
      warranty: row.warranty,
    }));
}
