import { Fragment, type ReactNode } from "react";

/** Split by highlight and wrap each match with markClassName (mid-title · mid-body). */
export function renderInlineTextHighlight(
  text: string,
  highlight: string,
  markClassName: string,
  textClassName?: string,
): ReactNode {
  const parts = text.split(highlight);
  if (parts.length === 1) {
    return textClassName ? <span className={textClassName}>{text}</span> : text;
  }

  return parts.map((part, index) => (
    <Fragment key={`${part}-${index}`}>
      {part
        ? textClassName
          ? <span className={textClassName}>{part}</span>
          : part
        : null}
      {index < parts.length - 1 ? (
        <span className={markClassName}>{highlight}</span>
      ) : null}
    </Fragment>
  ));
}

/** Title highlight — only when highlight string exists in title (no suffix append). */
export function renderTitleTextHighlight(
  title: string,
  highlight: string | undefined,
  markClassName: string,
  textClassName?: string,
): ReactNode {
  if (!highlight || !title.includes(highlight)) {
    return textClassName ? <span className={textClassName}>{title}</span> : title;
  }

  return renderInlineTextHighlight(title, highlight, markClassName, textClassName);
}
