// Company Articles(slug: articles-data) 데이터 조회 헬퍼 + 타입
// - 설계 문서: fo/docs/dev/company/articles-data.md
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - pressData.ts와 완전히 동일 패턴(articles-data엔 press와 마찬가지로 category/hashtag 필드가 없음)
import { formatDisplayDate } from "@/lib/formatDate";
import { flattenPageDataItem, pickField, type PageDataItem } from "@/lib/pageData";

// 목록 페이지당 개수(설계 4절: size=10 페이지네이션)
export const ARTICLES_LIST_SIZE = 10;

// 업로드 미디어 스트리밍 엔드포인트(articlesForm.image[0] → page-files)
export const articlesImageSrc = (mediaId: number) => `/api/v1/fo/page-files/${mediaId}`;

// 상세 페이지 라우트(id 기반 동적 라우트)
export const articlesDetailHref = (id: number) => `/company/articles/detail/${id}`;

// ---------------- 응답 원본 타입 ----------------

// page-data 응답 1건. flattenPageDataItem(fo/src/lib/pageData.ts)에 그대로 넘길 수 있는 형태.
// articlesForm 필드(title/content/isVisible/publishDttm/image)는 flatten 후 root에서 접근한다.
export type ArticlesRow = PageDataItem;

// ---------------- 화면 카드 바인딩용(가공 완료) ----------------

export interface ArticlesCardItem {
  id: number;
  title: string;
  description: string; // seo.meta_description(신)/seo.metaDescription(구) 재사용(설계 2-2)
  date: string; // publishDttm → formatDisplayDate로 변환된 표시용 값("Mon D, YYYY")
  rawDate: string; // publish_dttm 원본 값("YYYY-MM-DD") — 정렬 전용(하이라이트 병합 등), 화면 표시엔 date 사용
  imageSrc: string | null; // 미디어 없으면 null → 호출부에서 정적 폴백
}

// ---------------- 순수 가공 헬퍼 ----------------

// 원본 행 → 카드 항목
export function toArticlesCard(item: ArticlesRow): ArticlesCardItem {
  // flattenPageDataItem: articlesForm/seo 섹션 간 키 충돌 없음 → title/publish_dttm/image/meta_description 전부 root로 flat 병합됨
  const row = flattenPageDataItem(item);
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const publishDttm = (pickField(row, "publish_dttm", "publishDttm") as string) ?? "";
  return {
    id: item.id,
    title: (row.title as string) ?? "",
    // 신규(meta_description)/구(metaDescription) seo 스키마 모두 지원 — 신규 우선
    description: (pickField(row, "meta_description", "metaDescription") as string) ?? "",
    // 신규(publish_dttm)/구(publishDttm) 스키마 모두 지원 — 신규 우선. 표시용 "Mon D, YYYY" 포맷 변환
    date: formatDisplayDate(publishDttm),
    rawDate: publishDttm,
    imageSrc: mediaId != null ? articlesImageSrc(mediaId) : null,
  };
}

// ---------------- 게시상태 게이트(공통 where 조각) ----------------

// 공개 + 게시일 도래(BO 게시상태 판정식과 동일, press-data.md 9-A와 동일 조건) — 목록/상세/인접 공통.
export const ARTICLES_STATUS_WHERE: Record<string, string> = {
  condexpr_status: "is_visible=001,publish_dttm<=today()?'게시':'미게시'",
  condval_status: "게시",
};
