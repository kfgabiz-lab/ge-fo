import {
  swiperBarClasses,
  type SwiperBarVariant,
} from "./swiperControls.classes";

type SwiperBarPaginationProps = {
  variant: SwiperBarVariant;
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  ariaLabel?: string;
};

export default function SwiperBarPagination({
  variant,
  count,
  activeIndex,
  onSelect,
  ariaLabel = "슬라이드 페이지네이션",
}: SwiperBarPaginationProps) {
  const classes = swiperBarClasses[variant];

  return (
    <div
      className={classes.pagination}
      role="tablist"
      aria-label={ariaLabel}
    >
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          className={
            activeIndex === index
              ? `${classes.item} is-active`
              : classes.item
          }
          aria-label={`${index + 1}번 슬라이드`}
          aria-current={activeIndex === index ? "true" : undefined}
          onClick={() => onSelect(index)}
        >
          <span className={classes.bar} />
        </button>
      ))}
    </div>
  );
}
