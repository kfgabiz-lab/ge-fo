import {
  buildDirectionsHref,
  type WhereToBuyLocation,
} from "@/data/support/whereToBuyContent";
import type { GeoCoord } from "@/lib/geo/distance";

type WhereToBuyLocationCardProps = {
  location: WhereToBuyLocation;
  isActive: boolean;
  onSelect: () => void;
  /**
   * 이미 확보된 "내 위치" 좌표(상위 Contents 소유). null 이면 본사 주소가 길찾기 출발지가 된다.
   * 렌더 시점에 href 를 만들어야 하므로 정적 가공값 대신 이 prop 을 받는다(기획서 항목9).
   */
  myLocation?: GeoCoord | null;
};

export default function WhereToBuyLocationCard({
  location,
  isActive,
  onSelect,
  myLocation = null,
}: WhereToBuyLocationCardProps) {
  // 출발지: 내 위치(권한 허용 시) → 없으면 본사 주소. 목적지: 좌표 우선, 없으면 주소.
  const directionsHref = buildDirectionsHref(location, myLocation);

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
          href={directionsHref}
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
