import type { WhereToBuyLocation } from "@/data/support/whereToBuyContent";

type WhereToBuyMapPopupProps = {
  location: WhereToBuyLocation;
};

/** Figma 4713:82324 — map marker info popup */
export default function WhereToBuyMapPopup({ location }: WhereToBuyMapPopupProps) {
  return (
    <div
      className="support_where_to_buy_map__popup"
      role="dialog"
      aria-label={location.name}
    >
      <div className="support_where_to_buy_map__popup-body">
        <div className="support_where_to_buy_map__popup-head">
          <div className="support_where_to_buy_map__popup-badges">
            {location.badges.map((badge) => (
              <span key={badge} className="support_where_to_buy_map__popup-badge">
                {badge}
              </span>
            ))}
          </div>
          <h3 className="support_where_to_buy_map__popup-name">{location.name}</h3>
        </div>

        <div className="support_where_to_buy_map__popup-meta">
          <p>{location.address}</p>
          <p>{location.phone}</p>
          <a
            href={location.website}
            className="support_where_to_buy_map__popup-website"
            target="_blank"
            rel="noopener noreferrer"
          >
            {location.websiteLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
