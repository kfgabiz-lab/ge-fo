import Link from "next/link";
import type { CompanyFeedVariant } from "@/app/company/data/companyFeedContent";

// 공통 피드 Featured 카드 (Press/Articles). class 접두어만 variant로 분기
type CompanyFeedFeaturedProps = {
  variant: CompanyFeedVariant;
  title: string;
  description: string;
  date: string;
  image: string;
  href: string;
};

export default function CompanyFeedFeatured({
  variant,
  title,
  description,
  date,
  image,
  href,
}: CompanyFeedFeaturedProps) {
  const prefix = `company-${variant}-featured`;

  return (
    <section className={prefix}>
      <div className="inner">
        <Link href={href} className={`${prefix}__card`}>
          <div className={`${prefix}__image`}>
            <img src={image} alt={title} />
          </div>
          <div className={`${prefix}__content`}>
            <div className={`${prefix}__text`}>
              <h2 className={`${prefix}__title`}>{title}</h2>
              <p className={`${prefix}__desc`}>{description}</p>
              <p className={`${prefix}__date`}>{date}</p>
            </div>
            <span className={`btn-text-30 ${prefix}__link`}>
              Explore
              <span className="btn-text-30__icon" aria-hidden="true">
                <span className="icon_arrow-14" />
              </span>
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
