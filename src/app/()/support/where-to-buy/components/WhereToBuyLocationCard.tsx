import type { WhereToBuyLocation } from "@/data/support/whereToBuyContent";

type WhereToBuyLocationCardProps = {
  location: WhereToBuyLocation;
  isActive: boolean;
  onSelect: () => void;
};

export default function WhereToBuyLocationCard({
  location,
  isActive,
  onSelect,
}: WhereToBuyLocationCardProps) {
  return (
    <article
      className={
        isActive
          ? "support_where_to_buy_card support_where_to_buy_card--active"
          : "support_where_to_buy_card"
      }
    >
      <button
        type="button"
        className="support_where_to_buy_card__select"
        onClick={onSelect}
        aria-pressed={isActive}
      >
        <div className="support_where_to_buy_card__head">
          <div className="support_where_to_buy_card__badges">
            {location.badges.map((badge) => (
              <span key={badge} className="support_where_to_buy_card__badge">
                {badge}
              </span>
            ))}
          </div>
          <h2 className="support_where_to_buy_card__name">{location.name}</h2>
        </div>

        <div className="support_where_to_buy_card__meta">
          <p>{location.address}</p>
          <p>{location.phone}</p>
          <a
            href={location.website}
            className="support_where_to_buy_card__website"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            {location.websiteLabel}
          </a>
        </div>
      </button>

      <div className="support_where_to_buy_card__actions">
        <a
          href={location.directionsHref}
          className="support_where_to_buy_card__action"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="support_where_to_buy_card__action-label">
            Get Directions
          </span>
          <img
            className="support_where_to_buy_card__action-icon"
            src="/ico/ico_map_16.svg"
            alt=""
            width={16}
            height={16}
            aria-hidden
          />
        </a>
        <a
          href={location.phoneHref}
          className="support_where_to_buy_card__action"
        >
          <span className="support_where_to_buy_card__action-label">
            Call Now
          </span>
          <img
            className="support_where_to_buy_card__action-icon"
            src="/ico/ico_call_16.svg"
            alt=""
            width={16}
            height={16}
            aria-hidden
          />
        </a>
      </div>
    </article>
  );
}
