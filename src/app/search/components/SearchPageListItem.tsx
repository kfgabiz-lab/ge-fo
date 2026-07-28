import Link from "next/link";
import type { ReactNode } from "react";
import type { SearchPageItem } from "@/data/search/searchAllContent";
import {
  renderInlineTextHighlight,
  renderTitleTextHighlight,
} from "./renderSearchTextHighlight";

type SearchPageListItemProps = {
  item: SearchPageItem;
  className?: string;
  variant?: "compact" | "pages";
};

function renderTitleSuffix(text: string, searchHighlightSuffix: boolean) {
  return (
    <>
      <span className="search_page__tit-sep" aria-hidden>
        {"  I  "}
      </span>
      <span
        className={
          searchHighlightSuffix
            ? "search_page__mark"
            : "search_page__mark search_page__mark--plain"
        }
      >
        {text}
      </span>
    </>
  );
}

function renderPageTitle(item: SearchPageItem, highlight: string | undefined) {
  const titleBody =
    highlight && item.title.includes(highlight)
      ? renderTitleTextHighlight(
          item.title,
          highlight,
          "search_page__mark",
          "search_page__tit-text",
        )
      : (
        <span className="search_page__tit-text">{item.title}</span>
      );

  if (!item.mark) {
    return titleBody;
  }

  return (
    <>
      {titleBody}
      {renderTitleSuffix(item.mark, item.mark === highlight)}
    </>
  );
}

function renderTitle(
  item: SearchPageItem,
  highlight: string | undefined,
  variant: "compact" | "pages",
): ReactNode {
  const titleBody =
    variant === "compact" || variant === "pages"
      ? renderPageTitle(item, highlight)
      : <span className="search_page__tit-text">{item.title}</span>;

  return (
    <div className="search_page__tit-row">
      <p className="search_page__tit">{titleBody}</p>
    </div>
  );
}

/** Figma 6430:106469 (compact · All) · 6430:112540 (pages tab) — Pages list item */
export default function SearchPageListItem({
  item,
  className,
  variant = "compact",
}: SearchPageListItemProps) {
  const highlight = item.highlight;
  const descContainsHighlight =
    highlight !== undefined && item.description.includes(highlight);

  const showDescHighlight = descContainsHighlight;

  return (
    <Link href={item.href} prefetch={false} className={className}>
      <div className="search_page__content">
        <div className="search_page__head">
          <p className="search_page__cat">{item.category}</p>
          {renderTitle(item, highlight, variant)}
        </div>
        <p className="search_page__desc">
          {showDescHighlight && highlight
            ? renderInlineTextHighlight(
                item.description,
                highlight,
                "search_page__desc-mark",
              )
            : item.description}
        </p>
      </div>
    </Link>
  );
}
