import { forwardRef } from "react";
import { whereToBuyPage } from "@/data/support/whereToBuyContent";

export type WhereToBuyMobileView = "map" | "list";

type WhereToBuyViewToggleProps = {
  view: WhereToBuyMobileView;
  onToggle: () => void;
};

const WhereToBuyViewToggle = forwardRef<
  HTMLButtonElement,
  WhereToBuyViewToggleProps
>(function WhereToBuyViewToggle({ view, onToggle }, ref) {
  const isMapView = view === "map";
  const label = isMapView
    ? whereToBuyPage.viewListLabel
    : whereToBuyPage.viewMapLabel;

  return (
    <button
      ref={ref}
      type="button"
      className="support_where_to_buy_view-toggle"
      onClick={onToggle}
      aria-label={label}
    >
      <span className="support_where_to_buy_view-toggle__label">{label}</span>
      {isMapView ? (
        /* Figma 10180:150501 — Icon / 20px / List */
        <span
          className="support_where_to_buy_view-toggle__icon support_where_to_buy_view-toggle__icon--list"
          aria-hidden
        >
          <span className="support_where_to_buy_view-toggle__icon-list-frame" />
          <img
            className="support_where_to_buy_view-toggle__icon-list-dots"
            src="/ico/ico_view_list_dots_white.svg"
            alt=""
            width={9}
            height={9}
          />
        </span>
      ) : (
        /* Figma 10180:150515 — Icon / 20px / Map */
        <span
          className="support_where_to_buy_view-toggle__icon support_where_to_buy_view-toggle__icon--map"
          aria-hidden
        >
          <img
            src="/ico/ico_view_map_24_white.svg"
            alt=""
            width={24}
            height={24}
          />
        </span>
      )}
    </button>
  );
});

export default WhereToBuyViewToggle;
