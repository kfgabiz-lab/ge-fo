// Company Press(slug: press-data) 데이터 조회 헬퍼 + 타입
// - 설계 문서: fo/docs/dev/company/press-data.md
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - blog-data와 동일 패턴이나 press-data엔 category/hashtag 필드가 없어 관련 로직 없음
import { formatDisplayDate } from "@/lib/formatDate";
import { flattenPageDataItem, pickField, type PageDataItem } from "@/lib/pageData";
import { LIST_DESCRIPTION_MAX_LENGTH, stripHtmlText } from "@/lib/stripHtmlText";

// 목록 페이지당 개수(설계 4절: Featured 1건 + 리스트 9건 = 페이지당 9건 페이지네이션)
export const PRESS_LIST_SIZE = 9;

// 업로드 미디어 스트리밍 엔드포인트(pressForm.image[0] → page-files)
export const pressImageSrc = (mediaId: number) => `/api/v1/fo/page-files/${mediaId}`;

// 상세 페이지 라우트(id 기반 동적 라우트)
export const pressDetailHref = (id: number) => `/company/press/detail/${id}`;

// ---------------- 응답 원본 타입 ----------------

// page-data 응답 1건. flattenPageDataItem(fo/src/lib/pageData.ts)에 그대로 넘길 수 있는 형태.
// pressForm 필드(title/content/isVisible/publishDttm/image)는 flatten 후 root에서 접근한다.
export type PressRow = PageDataItem;

// ---------------- 화면 카드 바인딩용(가공 완료) ----------------

export interface PressCardItem {
  id: number;
  title: string;
  description: string; // 본문(press.content) HTML에서 태그 제거 + 150자 컷(폴백 없음)
  date: string; // publishDttm → formatDisplayDate로 변환된 표시용 값("Mon D, YYYY")
  rawDate: string; // publish_dttm 원본 값("YYYY-MM-DD") — 정렬 전용(하이라이트 병합 등), 화면 표시엔 date 사용
  imageSrc: string | null; // 미디어 없으면 null → 호출부에서 정적 폴백
}

// ---------------- 순수 가공 헬퍼 ----------------

// 원본 행 → 카드 항목
export function toPressCard(item: PressRow): PressCardItem {
  // flattenPageDataItem: press/seo 섹션 간 키 충돌 없음 → title/publish_dttm/image/content 전부 root로 flat 병합됨
  // (라이브 응답 실측: dataJson.press.content 에만 content 키가 존재 → root "content"로 접근 가능)
  const row = flattenPageDataItem(item);
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const publishDttm = (pickField(row, "publish_dttm", "publishDttm") as string) ?? "";
  return {
    id: item.id,
    title: (row.title as string) ?? "",
    // 본문(content) 리치텍스트 → HTML 태그 제거 후 150자 컷("..." 부착).
    // ⚠️ 폴백 없음 — content가 비면 빈 문자열(meta_description으로 대체하지 않는다)
    description: stripHtmlText(row.content as string | undefined, LIST_DESCRIPTION_MAX_LENGTH),
    // 신규(publish_dttm)/구(publishDttm) 스키마 모두 지원 — 신규 우선. 표시용 "Mon D, YYYY" 포맷 변환
    date: formatDisplayDate(publishDttm),
    rawDate: publishDttm,
    imageSrc: mediaId != null ? pressImageSrc(mediaId) : null,
  };
}

// ---------------- 게시상태 게이트(공통 where 조각) ----------------

// 공개 + 게시일 도래(BO 게시상태 판정식과 동일, 설계문서 9-A) — 목록/Featured/상세/인접이 동일 게이트 사용.
export const PRESS_STATUS_WHERE: Record<string, string> = {
  condexpr_status: "is_visible=001,publish_dttm<=today()?'게시':'미게시'",
  condval_status: "게시",
};
