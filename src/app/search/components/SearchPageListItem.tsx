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

/** Figma 6430:106469 (compact · All) · 6430:112540 (pages tab) — Pages list item */
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
        {/* 카테고리 값이 없는 소스(page-search)는 카테고리 줄을 렌더하지 않는다 — 없는 문구를 임의로 만들지 않기 위함 */}
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

  // 이동 대상 URL 이 없는 예외 항목은 클릭 불가 항목으로 렌더한다(방어용 분기).
  // href="" 는 Next 에서 현재 URL 로 해석돼 불필요한 이동이 발생하므로 Link 로 감싸지 않는다.
  // className/내부 구조는 링크 항목과 동일하게 유지한다(스타일 변경 없음).
  if (!item.href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={item.href} prefetch={false} className={className}>
      {content}
    </Link>
  );
}
