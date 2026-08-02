"use client";

import { useEffect, useId, useState } from "react";
import {
  emptyRequestForTrainingStep4Options,
  fetchRequestForTrainingStep4Options,
  type RequestForTrainingStep4Options,
} from "@/app/services/request-for-training/data/requestForTrainingCodes";
import { requestForTrainingStep4Copy } from "@/data/services/requestForTrainingContent";
import RequestForTrainingCheckboxGroup from "./RequestForTrainingCheckboxGroup";
import RequestForTrainingFieldError from "./RequestForTrainingFieldError";
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";
import { useRequestForTrainingForm } from "./RequestForTrainingProvider";

const VFD_UNDERSTANDING_OPTIONS = ["Yes", "No"] as const;

export type RequestForTrainingVfdErrors = {
  jobTitles?: boolean;
  studentInvolvement?: boolean;
  vfdUnderstanding?: boolean;
};

export default function RequestForTrainingVfdQuestionnaire({
  errors = {},
  onClearError,
}: {
  errors?: RequestForTrainingVfdErrors;
  onClearError?: (key: keyof RequestForTrainingVfdErrors) => void;
} = {}) {
  const formId = useId();
  const { fields } = requestForTrainingStep4Copy;
  const { step4, setStep4Field } = useRequestForTrainingForm();

  const [codeOptions, setCodeOptions] = useState<RequestForTrainingStep4Options>(
    emptyRequestForTrainingStep4Options,
  );

  useEffect(() => {
    let alive = true;
    fetchRequestForTrainingStep4Options().then((options) => {
      if (alive) setCodeOptions(options);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <RequestForTrainingCheckboxGroup
        legend={fields.jobTitles.label}
        required={fields.jobTitles.required}
        options={codeOptions.jobTitles}
        selected={step4.jobTitles}
        onChange={(next) => {
          setStep4Field("jobTitles", next);
          onClearError?.("jobTitles");
        }}
        error={Boolean(errors.jobTitles)}
      />

      <RequestForTrainingCheckboxGroup
        legend={fields.studentInvolvement.label}
        required={fields.studentInvolvement.required}
        options={codeOptions.studentInvolvement}
        selected={step4.studentInvolvement}
        onChange={(next) => {
          setStep4Field("studentInvolvement", next);
          onClearError?.("studentInvolvement");
        }}
        error={Boolean(errors.studentInvolvement)}
      />

      <div
        className={[
          "support_service_training_request__field",
          "support_service_training_request__field--full",
          errors.vfdUnderstanding ? "support_service_training_request__field--error" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <RequestForTrainingFieldLabel required={fields.vfdUnderstanding.required}>
          {fields.vfdUnderstanding.label}
        </RequestForTrainingFieldLabel>
        <div
          className="support_service_training_request__radios"
          role="radiogroup"
          aria-label={fields.vfdUnderstanding.label}
        >
          {VFD_UNDERSTANDING_OPTIONS.map((option) => {
            const inputId = `${formId}-vfd-${option.toLowerCase()}`;
            return (
              <label
                key={option}
                className="support_service_training_request__radio-label"
                htmlFor={inputId}
              >
                <input
                  id={inputId}
                  className="support_service_training_request__radio"
                  type="radio"
                  name={`${formId}-vfd-understanding`}
                  value={option}
                  checked={step4.vfdUnderstanding === option}
                  onChange={() => {
                    setStep4Field("vfdUnderstanding", option);
                    onClearError?.("vfdUnderstanding");
                  }}
                />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
        {errors.vfdUnderstanding ? (
          <RequestForTrainingFieldError message="Please select Yes or No." />
        ) : null}

        {step4.vfdUnderstanding === "Yes" ? (
          <div className="support_service_training_request__product-panel support_service_training_request__product-panel--nested">
            <RequestForTrainingCheckboxGroup
              legend=""
              options={codeOptions.vfdTopics}
              selected={step4.vfdUnderstandingTopics}
              onChange={(next) => setStep4Field("vfdUnderstandingTopics", next)}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
