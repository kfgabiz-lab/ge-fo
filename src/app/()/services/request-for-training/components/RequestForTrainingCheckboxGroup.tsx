"use client";

import { Checkbox } from "@mui/material";
import { useId } from "react";
import {
  GuideCheckboxIcon,
  guideCheckboxIconsContactConsent,
} from "@/components/form/GuideFieldIcons";

type RequestForTrainingCheckboxGroupProps = {
  legend: string;
  required?: boolean;
  options: readonly string[];
  selected: string[];
  onChange: (nextSelected: string[]) => void;
  hint?: string;
  layout?: "wrap" | "rows";
};

export default function RequestForTrainingCheckboxGroup({
  legend,
  required = false,
  options,
  selected,
  onChange,
  hint = "*Select all that apply.",
  layout = "wrap",
}: RequestForTrainingCheckboxGroupProps) {
  const groupId = useId();

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((value) => value !== option));
      return;
    }

    onChange([...selected, option]);
  };

  return (
    <fieldset
      className={`support_service_training_request__checkbox-group support_service_training_request__checkbox-group--${layout}${
        legend ? "" : " support_service_training_request__checkbox-group--no-legend"
      }`}
      aria-labelledby={legend ? groupId : undefined}
      aria-label={legend ? undefined : "Product options"}
    >
      {legend ? (
        <legend
          id={groupId}
          className="support_service_training_request__field-label support_service_training_request__checkbox-legend"
        >
          {legend}
          {required ? (
            <span className="support_service_training_request__required" aria-hidden>
              {" "}
              *
            </span>
          ) : null}
        </legend>
      ) : null}
      <div className="support_service_training_request__checkboxes">
        {options.map((option) => {
          const inputId = `${groupId}-${option.replace(/\W+/g, "-").toLowerCase()}`;
          const checked = selected.includes(option);

          return (
            <label
              key={option}
              className="support_service_training_request__checkbox-label"
              htmlFor={inputId}
            >
              <Checkbox
                id={inputId}
                className="guide_checkbox support_service_training_request__checkbox"
                disableRipple
                checked={checked}
                onChange={() => toggleOption(option)}
                icon={<GuideCheckboxIcon {...guideCheckboxIconsContactConsent} />}
                checkedIcon={
                  <GuideCheckboxIcon checked {...guideCheckboxIconsContactConsent} />
                }
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
      {hint ? (
        <p className="support_service_training_request__field-hint">{hint}</p>
      ) : null}
    </fieldset>
  );
}
