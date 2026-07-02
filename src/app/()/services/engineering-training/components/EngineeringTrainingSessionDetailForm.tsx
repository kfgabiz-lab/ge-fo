"use client";

import {
  Checkbox,
  FormControl,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useId } from "react";
import {
  GuideCheckboxIcon,
  GuideSelectIcon,
  guideCheckboxIconsContactConsent,
} from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import type { EngineeringTrainingSessionDetail } from "@/data/services/engineeringTrainingSessionDetailContent";
import { engineeringTrainingSessionAssets } from "@/data/services/engineeringTrainingSessionDetailContent";

function SessionFieldLabel({
  children,
  required = false,
  htmlFor,
}: {
  children: string;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label
      className="support_service_training_session_detail__field-label"
      htmlFor={htmlFor}
    >
      {children}
      {required ? (
        <span className="support_service_training_session_detail__required" aria-hidden>
          {" "}
          *
        </span>
      ) : null}
    </label>
  );
}

export default function EngineeringTrainingSessionDetailForm({
  session,
}: {
  session: EngineeringTrainingSessionDetail;
}) {
  const formId = useId();
  const eventDateDisplay = session.sidebar.eventDateToAttend;

  return (
    <form
      className="support_service_training_session_detail__form"
      id="session-registration"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="support_service_training_session_detail__form-grid">
        <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--2">
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-student-name`} required>
              Student Name
            </SessionFieldLabel>
            <TextField
              id={`${formId}-student-name`}
              className="guide_field support_service_training_session_detail__input"
              placeholder="Student Name"
            />
          </div>
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-email`} required>
              E-mail Address
            </SessionFieldLabel>
            <TextField
              id={`${formId}-email`}
              className="guide_field support_service_training_session_detail__input"
              placeholder="E-mail Address"
              type="email"
            />
          </div>
        </div>

        <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--2">
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-job-title`} required>
              Job Title
            </SessionFieldLabel>
            <TextField
              id={`${formId}-job-title`}
              className="guide_field support_service_training_session_detail__input"
              placeholder="Job Title"
            />
          </div>
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-phone`} required>
              Phone
            </SessionFieldLabel>
            <TextField
              id={`${formId}-phone`}
              className="guide_field support_service_training_session_detail__input"
              placeholder="Phone"
              type="tel"
            />
          </div>
        </div>

        <div className="support_service_training_session_detail__form-row">
          <div className="support_service_training_session_detail__field support_service_training_session_detail__field--full">
            <SessionFieldLabel htmlFor={`${formId}-company`} required>
              Company
            </SessionFieldLabel>
            <TextField
              id={`${formId}-company`}
              className="guide_field support_service_training_session_detail__input"
              placeholder="Company"
            />
          </div>
        </div>

        <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--address">
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-street`}>
              Street Address
            </SessionFieldLabel>
            <TextField
              id={`${formId}-street`}
              className="guide_field guide_field--search support_service_training_session_detail__input"
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
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-address-2`}>
              Address 2
            </SessionFieldLabel>
            <TextField
              id={`${formId}-address-2`}
              className="guide_field support_service_training_session_detail__input"
              placeholder="Address 2"
            />
          </div>
        </div>

        <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--2">
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-apartment`}>
              Apartment, suite, etc
            </SessionFieldLabel>
            <TextField
              id={`${formId}-apartment`}
              className="guide_field support_service_training_session_detail__input"
              placeholder="Apartment, suite, etc"
            />
          </div>
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-city`}>City</SessionFieldLabel>
            <TextField
              id={`${formId}-city`}
              className="guide_field support_service_training_session_detail__input"
              placeholder="City"
            />
          </div>
        </div>

        <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--2">
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-state`}>
              State/Province
            </SessionFieldLabel>
            <TextField
              id={`${formId}-state`}
              className="guide_field support_service_training_session_detail__input"
              placeholder="State/Province"
            />
          </div>
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-zip`}>
              ZIP / Postal Code
            </SessionFieldLabel>
            <TextField
              id={`${formId}-zip`}
              className="guide_field support_service_training_session_detail__input"
              placeholder="ZIP / Postal Code"
            />
          </div>
        </div>

        <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--2">
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-position`}>Position</SessionFieldLabel>
            <FormControl className="guide_field guide_field--h50">
              <GuideSelect
                defaultValue={session.positionOptions[0]}
                IconComponent={GuideSelectIcon}
                inputProps={{ "aria-label": "Position", id: `${formId}-position` }}
                renderValue={(value) => (
                  <span className="guide_field__select-value" title={String(value)}>
                    {String(value)}
                  </span>
                )}
              >
                {session.positionOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </GuideSelect>
            </FormControl>
          </div>
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-event-date`} required>
              Event Date to Attend
            </SessionFieldLabel>
            <TextField
              id={`${formId}-event-date`}
              className="guide_field support_service_training_session_detail__input support_service_training_session_detail__input--readonly"
              value={eventDateDisplay}
              slotProps={{ input: { readOnly: true } }}
            />
          </div>
        </div>

        <hr className="support_service_training_session_detail__form-divider" />

        <div className="support_service_training_session_detail__consent">
          <label className="support_service_training_session_detail__consent-label">
            <Checkbox
              className="guide_checkbox"
              disableRipple
              icon={<GuideCheckboxIcon {...guideCheckboxIconsContactConsent} />}
              checkedIcon={
                <GuideCheckboxIcon checked {...guideCheckboxIconsContactConsent} />
              }
            />
            <span>Consent to Collection and Use of Personal Information</span>
          </label>
          <Link
            href="/support/contact-us/terms"
            className="support_service_training_session_detail__terms-link"
          >
            View Full Terms
          </Link>
        </div>

        <img
          className="support_service_training_session_detail__recaptcha"
          src={engineeringTrainingSessionAssets.recaptcha}
          alt=""
          width={270}
          height={68}
          loading="lazy"
          decoding="async"
          aria-hidden
        />
      </div>
    </form>
  );
}
