// Training Curriculum(slug: currMgmt-data) 데이터 조회 헬퍼 + 타입
// - 설계 문서: fo/docs/dev/services/currMgmt-data.md
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - 참고 패턴: fo/src/app/company/data/blogData.ts (STATUS_WHERE 상수 / toXxxCard·xxxDetailHref 헬퍼 / 코드그룹 fetchApi)
import { fetchApi } from "@/lib/api";
import { flattenPageDataItem, type PageDataItem } from "@/lib/pageData";
import {
  fetchTrainingProductTree,
  type TrainingProductTreeItem,
} from "@/lib/training/trainingProductTree";
import type { TrainingFilterOption, TrainingVariant } from "./trainingContent";

// 목록 slug 및 페이지당 개수(설계 4절: size=10 페이지네이션)
export const TRAINING_SLUG = "currMgmt-data";
export const TRAINING_LIST_SIZE = 10;

// 업로드 미디어 스트리밍 엔드포인트(curriculum.image[0] → page-files)
export const trainingImageSrc = (mediaId: number) =>
  `/api/v1/fo/page-files/${mediaId}`;

// 상세 페이지 라우트(id 기반, detailHrefPrefix는 variant별로 주입)
export const trainingDetailHref = (prefix: string, id: number) =>
  `${prefix}/${id}`;

// variant(메뉴) → curriculum.training_course 코드(TRAININGCOURSE).
// BO 커리큘럼 등록 시 "Training 과정 선택" 라디오로 지정하는 값과 동일하다.
export const TRAINING_COURSE_BY_VARIANT: Record<TrainingVariant, string> = {
  engineering: "01",
  service: "02",
  sales: "03",
};

