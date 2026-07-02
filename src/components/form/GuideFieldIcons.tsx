import type { SvgIconProps } from "@mui/material/SvgIcon";

export const guideFieldLabelSlot = {
  inputLabel: { shrink: true },
} as const;

/** 컴포넌트 가이드 · Footer 체크박스 (22px) */
export const guideCheckboxIconsDefault = {
  uncheckedSrc: "/ico/ico_check.svg",
  checkedSrc: "/ico/ico_checked.svg",
} as const;

/** 제품 상세 Downloads 필터 체크박스 (22px) */
export const guideCheckboxIconsDownloads = {
  uncheckedSrc: "/ico/ico_check_block.svg",
  checkedSrc: "/ico/ico_checked_black.svg",
} as const;

/** Contact Us 동의 체크박스 (22px, Figma Check 2030:31397/31398) */
export const guideCheckboxIconsContactConsent = {
  uncheckedSrc: "/ico/ico_checkbox_off_22.png",
  checkedSrc: "/ico/ico_checkbox_on_22.png",
} as const;

export function GuideSelectIcon({ className }: SvgIconProps) {
  return (
    <span
      className={
        className ? `guide_field__select-icon ${className}` : "guide_field__select-icon"
      }
      aria-hidden
    />
  );
}

type GuideCheckboxIconProps = {
  checked?: boolean;
  uncheckedSrc?: string;
  checkedSrc?: string;
};

export function GuideCheckboxIcon({
  checked = false,
  uncheckedSrc = guideCheckboxIconsDefault.uncheckedSrc,
  checkedSrc = guideCheckboxIconsDefault.checkedSrc,
}: GuideCheckboxIconProps) {
  return (
    <img loading="lazy" decoding="async"
      src={checked ? checkedSrc : uncheckedSrc}
      alt=""
      width={22}
      height={22}
      className="guide_checkbox__icon"
      aria-hidden
    />
  );
}
