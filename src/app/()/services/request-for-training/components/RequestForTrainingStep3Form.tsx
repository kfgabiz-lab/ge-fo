"use client";

import { InputAdornment, TextField } from "@mui/material";
import { useId, useState } from "react";
import { requestForTrainingStep3Copy } from "@/data/services/requestForTrainingContent";
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";
import RequestForTrainingQuestionnaireIntro from "./RequestForTrainingQuestionnaireIntro";

export default function RequestForTrainingStep3Form() {
  const formId = useId();
  const { fields } = requestForTrainingStep3Copy;
  const [trainingFormat, setTrainingFormat] = useState<
    (typeof fields.trainingFormat.options)[number]
  >(fields.trainingFormat.options[0]);

  return (
    <div className="support_service_training_request__panel">
      <div className="support_service_training_request__panel-inner">
        <RequestForTrainingQuestionnaireIntro />

        <form
          className="support_service_training_request__form"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="support_service_training_request__form-grid">
            <div className="support_service_training_request__field support_service_training_request__field--full">
              <RequestForTrainingFieldLabel required>
                {fields.trainingFormat.label}
              </RequestForTrainingFieldLabel>
              <div
                className="support_service_training_request__radios"
                role="radiogroup"
                aria-label={fields.trainingFormat.label}
              >
                {fields.trainingFormat.options.map((option) => {
                  const inputId = `${formId}-format-${option.replace(/\s+/g, "-").toLowerCase()}`;
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
                        name={`${formId}-training-format`}
                        value={option}
                        checked={trainingFormat === option}
                        onChange={() => setTrainingFormat(option)}
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="support_service_training_request__field support_service_training_request__field--full">
              <RequestForTrainingFieldLabel htmlFor={`${formId}-location-name`} required>
                {fields.locationName.label}
              </RequestForTrainingFieldLabel>
              <TextField
                id={`${formId}-location-name`}
                className="guide_field guide_field--h50 support_service_training_request__input"
              />
            </div>

            <div className="support_service_training_request__field support_service_training_request__field--full">
              <RequestForTrainingFieldLabel htmlFor={`${formId}-street`} required>
                {fields.streetAddress.label}
              </RequestForTrainingFieldLabel>
              <div className="support_service_training_request__form-row support_service_training_request__form-row--address">
                <TextField
                  id={`${formId}-street`}
                  className="guide_field guide_field--h50 guide_field--search support_service_training_request__input support_service_training_request__input--search"
                  placeholder={fields.streetAddress.searchPlaceholder}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end" className="guide_field__search-adorn">
                          <button
                            type="button"
                            className="guide_field__search-icon-button"
                            aria-label="Search address"
                          >
                            <img
                              src="/ico/ico_search_24.svg"
                              alt=""
                              width={18}
                              height={18}
                              loading="lazy"
                              decoding="async"
                            />
                          </button>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  id={`${formId}-address-2`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.streetAddress.address2Placeholder}
                />
              </div>
            </div>

            <div className="support_service_training_request__form-row support_service_training_request__form-row--2">
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-city`}>
                  {fields.city.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-city`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.city.placeholder}
                />
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-state`}>
                  {fields.state.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-state`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.state.placeholder}
                />
              </div>
            </div>

            <div className="support_service_training_request__field support_service_training_request__field--full">
              <RequestForTrainingFieldLabel htmlFor={`${formId}-zip`}>
                {fields.zip.label}
              </RequestForTrainingFieldLabel>
              <TextField
                id={`${formId}-zip`}
                className="guide_field guide_field--h50 support_service_training_request__input"
                placeholder={fields.zip.placeholder}
              />
            </div>

            <div className="support_service_training_request__field support_service_training_request__field--full">
              <RequestForTrainingFieldLabel htmlFor={`${formId}-contact-person`}>
                {fields.contactPerson.label}
              </RequestForTrainingFieldLabel>
              <TextField
                id={`${formId}-contact-person`}
                className="guide_field guide_field--h50 support_service_training_request__input"
              />
            </div>

            <div className="support_service_training_request__field support_service_training_request__field--full">
              <RequestForTrainingFieldLabel htmlFor={`${formId}-contact-details`} required>
                {fields.contactDetails.label}
              </RequestForTrainingFieldLabel>
              <TextField
                id={`${formId}-contact-details`}
                className="guide_field guide_field--h50 support_service_training_request__input"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