// 공통 where — 공개 게이트(is_visible=001) + 메뉴별 교육과정(training_course) 필터.
// - 3개 메뉴는 같은 slug(currMgmt-data)를 쓰지만 커리큘럼마다 training_course 가 지정돼 있어
//   해당 과정의 커리큘럼만 노출해야 한다(engineering=01 / service=02 / sales=03).
export function trainingStatusWhere(
  variant: TrainingVariant,
): Record<string, string> {
  return {
    "eq_curriculum.is_visible": "001",
    "eq_curriculum.training_course": TRAINING_COURSE_BY_VARIANT[variant],
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

// Lv/Sub Category 옵션 파생에 필요한 필드만 정규화한 노드.
// - 원천은 전용 엔드포인트 GET /api/v1/fo/training/product-tree 의 items(평면 행).
//   (기존 category-data 조회 + 관계설정 _fetchedRel{17,19,20,21} 의존 방식을 대체 —
//    관계 번호는 환경마다 달라지고 미설정 환경에서는 값이 내려오지 않아 화면이 비어버렸다.)
// - 트레이닝 사용 제품(has_training=001) 게이트는 BE 쿼리에서 이미 적용된다.
export interface TrainingCategoryNode {
  id: number; // category-data depth3 연결행 PK — categoryIds(복수) 필터 호출 시 사용
  depth1Title: string; // Lv1 카테고리 타이틀
  depth2Title: string; // Lv2 카테고리 타이틀
  productType: string; // "P"=Power / "A"=Automation
  productName: string; // depth3 제품명
}

// product-tree 평면 행 → 정규화 노드
function toCategoryNode(item: TrainingProductTreeItem): TrainingCategoryNode {
  return {
    id: Number(item.categoryId ?? 0),
    depth1Title: item.lv1Title ?? "",
    depth2Title: item.lv2Title ?? "",
    productType: item.productType ?? "",
    productName: item.productName ?? "",
  };
}

// 게이트: product_type 일치 노드만 통과(트레이닝 사용여부 게이트는 BE 조회에서 적용됨)
function gateNodes(
  nodes: TrainingCategoryNode[],
  productType: string,
): TrainingCategoryNode[] {
  return nodes.filter((n) => n.productType === productType);
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
// - Power(P): 게이트 통과 행의 Lv1 카테고리 타이틀
// - Automation(A): 게이트 통과 행의 Lv2 카테고리 타이틀
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
// - Power(P): 게이트 + (lvValue 있으면 Lv1==lvValue) 행의 Lv2 카테고리 타이틀
// - Automation(A): 게이트 + (lvValue 있으면 Lv2==lvValue) 행의 제품명
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

// Lv/Sub Category 선택값(표시용 타이틀 문자열) → 해당 그룹에 속한 노드들의 PK(id) 목록.
// - /training/curriculum-by-category 는 category-data depth3 연결행 PK 를 categoryIds(복수)로 받는다.
//   (currDtlMgmt-data 의 power_list/automation_list 에 저장된 값과 같은 id 공간)
// - Lv/Sub 옵션의 value는 타이틀/제품명 문자열이라, 실제 호출 시점에 이 함수로 PK 배열로 변환한다.
// - Power(P): Lv=depth1 타이틀 / Sub=depth2 타이틀
// - Automation(A): Lv=depth2 타이틀 / Sub=제품명(product_name)
// - Sub 선택 시: Lv+Sub 모두 매칭되는 노드의 id. Sub 미선택+Lv만 선택 시: Lv 매칭 노드 전부의 id.
// - 게이트(product_type 일치) 통과 노드만 대상. 중복 id 제거.
export function resolveCategoryIds(
  nodes: TrainingCategoryNode[],
  category: string,
  lvValue: string,
  subValue: string,
): number[] {
  if (category !== "P" && category !== "A") return [];
  const gated = gateNodes(nodes, category);
  const matched = gated.filter((n) => {
    if (category === "P") {
      if (lvValue && n.depth1Title !== lvValue) return false;
      if (subValue && n.depth2Title !== subValue) return false;
    } else {
      if (lvValue && n.depth2Title !== lvValue) return false;
      if (subValue && n.productName !== subValue) return false;
    }
    return true;
  });
  return Array.from(new Set(matched.map((n) => n.id).filter((id) => id > 0)));
}

// ---------------- 조회 함수 ----------------

// 카테고리 라벨용 코드그룹 조회(page-data 조회가 아닌 codes API라 fetchData 대상 아님)
export async function fetchTrainingCategories(): Promise<CodeItem[]> {
  return fetchApi<CodeItem[]>("/api/v1/fo/codes/PRODUCTCATEGORY");
}

// Lv/Sub Category 파생용 카테고리 노드 전량 조회(1회)
// - 전용 엔드포인트(/training/product-tree)의 items 를 그대로 정규화한다.
//   Request-for-Training Step4 가 쓰는 것과 동일한 공통 함수(fetchTrainingProductTree)를 재사용 —
//   화면 전용 fetch 래퍼를 새로 만들지 않는다.
export async function fetchTrainingCategoryNodes(): Promise<
  TrainingCategoryNode[]
> {
  const tree = await fetchTrainingProductTree();
  return tree.items.map(toCategoryNode).filter((n) => n.id > 0);
}

// 신규 엔드포인트(/training/curriculum-by-category) 응답 — PageDataListResponse(기존 목록과 동일 구조)
export interface TrainingByCategoryResponse {
  content: TrainingRow[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// categoryIds(복수 PK) 기반 커리큘럼 목록 조회(신규 BE 엔드포인트).
// - 단일/묶음 카테고리 선택을 category-data PK 목록으로 표현(콤마 구분).
// - page-data/{slug} 경로가 아니라 전용 경로라 fetchData가 아닌 fetchApi를 직접 사용.
// - 응답 구조가 currMgmt-data 목록과 동일 → 호출부에서 toTrainingCard 매핑 그대로 재사용.
// - trainingCourse: 메뉴별 교육과정 코드(engineering=01/service=02/sales=03)를 함께 전달해
//   기본 where 분기(trainingStatusWhere)와 동일한 필터를 이 경로에서도 유지한다.
export async function fetchTrainingByCategoryIds(params: {
  categoryIds: number[];
  variant: TrainingVariant;
  page: number;
  size: number;
}): Promise<{ content: TrainingRow[]; totalPages: number }> {
  const { categoryIds, variant, page, size } = params;
  const sp = new URLSearchParams();
  sp.set("categoryIds", categoryIds.join(","));
  sp.set("trainingCourse", TRAINING_COURSE_BY_VARIANT[variant]);
  sp.set("page", String(page));
  sp.set("size", String(size));
  sp.set("sort", "createdAt,desc");
  const res = await fetchApi<TrainingByCategoryResponse>(
    `/api/v1/fo/training/curriculum-by-category?${sp.toString()}`,
  );
  return { content: res.content ?? [], totalPages: res.totalPages || 1 };
}
