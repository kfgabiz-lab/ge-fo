type BannerNavButtonsProps = {
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  onPrev: () => void;
  onNext: () => void;
  ariaLabel?: string;
};

export default function BannerNavButtons({
  isPrevDisabled,
  isNextDisabled,
  onPrev,
  onNext,
  ariaLabel = "Banner navigation",
}: BannerNavButtonsProps) {
  return (
    <div className="banner-nav" aria-label={ariaLabel}>
      <button
        type="button"
        className={
          isPrevDisabled
            ? "banner-nav__btn banner-nav__btn--prev is-disabled"
            : "banner-nav__btn banner-nav__btn--prev"
        }
        aria-label="Previous banner"
        aria-disabled={isPrevDisabled}
        disabled={isPrevDisabled}
        onClick={onPrev}
      >
        <span className="banner-nav__icon banner-nav__icon--prev" />
      </button>
      <button
        type="button"
        className={
          isNextDisabled
            ? "banner-nav__btn banner-nav__btn--next is-disabled"
            : "banner-nav__btn banner-nav__btn--next"
        }
        aria-label="Next banner"
        aria-disabled={isNextDisabled}
        disabled={isNextDisabled}
        onClick={onNext}
      >
        <span className="banner-nav__icon banner-nav__icon--next" />
      </button>
    </div>
  );
}
