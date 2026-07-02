import Link from "next/link";
import type { ArticlesListItem } from "@/app/()/company/data/articlesListContent";

type CompanyArticlesListGridProps = {
  items: ArticlesListItem[];
  detailHref?: string;
};

export default function CompanyArticlesListGrid({
  items,
  detailHref = "/company/articles/detail",
}: CompanyArticlesListGridProps) {
  return (
    <ul className="company-articles-list__grid">
      {items.map((item) => (
        <li key={item.id} className="company-articles-list__item">
          <Link href={detailHref} className="company-articles-list__card">
            <div className="company-articles-list__image">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="company-articles-list__content">
              <h3 className="company-articles-list__title">{item.title}</h3>
              <p className="company-articles-list__date">{item.date}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
