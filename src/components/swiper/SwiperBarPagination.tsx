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
  ariaLabel = "Slide pagination",
}: SwiperBarPaginationProps) {
  const classes = swiperBarClasses[variant];

  return (
    <div className={classes.pagination} role="group" aria-label={ariaLabel}>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          className={
            activeIndex === index
              ? `${classes.item} is-active`
              : classes.item
          }
          aria-label={`Slide ${index + 1}`}
          aria-current={activeIndex === index ? "true" : undefined}
          onClick={() => onSelect(index)}
        >
          <span className={classes.bar} />
        </button>
      ))}
    </div>
  );
}
