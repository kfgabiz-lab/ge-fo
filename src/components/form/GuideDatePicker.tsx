"use client";

import { DatePicker, type DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";
import type { ComponentType } from "react";

function mergeClassNames(...parts: (string | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function GuideDatePickerOpenIcon() {
  return (
    <img
      src="/ico/ico_calendar_18.svg"
      alt=""
      width={18}
      height={18}
      loading="lazy"
      decoding="async"
    />
  );
}

export type GuideDatePickerProps = Omit<DatePickerProps, "value" | "onChange" | "minDate" | "maxDate"> & {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  className?: string;
};

export default function GuideDatePicker({
  id,
  value,
  onChange,
  min,
  max,
  placeholder,
  className,
  format = "YYYY-MM-DD",
  slotProps,
  slots,
  ...rest
}: GuideDatePickerProps) {
  const pickerValue = value ? dayjs(value) : null;
  const resolvedValue = pickerValue?.isValid() ? pickerValue : null;
  const fieldClassName = mergeClassNames(
    "guide_field",
    "guide_field--h50",
    "guide_field--search",
    className,
  );

  const openPickerButtonSlotProps =
    slotProps?.openPickerButton && typeof slotProps.openPickerButton === "object"
      ? slotProps.openPickerButton
      : undefined;

  const textFieldSlotProps =
    slotProps?.textField && typeof slotProps.textField === "object"
      ? slotProps.textField
      : undefined;

  const fieldSlotProps =
    slotProps?.field && typeof slotProps.field === "object" ? slotProps.field : undefined;

  return (
    <DatePicker
      value={resolvedValue}
      onChange={(newValue: Dayjs | null) => {
        onChange(newValue?.isValid() ? newValue.format("YYYY-MM-DD") : "");
      }}
      format={format}
      minDate={min ? dayjs(min) : undefined}
      maxDate={max ? dayjs(max) : undefined}
      slots={{
        openPickerIcon: GuideDatePickerOpenIcon as ComponentType,
        ...slots,
      }}
      slotProps={{
        ...slotProps,
        field: {
          clearable: false,
          "aria-label": placeholder,
          ...fieldSlotProps,
        },
        textField: {
          id,
          className: fieldClassName,
          ...textFieldSlotProps,
        },
        openPickerButton: {
          className: mergeClassNames(
            "guide_field__search-icon-button",
            "support_service_training_request__date-icon-button",
            openPickerButtonSlotProps?.className,
          ),
          "aria-label": "Open calendar",
          ...openPickerButtonSlotProps,
        },
      }}
      {...rest}
    />
  );
}
