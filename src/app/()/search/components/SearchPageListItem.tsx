import Link from "next/link";
import type { SearchPageItem } from "@/data/search/searchAllContent";

type SearchPageListItemProps = {
  item: SearchPageItem;
  className?: string;
};

/** Figma 5661:80869 — Pages / list (highlight → search_page__tag) */
export default function SearchPageListItem({ item, className }: SearchPageListItemProps) {
  return (
    <Link href={item.href} prefetch={false} className={className}>
      <p className="search_page__cat">{item.category}</p>
      <div className="search_page__body">
        <div className="search_page__tit-row">
          <span className="search_page__tit">{item.title}</span>
          {item.highlight ? <span className="search_page__tag">{item.highlight}</span> : null}
        </div>
        <p className="search_page__desc">{item.description}</p>
      </div>
    </Link>
  );
}
