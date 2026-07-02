import Link from "next/link";
import { emptyStateIconSrc } from "@/data/commonAssets";

type CompanyPressEmptyProps = {
  viewAllHref?: string;
};

export default function CompanyPressEmpty({
  viewAllHref = "/company/press",
}: CompanyPressEmptyProps) {
  return (
    <div className="company-press-list__empty">
      <div className="company-press-list__empty-icon" aria-hidden="true">
        <img src={emptyStateIconSrc} alt="" />
      </div>
      <div className="company-press-list__empty-text">
        <p className="company-press-list__empty-title">There are no results</p>
        <p className="company-press-list__empty-desc">
          Check if all the words are spelled correctly
        </p>
      </div>
      <Link
        href={viewAllHref}
        className="btn-base btn-lv01 btn-lv01--solid company-press-list__empty-btn"
      >
        View All
      </Link>
    </div>
  );
}
