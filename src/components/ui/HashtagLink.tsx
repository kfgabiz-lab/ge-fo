import { buildSearchAllHref } from "@/data/search/searchAllContent";
import {
  renderInlineTextHighlight,
} from "@/app/search/components/renderSearchTextHighlight";

type HashtagLinkProps = {
  tag: string;
  className?: string;
  highlight?: string;
  markClassName?: string;
};

export default function HashtagLink({
  tag,
  className,
  highlight,
  markClassName = "company-blog__mark",
}: HashtagLinkProps) {
  const keyword = tag.replace(/^#/, "");
  const label =
    highlight?.trim()
      ? renderInlineTextHighlight(tag, highlight.trim(), markClassName)
      : tag;

  return (
    <a href={buildSearchAllHref(keyword)} className={className}>
      {label}
    </a>
  );
}
