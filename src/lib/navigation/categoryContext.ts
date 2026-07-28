// 카테고리 컨텍스트(?category={Lv2 category-data id}) 공용 헬퍼.
//
// 배경: BO 데이터에는 seo.slug 가 완전히 겹치는 Lv2 카테고리/제품이 실제로 존재한다.
//  (예: "variable-frequency-drive" 가 LV Products and Systems 하위 587 과
//   Industrial Automation and Control 하위 607 두 건, 그 안의 VFD 제품 6종도 각각 복제 등록)
// slug 만으로는 대상이 확정되지 않으므로, 링크를 만드는 시점(GNB 트리·카테고리 카드 목록)에
// 이미 알고 있는 Lv2 의 고유 id 를 쿼리파라미터로 실어 보내 이동 대상을 확정한다.
//
// ⚠️ 컨텍스트가 없는 진입(검색엔진 색인 링크·직접 입력·기존 북마크)은 기존과 100% 동일하게
//    slug 기준으로 동작해야 한다(하위호환) — 이 헬퍼를 쓰는 쪽은 전부 "있으면 좁히고, 없으면 그대로"다.
//
// 위치 근거: 링크 생성(서버 데이터 모듈)과 링크 해석(헤더 브레드크럼 = 클라이언트 컴포넌트)이
//   함께 쓰는 순수 함수라, 무거운 데이터 모듈이 클라이언트 번들에 딸려오지 않도록 여기에 둔다.
export const CATEGORY_CONTEXT_PARAM = "category";

// 링크에 카테고리 컨텍스트를 부착한다. href 가 빈 값이면(=링크 비활성 정책) 그대로 빈 값을 돌려준다.
export function withCategoryContext(
  href: string,
  categoryId: number | string | null | undefined,
): string {
  if (!href) return href;
  const id =
    typeof categoryId === "number"
      ? Number.isFinite(categoryId)
        ? String(categoryId)
        : ""
      : (categoryId ?? "").trim();
  if (!id) return href;
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}${CATEGORY_CONTEXT_PARAM}=${encodeURIComponent(id)}`;
}

// 카테고리 컨텍스트 원본값 → 양의 정수 id. 값이 없거나 형식이 어긋나면 undefined
// (= 컨텍스트 없는 진입과 동일 취급). 배열로 들어오면(중복 파라미터) 첫 값만 본다.
export function parseCategoryContext(
  value: string | string[] | undefined | null,
): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

// 링크 href 에서 카테고리 컨텍스트를 뗀 "경로만" 남긴다.
// usePathname() 은 쿼리를 포함하지 않으므로, GNB 트리 href 와 현재 경로를 비교할 때 반드시 이 값을 쓴다.
export function hrefPathname(href: string): string {
  const queryIndex = href.indexOf("?");
  return queryIndex === -1 ? href : href.slice(0, queryIndex);
}
