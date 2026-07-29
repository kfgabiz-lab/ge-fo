import Link from "next/link";
import type { SearchProductItem } from "@/data/search/searchAllContent";
import { PRODUCTS_SYSTEMS_PLACEHOLDER } from "@/app/()/products-systems/data/productsSystemsData";
import {
  includesSearchHighlight,
  renderInlineTextHighlight,
  renderTitleTextHighlight,
} from "./renderSearchTextHighlight";

type SearchProductCardProps = {
  item: SearchProductItem;
  searchTerm?: string;
};

export default function SearchProductCard({ item, searchTerm }: SearchProductCardProps) {
  const highlight = searchTerm?.trim() ? searchTerm.trim() : undefined;
  return (
    <Link href={item.href} prefetch={false} className="search_all__product">
      <div className="search_all__product-img">
        <img
          src={item.image || PRODUCTS_SYSTEMS_PLACEHOLDER}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="search_all__product-body">
        <p className="search_all__product-path">
          <span className="search_all__product-path-label">{item.category}</span>
          <span className="search_all__product-path-icon" aria-hidden />
          <span className="search_all__product-path-text">{item.highlight}</span>
        </p>
        <div className="search_all__product-text">
          <h3 className="search_all__product-tit">
            {item.title.split("\n").map((line, lineIndex) => (
              <span key={`${item.id}-tit-${lineIndex}`}>
                {lineIndex > 0 ? <br /> : null}
                {renderTitleTextHighlight(line, highlight, "search_all__mark")}
              </span>
            ))}
          </h3>
          <p className="search_all__product-desc">
            {highlight && includesSearchHighlight(item.description, highlight)
              ? renderInlineTextHighlight(
                  item.description,
                  highlight,
                  "search_all__mark",
                )
              : item.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
