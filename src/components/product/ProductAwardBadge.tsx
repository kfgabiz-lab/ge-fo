type ProductAwardBadgeProps = {
  dataSlugKey?: string;
};

export default function ProductAwardBadge({
  dataSlugKey,
}: ProductAwardBadgeProps = {}) {
  return (
    <div className="product_award_badge" data-slugkey={dataSlugKey}>
      <span className="product_award_badge__icon" aria-hidden="true" />
    </div>
  );
}
