import Link from "next/link";
import type { TechHubSeriesItem } from "@/data/support/techHubContent";

type TechHubViewSeriesItemProps = {
  item: TechHubSeriesItem;
};

export default function TechHubViewSeriesItem({
  item,
}: TechHubViewSeriesItemProps) {
  const titleLines = Array.isArray(item.title) ? item.title : [item.title];
  const itemClass = item.isActive
    ? "support_tech_hub_view__series-item support_tech_hub_view__series-item--active"
    : "support_tech_hub_view__series-item";

  return (
    <li className="support_tech_hub_view__series-row">
      <Link href={item.href} className={itemClass}>
        <span className="support_tech_hub_view__series-thumb" aria-hidden>
          <img src={item.poster} alt="" loading="lazy" decoding="async" />
        </span>
        <span className="support_tech_hub_view__series-meta">
          <span className="support_tech_hub_view__chapter">{item.chapter}</span>
          <span className="support_tech_hub_view__series-tit">
            {titleLines.map((line) => (
              <span
                key={line}
                className="support_tech_hub_view__series-tit-line"
              >
                {line}
              </span>
            ))}
          </span>
        </span>
      </Link>
    </li>
  );
}
