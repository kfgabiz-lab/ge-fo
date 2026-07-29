import { Fragment, type ReactNode } from "react";

/**
 * 정규식 특수문자 이스케이프.
 * 검색어에 `.` `*` `(` `)` `+` `?` `[` `]` `\` 등이 들어와도 패턴이 깨지지 않도록 한다.
 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 검색어 포함 여부(대소문자 무시).
 * BE 통합검색이 ILIKE(대소문자 무시)로 매칭하므로 화면 하이라이트 판정도 같은 기준을 쓴다.
 * "매칭될 때만 하이라이트 렌더" 분기가 필요한 호출부에서 `.includes()` 대신 사용한다.
 */
export function includesSearchHighlight(
  text: string | undefined,
  highlight: string | undefined,
): boolean {
  if (!text || !highlight) {
    return false;
  }
  return text.toLowerCase().includes(highlight.toLowerCase());
}

/**
 * 검색어 기준으로 텍스트를 쪼개 매칭 구간만 markClassName 으로 감싼다(mid-title · mid-body).
 * - 대소문자를 무시하고 매칭하되, 화면에는 원문의 대소문자를 그대로 출력한다
 *   (예: q=relay 인데 원문이 "Relay" 면 "Relay" 가 그대로 하이라이트된다).
 * - 캡처 그룹으로 split 하므로 홀수 인덱스가 매칭 문자열(원문), 짝수 인덱스가 일반 텍스트가 된다.
 */
export function renderInlineTextHighlight(
  text: string,
  highlight: string,
  markClassName: string,
  textClassName?: string,
): ReactNode {
  // textClassName 이 있으면 일반 텍스트를 span 으로 감싼다(기존 동작 유지).
  const wrapText = (value: string): ReactNode =>
    textClassName ? <span className={textClassName}>{value}</span> : value;

  if (!highlight) {
    return wrapText(text);
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(highlight)})`, "gi"));
  if (parts.length === 1) {
    return wrapText(text);
  }

  return parts.map((part, index) => {
    if (!part) {
      return null;
    }
    if (index % 2 === 1) {
      return (
        <span key={`mark-${index}`} className={markClassName}>
          {part}
        </span>
      );
    }
    return <Fragment key={`text-${index}`}>{wrapText(part)}</Fragment>;
  });
}

/**
 * 제목 하이라이트 — 검색어가 제목에 포함될 때만 적용(접미 문자열을 덧붙이지 않는다).
 * 포함 판정은 대소문자를 무시한다.
 */
export function renderTitleTextHighlight(
  title: string,
  highlight: string | undefined,
  markClassName: string,
  textClassName?: string,
): ReactNode {
  if (!highlight || !includesSearchHighlight(title, highlight)) {
    return textClassName ? <span className={textClassName}>{title}</span> : title;
  }

  return renderInlineTextHighlight(title, highlight, markClassName, textClassName);
}
