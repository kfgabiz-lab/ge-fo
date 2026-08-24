import Link from "next/link";
import type {
  CompanyFeedListItem,
  CompanyFeedVariant,
} from "@/app/company/data/companyFeedContent";
import { renderTitleTextHighlight } from "@/app/search/components/renderSearchTextHighlight";
import { handleImageFallback } from "@/lib/imageFallback";

type CompanyFeedListGridProps = {
  variant: CompanyFeedVariant;
  items: CompanyFeedListItem[];
  detailHref?: string;
  highlight?: string;
};

export default function CompanyFeedListGrid({
  variant,
  items,
  detailHref = `/company/${variant}/detail`,
  highlight,
}: CompanyFeedListGridProps) {
  const prefix = `company-${variant}-list`;
  const markClassName = `${prefix}__mark`;
  const searchHighlight = highlight?.trim() || undefined;

  return (
    <ul className={`${prefix}__grid`}>
      {items.map((item) => (
        <li key={item.id} className={`${prefix}__item`}>
          <Link href={item.href ?? detailHref} className={`${prefix}__card`} prefetch={false}>
            <div className={`${prefix}__image`}>
              <img src={item.image} alt={item.title} onError={handleImageFallback} />
            </div>
            <div className={`${prefix}__content`}>
              <h3 className={`${prefix}__title`}>
                {renderTitleTextHighlight(
                  item.title,
                  searchHighlight,
                  markClassName,
                )}
              </h3>
              <p className={`${prefix}__date`}>{item.date}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
