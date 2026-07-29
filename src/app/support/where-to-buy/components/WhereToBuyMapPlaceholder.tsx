type WhereToBuyMapPlaceholderProps = {
  ariaLabel: string;
};

export default function WhereToBuyMapPlaceholder({
  ariaLabel,
}: WhereToBuyMapPlaceholderProps) {
  return (
    <div
      className="support_where_to_buy_map support_where_to_buy_map--placeholder"
      role="img"
      aria-label={ariaLabel}
    />
  );
}
