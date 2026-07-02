"use client";

import { Checkbox, TextField } from "@mui/material";
import Link from "next/link";
import { useId, useState } from "react";
import {
  GuideCheckboxIcon,
  guideCheckboxIconsContactConsent,
} from "@/components/form/GuideFieldIcons";
import {
  requestForTrainingAssets,
  requestForTrainingStep4AutomationFields,
  requestForTrainingStep4Copy,
  type RequestForTrainingStep4Variant,
} from "@/data/services/requestForTrainingContent";
import RequestForTrainingCheckboxGroup from "./RequestForTrainingCheckboxGroup";
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";
import RequestForTrainingProductSection from "./RequestForTrainingProductSection";
import RequestForTrainingQuestionnaireIntro from "./RequestForTrainingQuestionnaireIntro";

export default function RequestForTrainingStep4Form({
  variant,
}: {
  variant: RequestForTrainingStep4Variant;
}) {
  const formId = useId();
  const { fields } = requestForTrainingStep4Copy;
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [studentInvolvement, setStudentInvolvement] = useState<string[]>([]);
  const [vfdUnderstanding, setVfdUnderstanding] = useState<"yes" | "no">("yes");
  const [vfdTopics, setVfdTopics] = useState<string[]>([]);

  return (
    <div className="support_service_training_request__panel support_service_training_request__panel--bordered">
      <div className="support_service_training_request__panel-inner">
        <RequestForTrainingQuestionnaireIntro />

        <form
          className="support_service_training_request__form"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="support_service_training_request__form-grid support_service_training_request__form-grid--step4">
            <RequestForTrainingProductSection
              label={fields.products.label}
              required={fields.products.required}
              hint={fields.products.hint}
              variant={variant}
            />

            {variant === "automation" ? (
              <>
                <RequestForTrainingCheckboxGroup
                  legend={requestForTrainingStep4AutomationFields.jobTitles.label}
                  required
                  options={requestForTrainingStep4AutomationFields.jobTitles.options}
                  selected={jobTitles}
                  onChange={setJobTitles}
                />

                <RequestForTrainingCheckboxGroup
                  legend={requestForTrainingStep4AutomationFields.studentInvolvement.label}
                  required
                  options={requestForTrainingStep4AutomationFields.studentInvolvement.options}
                  selected={studentInvolvement}
                  onChange={setStudentInvolvement}
                />

                <div className="support_service_training_request__field support_service_training_request__field--full">
                  <RequestForTrainingFieldLabel required>
                    {requestForTrainingStep4AutomationFields.vfdUnderstanding.label}
                  </RequestForTrainingFieldLabel>
                  <div
                    className="support_service_training_request__radios"
                    role="radiogroup"
                    aria-label={
                      requestForTrainingStep4AutomationFields.vfdUnderstanding.label
                    }
                  >
                    {(["yes", "no"] as const).map((value) => {
                      const inputId = `${formId}-vfd-${value}`;
                      const label = value === "yes" ? "Yes" : "No";
                      return (
                        <label
                          key={value}
                          className="support_service_training_request__radio-label"
                          htmlFor={inputId}
                        >
                          <input
                            id={inputId}
                            className="support_service_training_request__radio"
                            type="radio"
                            name={`${formId}-vfd-understanding`}
                            value={value}
                            checked={vfdUnderstanding === value}
                            onChange={() => setVfdUnderstanding(value)}
                          />
                          <span>{label}</span>
                        </label>
                      );
                    })}
                  </div>
                  {vfdUnderstanding === "yes" ? (
                    <div className="support_service_training_request__product-panel support_service_training_request__product-panel--nested">
                      <RequestForTrainingCheckboxGroup
                        legend=""
                        options={
                          requestForTrainingStep4AutomationFields.vfdUnderstanding
                            .yesFollowUpOptions
                        }
                        selected={vfdTopics}
                        onChange={setVfdTopics}
                      />
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}

            <div className="support_service_training_request__field support_service_training_request__field--full">
              <RequestForTrainingFieldLabel htmlFor={`${formId}-comments`}>
                {fields.comments.label}
              </RequestForTrainingFieldLabel>
              <TextField
                id={`${formId}-comments`}
                className="guide_field support_service_training_request__input support_service_training_request__input--textarea"
                placeholder={fields.comments.placeholder}
                multiline
              />
            </div>

            <hr className="support_service_training_request__form-divider" />

            <div className="support_service_training_request__consent">
              <label className="support_service_training_request__consent-label">
                <Checkbox
                  className="guide_checkbox support_service_training_request__checkbox"
                  disableRipple
                  icon={<GuideCheckboxIcon {...guideCheckboxIconsContactConsent} />}
                  checkedIcon={
                    <GuideCheckboxIcon checked {...guideCheckboxIconsContactConsent} />
                  }
                />
                <span>{fields.consent.label}</span>
              </label>
              <Link
                href={fields.consent.termsHref}
                className="support_service_training_request__terms-link"
              >
                {fields.consent.termsLabel}
              </Link>
            </div>

            <img
              className="support_service_training_request__recaptcha"
              src={requestForTrainingAssets.recaptcha}
              alt=""
              width={270}
              height={68}
              loading="lazy"
              decoding="async"
              aria-hidden
            />
          </div>
        </form>
      </div>
    </div>
  );
}
