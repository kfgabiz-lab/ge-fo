import {
  swiperBarClasses,
  type SwiperBarVariant,
} from "./swiperControls.classes";
import SwiperBarPagination from "./SwiperBarPagination";
import SwiperNavButtons from "./SwiperNavButtons";

type SwiperBarControlsProps = {
  variant: SwiperBarVariant;
  count: number;
  activeIndex: number;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  ariaLabel?: string;
  paginationAriaLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
};

export default function SwiperBarControls({
  variant,
  count,
  activeIndex,
  isPrevDisabled,
  isNextDisabled,
  onSelect,
  onPrev,
  onNext,
  ariaLabel = "슬라이드 컨트롤",
  paginationAriaLabel,
  prevLabel,
  nextLabel,
}: SwiperBarControlsProps) {
  const classes = swiperBarClasses[variant];

  return (
    <div className={classes.controls} aria-label={ariaLabel}>
      <SwiperBarPagination
        variant={variant}
        count={count}
        activeIndex={activeIndex}
        onSelect={onSelect}
        ariaLabel={paginationAriaLabel}
      />
      <SwiperNavButtons
        variant={variant}
        isPrevDisabled={isPrevDisabled}
        isNextDisabled={isNextDisabled}
        onPrev={onPrev}
        onNext={onNext}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
      />
    </div>
  );
}
