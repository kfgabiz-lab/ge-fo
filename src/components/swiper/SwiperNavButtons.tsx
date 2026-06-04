import {
  swiperBarClasses,
  type SwiperBarVariant,
} from "./swiperControls.classes";

type SwiperNavButtonsProps = {
  variant: SwiperBarVariant;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  onPrev: () => void;
  onNext: () => void;
  prevLabel?: string;
  nextLabel?: string;
};

export default function SwiperNavButtons({
  variant,
  isPrevDisabled,
  isNextDisabled,
  onPrev,
  onNext,
  prevLabel = "이전 슬라이드",
  nextLabel = "다음 슬라이드",
}: SwiperNavButtonsProps) {
  const classes = swiperBarClasses[variant];

  return (
    <div className={classes.nav}>
      <button
        type="button"
        className={
          isPrevDisabled
            ? `${classes.btn} ${classes.btn}--prev is-disabled`
            : `${classes.btn} ${classes.btn}--prev`
        }
        aria-label={prevLabel}
        aria-disabled={isPrevDisabled}
        disabled={isPrevDisabled}
        onClick={onPrev}
      >
        <span className={`${classes.icon} ${classes.icon}--prev`} />
      </button>
      <button
        type="button"
        className={
          isNextDisabled
            ? `${classes.btn} ${classes.btn}--next is-disabled`
            : `${classes.btn} ${classes.btn}--next`
        }
        aria-label={nextLabel}
        aria-disabled={isNextDisabled}
        disabled={isNextDisabled}
        onClick={onNext}
      >
        <span className={`${classes.icon} ${classes.icon}--next`} />
      </button>
    </div>
  );
}
