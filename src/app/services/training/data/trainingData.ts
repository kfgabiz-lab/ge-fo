// Training Curriculum(slug: currMgmt-data) 데이터 조회 헬퍼 + 타입
// - 설계 문서: fo/docs/dev/services/currMgmt-data.md
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - 참고 패턴: fo/src/app/company/data/blogData.ts (STATUS_WHERE 상수 / toXxxCard·xxxDetailHref 헬퍼 / 코드그룹 fetchApi)
import { fetchApi } from "@/lib/api";
import { flattenPageDataItem, type PageDataItem } from "@/lib/pageData";
import { fetchData } from "@/lib/pageDataApi";
import type { TrainingFilterOption, TrainingVariant } from "./trainingContent";

// 목록 slug 및 페이지당 개수(설계 4절: size=10 페이지네이션)
export const TRAINING_SLUG = "currMgmt-data";
export const TRAINING_LIST_SIZE = 10;

// Lv/Sub Category 옵션 파생용 카테고리 트리 slug(depth3 제품 노드 조회)
export const TRAINING_CATEGORY_SLUG = "category-data";

// variant → curriculum.training_course 코드(설계 4절)
export const TRAINING_COURSE_CODE: Record<TrainingVariant, string> = {
  sales: "03",
  engineering: "01",
  service: "02",
};

// 업로드 미디어 스트리밍 엔드포인트(curriculum.image[0] → page-files)
export const trainingImageSrc = (mediaId: number) =>
  `/api/v1/fo/page-files/${mediaId}`;

// 상세 페이지 라우트(id 기반, detailHrefPrefix는 variant별로 주입)
export const trainingDetailHref = (prefix: string, id: number) =>
  `${prefix}/${id}`;

// variant 고정 where — training_course(variant별) + is_visible=001(공개 게이트, variant 무관)
export function trainingStatusWhere(
  variant: TrainingVariant,
): Record<string, string> {
  return {
    "eq_curriculum.training_course": TRAINING_COURSE_CODE[variant],
    "eq_curriculum.is_visible": "001",
  };
}

// ---------------- 응답 원본 타입 ----------------

// page-data 응답 1건. flatten 시 curriculum 단일 섹션 필드(title/description/image/product_category)가 root로 병합됨.
export type TrainingRow = PageDataItem;

// 코드그룹(PRODUCTCATEGORY) 응답 항목
export interface CodeItem {
  code: string;
  name: string;
}

// ---------------- 화면 카드 바인딩용(가공 완료) ----------------

export interface TrainingCardItem {
  id: number;
  categoryCode: string; // product_category 코드(P/A)
  categoryLabel: string; // PRODUCTCATEGORY 코드→라벨(Power/Automation) 변환 결과
  title: string;
  description: string;
  imageSrc: string | null; // 미디어 미등록 시 null → 호출부에서 정적 폴백
}

// ---------------- 순수 가공 헬퍼 ----------------

// 코드 목록 → code→name 맵
export function toCategoryMap(codes: CodeItem[]): Map<string, string> {
  return new Map((codes ?? []).map((c) => [c.code, c.name]));
}

// Category select 옵션 = UI 전용 "All"(빈 값) + PRODUCTCATEGORY 코드 목록.
// - value 는 코드값(P/A) 그대로 사용해 where(eq_curriculum.product_category)와 직접 맞물림, 라벨은 API name 사용.
// - 빈 값="전체" 관례는 company blog 카테고리 툴바(CompanyBlogListToolbar)와 동일.
export function toCategoryOptions(
  codes: CodeItem[],
): { value: string; label: string }[] {
  return [
    { value: "", label: "All" },
    ...(codes ?? []).map((c) => ({ value: c.code, label: c.name })),
  ];
}

// 원본 행 → 카드 항목(코드→라벨 변환은 categoryMap 사용)
export function toTrainingCard(
  item: TrainingRow,
  categoryMap: Map<string, string>,
): TrainingCardItem {
  // flattenPageDataItem: curriculum 단일 섹션 → title/description/image/product_category 전부 root로 flat
  const row = flattenPageDataItem(item);
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0
      ? (imageArr[0] as number)
      : null;
  const code = (row.product_category as string) ?? "";
  return {
    id: item.id,
    categoryCode: code,
    // 코드 매칭 실패 시 원본 코드값 유지(빈 값보다 정보 손실 적음)
    categoryLabel: categoryMap.get(code) ?? code,
    title: (row.title as string) ?? "",
    description: (row.description as string) ?? "",
    imageSrc: mediaId != null ? trainingImageSrc(mediaId) : null,
  };
}

// ---------------- Lv/Sub Category 파생용 카테고리 노드 ----------------

