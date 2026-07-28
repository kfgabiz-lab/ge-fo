import { Fragment } from "react";
import type { SearchPageItem } from "@/data/search/searchAllContent";
import SearchPageListItem from "./SearchPageListItem";
import { searchAllListClasses } from "./searchAllListClasses";

type SearchPageListProps = {
  items: SearchPageItem[];
  listClassName: string;
  itemClassName: string;
  variant?: "compact" | "pages";
};

/** Figma 6430:106470 (compact) · 6430:112540 (pages) — Pages list */
export default function SearchPageList({
  items,
  listClassName,
  itemClassName,
  variant = "compact",
}: SearchPageListProps) {
  return (
    <ul className={listClassName}>
      <li className={searchAllListClasses.divider} aria-hidden>
        <span className={searchAllListClasses.line} />
      </li>
      {items.map((item) => (
        <Fragment key={item.id}>
          <li className={searchAllListClasses.item}>
            <SearchPageListItem
              item={item}
              className={itemClassName}
              variant={variant}
            />
          </li>
          <li className={searchAllListClasses.divider} aria-hidden>
            <span className={searchAllListClasses.line} />
          </li>
        </Fragment>
      ))}
    </ul>
  );
}
