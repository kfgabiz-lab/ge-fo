import Link from "next/link";
import type { ReactNode } from "react";
import type { SearchPageItem } from "@/data/search/searchAllContent";
import {
  includesSearchHighlight,
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
    highlight && includesSearchHighlight(item.title, highlight)
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

export default function SearchPageListItem({
  item,
  className,
  variant = "compact",
}: SearchPageListItemProps) {
  const highlight = item.highlight;
  const descContainsHighlight = includesSearchHighlight(
    item.description,
    highlight,
  );

  const showDescHighlight = descContainsHighlight;

  const content = (
    <div className="search_page__content">
      <div className="search_page__head">
        {item.category ? (
          <p className="search_page__cat">{item.category}</p>
        ) : null}
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
  );

  if (!item.href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={item.href} prefetch={false} className={className}>
      {content}
    </Link>
  );
}
