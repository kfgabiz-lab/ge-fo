import Link from "next/link";
import { techHubEmptyContent } from "@/data/support/techHubContent";

export default function TechHubEmpty() {
  const { title, subtitle, iconSrc, viewAllLabel, viewAllHref } =
    techHubEmptyContent;

  return (
    <div className="support_tech_hub_empty">
      <div className="support_tech_hub_empty__head">
        <div className="support_tech_hub_empty__icon" aria-hidden>
          <img src={iconSrc} alt="" width={148} height={148} />
        </div>
        <div className="support_tech_hub_empty__text">
          <p className="support_tech_hub_empty__title">{title}</p>
          <p className="support_tech_hub_empty__subtitle">{subtitle}</p>
        </div>
      </div>

      <Link
        href={viewAllHref}
        className="btn-base btn-lv01 btn-lv01--solid support_tech_hub_empty__view-all"
      >
        {viewAllLabel}
      </Link>
    </div>
  );
}