// category-data(depth3 제품 노드) 1건을 화면 파생에 필요한 필드만 정규화한 타입.
// - dataJson 최상위에 예외 없이 채워지는 _fetchedRel{17,19,20,21} + product 섹션 사용.
// - flattenPageDataItem 적용 시 _fetchedRel*는 최상위 문자열이라 그대로, product_name은 dot-notation 섹션키로 접근.
export interface TrainingCategoryNode {
  hasTraining: string; // _fetchedRel17: "001"=공개(training 노출)/"002"=비공개
  depth1Title: string; // _fetchedRel20: depth1 카테고리 타이틀
  depth2Title: string; // _fetchedRel19: depth2 카테고리 타이틀
  productType: string; // _fetchedRel21: "P"=Power / "A"=Automation
  productName: string; // product.product_name: depth3 제품명
}

// flatten row → 정규화 노드
function toCategoryNode(row: Record<string, unknown>): TrainingCategoryNode {
  return {
    hasTraining: String(row._fetchedRel17 ?? ""),
    depth1Title: String(row._fetchedRel20 ?? ""),
    depth2Title: String(row._fetchedRel19 ?? ""),
    productType: String(row._fetchedRel21 ?? ""),
    productName: String(row["product.product_name"] ?? ""),
  };
}

// 게이트: 공개(has_training="001") + product_type 일치 노드만 통과
function gateNodes(
  nodes: TrainingCategoryNode[],
  productType: string,
): TrainingCategoryNode[] {
  return nodes.filter(
    (n) => n.productType === productType && n.hasTraining === "001",
  );
}

// 문자열 목록 → 셀렉트 옵션(value=label=원본 타이틀, 중복 제거, 빈 값 제외, 입력 순서 유지)
function distinctOptions(values: string[]): TrainingFilterOption[] {
  const seen = new Set<string>();
  const out: TrainingFilterOption[] = [];
  for (const v of values) {
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push({ value: v, label: v });
  }
  return out;
}

// Lv Category 옵션 파생(순수 함수)
// - Power(P): 게이트 통과 행의 depth1 타이틀(_fetchedRel20)
// - Automation(A): 게이트 통과 행의 depth2 타이틀(_fetchedRel19)
// - All(""): 옵션 없음
export function toLvCategoryOptions(
  nodes: TrainingCategoryNode[],
  category: string,
): TrainingFilterOption[] {
  if (category === "P") {
    return distinctOptions(gateNodes(nodes, "P").map((n) => n.depth1Title));
  }
  if (category === "A") {
    return distinctOptions(gateNodes(nodes, "A").map((n) => n.depth2Title));
  }
  return [];
}

// Sub Category 옵션 파생(순수 함수) — Lv Category 선택값(lvValue)으로 추가 필터
// - Power(P): 게이트 + (lvValue 있으면 depth1==lvValue) 행의 depth2 타이틀(_fetchedRel19)
// - Automation(A): 게이트 + (lvValue 있으면 depth2==lvValue) 행의 제품명(product.product_name)
// - All(""): 옵션 없음
export function toSubCategoryOptions(
  nodes: TrainingCategoryNode[],
  category: string,
  lvValue: string,
): TrainingFilterOption[] {
  if (category === "P") {
    const gated = gateNodes(nodes, "P").filter(
      (n) => !lvValue || n.depth1Title === lvValue,
    );
    return distinctOptions(gated.map((n) => n.depth2Title));
  }
  if (category === "A") {
    const gated = gateNodes(nodes, "A").filter(
      (n) => !lvValue || n.depth2Title === lvValue,
    );
    return distinctOptions(gated.map((n) => n.productName));
  }
  return [];
}

// ---------------- 조회 함수 ----------------

// 카테고리 라벨용 코드그룹 조회(page-data 조회가 아닌 codes API라 fetchData 대상 아님)
export async function fetchTrainingCategories(): Promise<CodeItem[]> {
  return fetchApi<CodeItem[]>("/api/v1/fo/codes/PRODUCTCATEGORY");
}

// Lv/Sub Category 파생용 카테고리 노드 전량 조회(1회)
// - 서버 필터 eq_product.depth=3 로 depth3 제품 노드만(전체 112건 중 67건) 받는다.
// - 기존 공통 fetchData(목록 브랜치) 재사용 — 신규 fetch 함수를 새로 만들지 않는다.
export async function fetchTrainingCategoryNodes(): Promise<
  TrainingCategoryNode[]
> {
  const res = await fetchData<TrainingCategoryNode>({
    slug: TRAINING_CATEGORY_SLUG,
    unpaged: true,
    where: { "eq_product.depth": "3" },
    // content 배열 전체를 flatten → 정규화 노드로 변환
    리턴함수: (rows) => rows.map((r) => toCategoryNode(flattenPageDataItem(r))),
  });
  return res.content;
}
