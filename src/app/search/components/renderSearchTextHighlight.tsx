import { Fragment, type ReactNode } from "react";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function includesSearchHighlight(
  text: string | undefined,
  highlight: string | undefined,
): boolean {
  if (!text || !highlight) {
    return false;
  }
  return text.toLowerCase().includes(highlight.toLowerCase());
}

export function renderInlineTextHighlight(
  text: string,
  highlight: string,
  markClassName: string,
  textClassName?: string,
): ReactNode {
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
