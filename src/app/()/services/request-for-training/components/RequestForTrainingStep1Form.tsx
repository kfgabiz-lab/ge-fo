"use client";

import { FormControl, InputAdornment, MenuItem, TextField } from "@mui/material";
import { useId, useState } from "react";
import GuideSelect from "@/components/form/GuideSelect";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import {
  requestForTrainingSubtypeOptions,
  requestForTrainingTypeOptions,
} from "@/data/services/requestForTrainingContent";
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";
import RequestForTrainingQuestionnaireIntro from "./RequestForTrainingQuestionnaireIntro";

export default function RequestForTrainingStep1Form() {
  const formId = useId();
  type TrainingTypeId = (typeof requestForTrainingTypeOptions)[number]["id"];
  const [trainingType, setTrainingType] = useState<TrainingTypeId>(
    requestForTrainingTypeOptions[0].id,
  );
  const [trainingSubtype, setTrainingSubtype] = useState<string>(
    requestForTrainingSubtypeOptions[0],
  );

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
              <RequestForTrainingFieldLabel required>Training Type</RequestForTrainingFieldLabel>
              <div
                className="support_service_training_request__radios"
                role="radiogroup"
                aria-label="Training Type"
              >
                {requestForTrainingTypeOptions.map((option) => {
                  const inputId = `${formId}-${option.id}`;
                  return (
                    <label
                      key={option.id}
                      className="support_service_training_request__radio-label"
                      htmlFor={inputId}
                    >
                      <input
                        id={inputId}
                        className="support_service_training_request__radio"
                        type="radio"
                        name={`${formId}-training-type`}
                        value={option.id}
                        checked={trainingType === option.id}
                        onChange={() => setTrainingType(option.id)}
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="support_service_training_request__field support_service_training_request__field--select">
              <RequestForTrainingFieldLabel htmlFor={`${formId}-training-subtype`} required>
                Training Type
              </RequestForTrainingFieldLabel>
              <FormControl className="guide_field guide_field--h50 support_service_training_request__select">
                <GuideSelect
                  value={trainingSubtype}
                  onChange={(event) => setTrainingSubtype(event.target.value as string)}
                  IconComponent={GuideSelectIcon}
                  inputProps={{
                    "aria-label": "Training Type",
                    id: `${formId}-training-subtype`,
                  }}
                  renderValue={(value) => (
                    <span className="guide_field__select-value" title={String(value)}>
                      {String(value)}
                    </span>
                  )}
                >
                  {requestForTrainingSubtypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </GuideSelect>
              </FormControl>
            </div>

            <div className="support_service_training_request__form-row support_service_training_request__form-row--2">
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-first-name`} required>
                  First Name
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-first-name`}
                  className="guide_field support_service_training_request__input"
                  placeholder="First Name"
                />
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-last-name`}>
                  Last Name
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-last-name`}
                  className="guide_field support_service_training_request__input"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className="support_service_training_request__form-row">
              <div className="support_service_training_request__field support_service_training_request__field--full">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-company`} required>
                  Company
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-company`}
                  className="guide_field support_service_training_request__input"
                  placeholder="Company"
                />
              </div>
            </div>

            <div className="support_service_training_request__form-row support_service_training_request__form-row--address">
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-street`} required>
                  Street Address
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-street`}
                  className="guide_field guide_field--search support_service_training_request__input support_service_training_request__input--search"
                  placeholder="Keyword Search"
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
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-address-2`}>
                  Address 2
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-address-2`}
                  className="guide_field support_service_training_request__input"
                  placeholder="Address 2"
                />
              </div>
            </div>

            <div className="support_service_training_request__form-row support_service_training_request__form-row--2">
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-city`} required>
                  City
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-city`}
                  className="guide_field support_service_training_request__input"
                  placeholder="City"
                />
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-state`} required>
                  State/Province
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-state`}
                  className="guide_field support_service_training_request__input"
                  placeholder="State/Province"
                />
              </div>
            </div>

            <div className="support_service_training_request__form-row support_service_training_request__form-row--2">
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-zip`} required>
                  ZIP / Postal Code
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-zip`}
                  className="guide_field support_service_training_request__input"
                  placeholder="ZIP / Postal Code"
                />
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-phone`} required>
                  Phone
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-phone`}
                  className="guide_field support_service_training_request__input"
                  placeholder="Phone"
                  type="tel"
                />
              </div>
            </div>

            <div className="support_service_training_request__form-row support_service_training_request__form-row--2">
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-cell-phone`}>
                  Cell Phone
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-cell-phone`}
                  className="guide_field support_service_training_request__input"
                  placeholder="Cell Phone"
                  type="tel"
                />
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-sales-contact`}>
                  Sales Contact
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-sales-contact`}
                  className="guide_field support_service_training_request__input"
                  placeholder="Sales Contact"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
