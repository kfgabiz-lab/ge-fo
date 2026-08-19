import type { SvgIconProps } from "@mui/material/SvgIcon";

export const guideFieldLabelSlot = {
  inputLabel: { shrink: true },
} as const;

export const guideCheckboxIconsDefault = {
  uncheckedSrc: "/ico/ico_check.svg",
  checkedSrc: "/ico/ico_checked.svg",
} as const;

export const guideCheckboxIconsDownloads = {
  uncheckedSrc: "/ico/ico_check_block.svg",
  checkedSrc: "/ico/ico_checked_black.svg",
} as const;

export const guideCheckboxIconsContactConsent = {
  uncheckedSrc: "/ico/ico_checkbox_off_22.webp",
  checkedSrc: "/ico/ico_checkbox_on_22.webp",
  disabledCheckedSrc: "/ico/ico_checkbox_disabled_on_22.webp",
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
