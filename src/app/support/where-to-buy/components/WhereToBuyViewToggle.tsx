import { whereToBuyPage } from "@/data/support/whereToBuyContent";

export type WhereToBuyMobileView = "map" | "list";

type WhereToBuyViewToggleProps = {
  view: WhereToBuyMobileView;
  onToggle: () => void;
};

export default function WhereToBuyViewToggle({
  view,
  onToggle,
}: WhereToBuyViewToggleProps) {
  const isMapView = view === "map";
  const label = isMapView
    ? whereToBuyPage.viewListLabel
    : whereToBuyPage.viewMapLabel;
  const iconSrc = isMapView
    ? "/ico/ico_list_24_white.svg"
    : "/ico/ico_map_16_white.svg";

  return (
    <button
      type="button"
      className="support_where_to_buy_view-toggle"
      onClick={onToggle}
      aria-label={label}
    >
      <span className="support_where_to_buy_view-toggle__label">{label}</span>
      <img
        className="support_where_to_buy_view-toggle__icon"
        src={iconSrc}
        alt=""
        width={24}
        height={24}
        aria-hidden
      />
    </button>
  );
}
