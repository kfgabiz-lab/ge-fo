import Link from "next/link";
import type { SearchMediaItem } from "@/data/search/searchAllContent";
import {
  includesSearchHighlight,
  renderInlineTextHighlight,
  renderTitleTextHighlight,
} from "./renderSearchTextHighlight";

type SearchMediaListItemProps = {
  item: SearchMediaItem;
  className?: string;
  variant?: "compact" | "card";
};

/** Figma 6430:106510 (card · All) · 6430:112136 (card · Media tab) — Media list item */
export default function SearchMediaListItem({
  item,
  className,
  variant = "compact",
}: SearchMediaListItemProps) {
  const highlight = item.highlight;
  const descContainsHighlight = includesSearchHighlight(
    item.description,
    highlight,
  );

  const showDescHighlight = descContainsHighlight;

  const titleNode = renderTitleTextHighlight(
    item.title,
    highlight,
    "search_all__media-mark",
  );

  const descriptionNode = item.description ? (
    <div className="search_all__media-desc">
      <p className="search_all__media-desc-p">
        {showDescHighlight && highlight
          ? renderInlineTextHighlight(
              item.description,
              highlight,
              "search_all__media-desc-mark",
            )
          : item.description}
      </p>
    </div>
  ) : null;

  const body =
    variant === "card" ? (
      <>
        <div className="search_all__media-head">
          <p className="search_all__media-cat">{item.category}</p>
          <p className="search_all__media-tit">{titleNode}</p>
        </div>
        {descriptionNode}
      </>
    ) : (
      <>
        <p className="search_all__media-cat">{item.category}</p>
        <div className="search_all__media-body">
          <div className="search_all__media-tit-row">
            <p className="search_all__media-tit">{titleNode}</p>
          </div>
          {descriptionNode}
        </div>
      </>
    );

  if (variant === "card") {
    return (
      <Link href={item.href} prefetch={false} className={className}>
        <div
          className={
            item.variant === "video"
              ? "search_all__media-thumb search_all__media-thumb--video"
              : "search_all__media-thumb"
          }
        >
          {/* 썸네일 없음(폴백 이미지도 없는 소스 = Tech Hub)일 때 src 미설정 — 빈 문자열 src 로 인한 재다운로드 경고 방지(TechHubVideoCard 와 동일 처리) */}
          <img
            src={item.image || undefined}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="search_all__media-content">{body}</div>
      </Link>
    );
  }

  return (
    <Link href={item.href} prefetch={false} className={className}>
      {body}
    </Link>
  );
}
