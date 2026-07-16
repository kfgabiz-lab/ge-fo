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
      data-slug-item
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
          <h2
            className="support_where_to_buy_card__name"
            data-slugkey="agency_name"
          >
            {location.name}
          </h2>
        </div>

        <div className="support_where_to_buy_card__meta">
          <p data-slugkey="address">{location.address}</p>
          <p data-slugkey="office_number">{location.phone}</p>
          <a
            href={location.website}
            className="support_where_to_buy_card__website"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            data-slugkey="homepage"
            data-slugkey-attr="href"
          >
            <span data-slugkey="homepage">{location.websiteLabel}</span>
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
            src="/ico/ico_map_14_navy.svg"
            alt=""
            width={14}
            height={14}
            aria-hidden
          />
        </a>
        <a
          href={location.phoneHref}
          className="support_where_to_buy_card__action"
          data-slugkey="office_number"
          data-slugkey-attr="href"
        >
          <span className="support_where_to_buy_card__action-label">
            Call Now
          </span>
          <img
            className="support_where_to_buy_card__action-icon"
            src="/ico/ico_call_14_navy.svg"
            alt=""
            width={14}
            height={14}
            aria-hidden
          />
        </a>
      </div>
    </article>
  );
}
