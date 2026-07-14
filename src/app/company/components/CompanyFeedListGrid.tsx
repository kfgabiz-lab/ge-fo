import Link from "next/link";
import type {
  CompanyFeedListItem,
  CompanyFeedVariant,
} from "@/app/company/data/companyFeedContent";

// 공통 피드 리스트 그리드 (Press/Articles). class 접두어/detailHref만 variant로 분기
type CompanyFeedListGridProps = {
  variant: CompanyFeedVariant;
  items: CompanyFeedListItem[];
  detailHref?: string;
};

export default function CompanyFeedListGrid({
  variant,
  items,
  detailHref = `/company/${variant}/detail`,
}: CompanyFeedListGridProps) {
  const prefix = `company-${variant}-list`;

  return (
    <ul className={`${prefix}__grid`}>
      {items.map((item) => (
        <li key={item.id} className={`${prefix}__item`}>
          <Link href={detailHref} className={`${prefix}__card`}>
            <div className={`${prefix}__image`}>
              <img src={item.image} alt={item.title} />
            </div>
            <div className={`${prefix}__content`}>
              <h3 className={`${prefix}__title`}>{item.title}</h3>
              <p className={`${prefix}__date`}>{item.date}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
