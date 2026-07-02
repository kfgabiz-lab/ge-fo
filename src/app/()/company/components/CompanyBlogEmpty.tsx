import Link from "next/link";
import { emptyStateIconSrc } from "@/data/commonAssets";

type CompanyBlogEmptyProps = {
  viewAllHref?: string;
};

export default function CompanyBlogEmpty({
  viewAllHref = "/company/blog",
}: CompanyBlogEmptyProps) {
  return (
    <div className="company-blog-list__empty">
      <div className="company-blog-list__empty-icon" aria-hidden="true">
        <img src={emptyStateIconSrc} alt="" />
      </div>
      <div className="company-blog-list__empty-text">
        <p className="company-blog-list__empty-title">There are no results</p>
        <p className="company-blog-list__empty-desc">
          Check if all the words are spelled correctly
        </p>
      </div>
      <Link
        href={viewAllHref}
        className="btn-base btn-lv01 btn-lv01--solid company-blog-list__empty-btn"
      >
        View All
      </Link>
    </div>
  );
}
