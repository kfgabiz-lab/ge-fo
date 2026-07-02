import type { SearchPageItem } from "@/data/search/searchAllContent";
import SearchPageListItem from "./SearchPageListItem";

type SearchPageListProps = {
  items: SearchPageItem[];
  listClassName: string;
  itemClassName: string;
};

/** Figma 4701:83902 — Pages list (divider + items) */
export default function SearchPageList({
  items,
  listClassName,
  itemClassName,
}: SearchPageListProps) {
  return (
    <ul className={listClassName}>
      {items.map((item, index) => (
        <li key={item.id} className="search_page__item-wrap">
          <span className="search_page__line" aria-hidden />
          <SearchPageListItem item={item} className={itemClassName} />
          {index === items.length - 1 ? (
            <span className="search_page__line" aria-hidden />
          ) : null}
        </li>
      ))}
    </ul>
  );
}
