import Link from "next/link";
import { emptyStateIconSrc } from "@/data/commonAssets";

// 공통 피드 Empty 상태 (Press/Articles/Blog). 마크업 동일, class 접두어만 variant로 분기
type CompanyFeedEmptyVariant = "press" | "articles" | "blog";

type CompanyFeedEmptyProps = {
  variant: CompanyFeedEmptyVariant;
  viewAllHref?: string;
};

export default function CompanyFeedEmpty({
  variant,
  viewAllHref = `/company/${variant}`,
}: CompanyFeedEmptyProps) {
  const prefix = `company-${variant}-list`;

  return (
    <div className={`${prefix}__empty`}>
      <div className={`${prefix}__empty-icon`} aria-hidden="true">
        <img src={emptyStateIconSrc} alt="" />
      </div>
      <div className={`${prefix}__empty-text`}>
        <p className={`${prefix}__empty-title`}>There are no results</p>
        <p className={`${prefix}__empty-desc`}>
          Check if all the words are spelled correctly
        </p>
      </div>
      <Link
        href={viewAllHref}
        className={`btn-base btn-lv01 btn-lv01--solid ${prefix}__empty-btn`}
      >
        View All
      </Link>
    </div>
  );
}
