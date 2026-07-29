
export const LIST_DESCRIPTION_MAX_LENGTH = 150;

const HTML_ENTITIES: [RegExp, string][] = [
  [/&nbsp;|&#160;/gi, " "],
  [/&lt;/gi, "<"],
  [/&gt;/gi, ">"],
  [/&quot;/gi, '"'],
  [/&#39;|&apos;/gi, "'"],
  [/&amp;/gi, "&"],
];

export function stripHtmlText(
  html?: string | null,
  maxLength?: number,
): string {
  if (!html || typeof html !== "string") return "";

  let text = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ");

  for (const [pattern, replacement] of HTML_ENTITIES) {
    text = text.replace(pattern, replacement);
  }

  text = text.replace(/\s+/g, " ").trim();

  if (!maxLength || maxLength <= 0 || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}
