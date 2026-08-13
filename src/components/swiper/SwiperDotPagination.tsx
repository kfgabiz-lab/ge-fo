type SwiperDotPaginationProps = {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  ariaLabel?: string;
  getItemLabel?: (index: number) => string;
};

export default function SwiperDotPagination({
  count,
  activeIndex,
  onSelect,
  ariaLabel = "Banner pagination",
  getItemLabel = (index) => `Banner ${index + 1}`,
}: SwiperDotPaginationProps) {
  return (
    <div className="banner-pagination" aria-label={ariaLabel}>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          className={
            activeIndex === index
              ? "banner-pagination__dot is-active"
              : "banner-pagination__dot"
          }
          aria-label={getItemLabel(index)}
          aria-current={activeIndex === index ? "true" : undefined}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  );
}
