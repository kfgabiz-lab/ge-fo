// Warranty Policy 제품 보증표(coverage.tableRows) 데이터 조회 헬퍼
// - WarrantyPolicyCoverage(서버 컴포넌트)에서 보증표 <tbody> 행만 이 결과로 렌더한다.
//   (title/cards/notes 등 그 외 섹션은 정적 데이터 warrantyPolicyContent.ts 유지)
// - 설계 문서: fo/docs/dev/services/warrantyPolicy-data.md
// - 재사용 엔드포인트(신규 BE 없음): GET /api/v1/fo/page-data/warrantyPolicy-data
//   헤더 X-Site-Id: 1, size=100(전건). BE에 eq_/sort 미적용(2세대 필드 혼재로 구세대 누락 방지)
//   → 전건 조회 후 FE에서 필터(is_visible=001)·정렬(id ASC)·코드라벨 변환 수행
// - flatten fallback: dataJson.warranty_policy(신 snake_case) ?? dataJson.warrantyPolicyForm(구 camelCase)
//   (bo 2026-07-13 폼키 변경으로 2세대 혼재 → 양세대 영구 fallback. 설계 문서 6번 비고)
import { fetchApi } from "@/lib/api";

// bo dataJson 내부 폼 필드 — 신/구 세대 필드명 혼재(fallback 대상)
interface WarrantyPolicyFormFields {
  product_name?: string;
  productNm?: string;
  product_type?: string;
  productType?: string;
  warranty_period?: string;
  warrantyPeriod?: string;
  is_visible?: string;
  isVisible?: string;
}

// page-data 레코드 1건의 dataJson — content key 도 신/구 혼재
interface WarrantyPolicyDataJson {
  warranty_policy?: WarrantyPolicyFormFields;
  warrantyPolicyForm?: WarrantyPolicyFormFields;
}

// bo-api page-data 목록 응답(PageDataListResponse) — content 배열만 사용
interface WarrantyPolicyListResponse {
  content?: Array<{
    id: number;
    dataJson?: WarrantyPolicyDataJson;
  }>;
}

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
  let res: WarrantyPolicyListResponse;
  try {
    // BE eq_/sort 미적용(전건). X-Site-Id: 1 은 공통 fetchApi에서 전역 주입되므로 여기서 별도 지정 불필요
    res = await fetchApi<WarrantyPolicyListResponse>(
      "/api/v1/fo/page-data/warrantyPolicy-data?size=100",
    );
  } catch {
    // fetch 실패 시 빈 목록 폴백(표 구조는 유지)
    return [];
  }

  return (res.content ?? [])
    .map((item) => {
      const d =
        item.dataJson?.warranty_policy ??
        item.dataJson?.warrantyPolicyForm ??
        {};
      return {
        id: item.id,
        productName: d.product_name ?? d.productNm ?? "",
        productType: d.product_type ?? d.productType ?? "",
        warranty: d.warranty_period ?? d.warrantyPeriod ?? "",
        isVisible: d.is_visible ?? d.isVisible ?? "",
      };
    })
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
