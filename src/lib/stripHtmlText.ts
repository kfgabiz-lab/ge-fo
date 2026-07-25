// 리치텍스트(HTML) → 목록 카드용 요약 텍스트 공통 함수
// - 에디터 필드(content)에 저장된 HTML에서 태그/엔티티를 제거하고 공백을 정리한 뒤,
//   maxLength를 초과하면 잘라내고 말줄임표("...")를 붙인다.
// - bo의 데이터생성(applyDataGeneration: HTML제거 + 글자자르기, bo/src/app/admin/templates/make/_shared/utils.ts)과
//   동일한 목적의 FO 전용 읽기 헬퍼. DOMParser(브라우저 전용)에 의존하지 않고 서버/클라이언트 동일 결과를 낸다.
// - 폴백 없음: 입력이 비어 있으면 빈 문자열을 그대로 반환한다(호출부에서 다른 필드로 대체하지 말 것).

// 목록 카드 설명(description) 기본 최대 길이 — BO 자동생성(meta_description) 관행과 동일한 150자
export const LIST_DESCRIPTION_MAX_LENGTH = 150;

// 자주 쓰이는 HTML 엔티티만 복원(전체 엔티티 테이블은 목록 요약 용도에 불필요)
const HTML_ENTITIES: [RegExp, string][] = [
  [/&nbsp;|&#160;/gi, " "],
  [/&lt;/gi, "<"],
  [/&gt;/gi, ">"],
  [/&quot;/gi, '"'],
  [/&#39;|&apos;/gi, "'"],
  // &amp;는 다른 엔티티 복원 후 마지막에 처리(&amp;lt; → &lt; → < 이중 복원 방지)
  [/&amp;/gi, "&"],
];

/**
 * HTML 문자열 → 평문 요약 텍스트.
 * @param html 원본 HTML(에디터 content). undefined/null/빈값이면 "" 반환
 * @param maxLength 최대 글자수. 초과 시 잘라내고 "..." 부착. 미지정/0 이하이면 자르지 않음
 * @example stripHtmlText("<p>Hello</p><p>World</p>", 8) // "Hello Wo..."
 */
export function stripHtmlText(
  html?: string | null,
  maxLength?: number,
): string {
  if (!html || typeof html !== "string") return "";

  let text = html
    // script/style 블록은 내부 텍스트까지 통째로 제거
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    // 나머지 태그는 공백으로 치환 — 블록 경계에서 단어가 붙는 것(</p><p> → "AB") 방지
    .replace(/<[^>]*>/g, " ");

  for (const [pattern, replacement] of HTML_ENTITIES) {
    text = text.replace(pattern, replacement);
  }

  // 개행/연속 공백 정리
  text = text.replace(/\s+/g, " ").trim();

  if (!maxLength || maxLength <= 0 || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}
