import Link from "next/link";
import {
  getTechHubViewHref,
  type TechHubVideoItem,
} from "@/data/support/techHubContent";

type TechHubVideoCardProps = {
  item: TechHubVideoItem;
};

export default function TechHubVideoCard({ item }: TechHubVideoCardProps) {
  const titleLines = Array.isArray(item.title) ? item.title : [item.title];
  const label =
    item.ariaLabel ?? titleLines.join(" ").replace(/\s+/g, " ").trim();
  const viewHref = getTechHubViewHref();

  return (
    <article className="support_tech_hub_card">
      <Link
        href={viewHref}
        className="support_tech_hub_card__media"
        aria-label={`Play video: ${label}`}
      >
        <span className="support_tech_hub_card__thumb" aria-hidden>
          <img src={item.poster} alt="" loading="lazy" decoding="async" />
          <span className="support_tech_hub_card__dim" />
        </span>
        <span className="support_tech_hub_card__play" aria-hidden>
          <img
            src="/ico/ico_play_48.svg"
            alt=""
            width={48}
            height={48}
          />
        </span>
      </Link>
      <h2 className="support_tech_hub_card__tit">
        {titleLines.map((line) => (
          <span key={line} className="support_tech_hub_card__tit-line">
            {line}
          </span>
        ))}
      </h2>
    </article>
  );
}
