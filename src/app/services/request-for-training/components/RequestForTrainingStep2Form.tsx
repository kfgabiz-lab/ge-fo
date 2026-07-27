"use client";

import { TextField } from "@mui/material";
import { useId } from "react";
import GuideDatePicker from "@/components/form/GuideDatePicker";
import GuideDatePickerProvider from "@/components/form/GuideDatePickerProvider";
import { requestForTrainingStep2Copy } from "@/data/services/requestForTrainingContent";
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";
import RequestForTrainingQuestionnaireIntro from "./RequestForTrainingQuestionnaireIntro";
import { useRequestForTrainingForm } from "./RequestForTrainingProvider";
import type { RequestForTrainingStep2Errors } from "./RequestForTrainingStep2";

const SESSION_COUNT_MAX = 200;
const STUDENT_COUNT_MAX = 18;

function filterLettersAndDigits(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, "").slice(0, SESSION_COUNT_MAX);
}

function filterDigitsOnly(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

function filterStudentCount(value: string): string {
  const digits = value.replace(/[^0-9]/g, "");
  if (digits === "") return "";
  return Number(digits) > STUDENT_COUNT_MAX ? String(STUDENT_COUNT_MAX) : digits;
}

function RequestStudentCountLabel({
  htmlFor,
  label,
  hint,
}: {
  htmlFor: string;
  label: string;
  hint: string;
}) {
  return (
    <label
      className="support_service_training_request__field-label support_service_training_request__field-label--stacked"
      htmlFor={htmlFor}
    >
      <span className="support_service_training_request__field-label-line">{label}</span>
      <span className="support_service_training_request__field-label-sub">
        <span className="support_service_training_request__field-label-hint">{hint}</span>
        <span className="support_service_training_request__required" aria-hidden>
          {" "}
          *
        </span>
      </span>
    </label>
  );
}

export default function RequestForTrainingStep2Form({
  errors,
  onClearError,
  todayStr,
}: {
  errors: RequestForTrainingStep2Errors;
  onClearError: (key: keyof RequestForTrainingStep2Errors) => void;
  todayStr: string;
}) {
  const formId = useId();
  const { fields } = requestForTrainingStep2Copy;
  const { step2, setStep2Field } = useRequestForTrainingForm();

  const handleScheduleStartChange = (value: string) => {
    setStep2Field("scheduleStart", value);
    onClearError("scheduleStart");
    if (step2.scheduleEnd && value && step2.scheduleEnd < value) {
      setStep2Field("scheduleEnd", "");
    }
  };

  return (
    <div className="support_service_training_request__panel">
      <div className="support_service_training_request__panel-inner">
        <RequestForTrainingQuestionnaireIntro />

        <form
          className="support_service_training_request__form"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="support_service_training_request__form-grid">
            <div className="support_service_training_request__form-row support_service_training_request__form-row--2">
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-session-count`} required>
                  {fields.sessionCount.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-session-count`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  value={step2.sessionCount}
                  error={Boolean(errors.sessionCount)}
                  onChange={(event) => {
                    setStep2Field("sessionCount", filterLettersAndDigits(event.target.value));
                    onClearError("sessionCount");
                  }}
                />
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-session-days`} required>
                  {fields.sessionDays.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-session-days`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  value={step2.sessionDays}
                  error={Boolean(errors.sessionDays)}
                  onChange={(event) => {
                    setStep2Field("sessionDays", filterDigitsOnly(event.target.value));
                    onClearError("sessionDays");
                  }}
                />
              </div>
            </div>

            <div className="support_service_training_request__form-row support_service_training_request__form-row--schedule">
              <div className="support_service_training_request__field support_service_training_request__field--schedule">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-schedule-start`} required>
                  {fields.scheduleDates.label}
                </RequestForTrainingFieldLabel>
                <GuideDatePickerProvider>
                  <div className="support_service_training_request__date-range">
                    <div className="support_service_training_request__date-field">
                      <GuideDatePicker
                        id={`${formId}-schedule-start`}
                        placeholder={fields.scheduleDates.placeholder}
                        value={step2.scheduleStart}
                        onChange={handleScheduleStartChange}
                        min={todayStr}
                        max={step2.scheduleEnd || undefined}
                        className="support_service_training_request__input support_service_training_request__input--date"
                        slotProps={{
                          textField: { error: Boolean(errors.scheduleStart) },
                        }}
                      />
                    </div>
                    <span
                      className="support_service_training_request__date-separator"
                      aria-hidden
                    />
                    <div className="support_service_training_request__date-field">
                      <GuideDatePicker
                        id={`${formId}-schedule-end`}
                        placeholder={fields.scheduleDates.placeholder}
                        value={step2.scheduleEnd}
                        onChange={(value) => {
                          setStep2Field("scheduleEnd", value);
                          onClearError("scheduleEnd");
                        }}
                        min={step2.scheduleStart || todayStr}
                        className="support_service_training_request__input support_service_training_request__input--date"
                        slotProps={{
                          textField: { error: Boolean(errors.scheduleEnd) },
                        }}
                      />
                    </div>
                  </div>
                </GuideDatePickerProvider>
              </div>
              <div className="support_service_training_request__field support_service_training_request__field--students">
                <RequestStudentCountLabel
                  htmlFor={`${formId}-student-count`}
                  label={fields.studentCount.label}
                  hint={fields.studentCount.hint}
                />
                <TextField
                  id={`${formId}-student-count`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  value={step2.studentCount}
                  error={Boolean(errors.studentCount)}
                  onChange={(event) => {
                    setStep2Field("studentCount", filterStudentCount(event.target.value));
                    onClearError("studentCount");
                  }}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
