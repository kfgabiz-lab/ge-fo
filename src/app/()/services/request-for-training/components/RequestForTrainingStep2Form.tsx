"use client";

import { TextField } from "@mui/material";
import { useId, useState } from "react";
import GuideDatePicker from "@/components/form/GuideDatePicker";
import GuideDatePickerProvider from "@/components/form/GuideDatePickerProvider";
import { requestForTrainingStep2Copy } from "@/data/services/requestForTrainingContent";
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";
import RequestForTrainingQuestionnaireIntro from "./RequestForTrainingQuestionnaireIntro";

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

export default function RequestForTrainingStep2Form() {
  const formId = useId();
  const { fields } = requestForTrainingStep2Copy;
  const [scheduleStart, setScheduleStart] = useState("");
  const [scheduleEnd, setScheduleEnd] = useState("");

  const handleScheduleStartChange = (value: string) => {
    setScheduleStart(value);
    if (scheduleEnd && value && scheduleEnd < value) {
      setScheduleEnd("");
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
                />
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-session-days`} required>
                  {fields.sessionDays.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-session-days`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
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
                        value={scheduleStart}
                        onChange={handleScheduleStartChange}
                        max={scheduleEnd || undefined}
                        className="support_service_training_request__input support_service_training_request__input--date"
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
                        value={scheduleEnd}
                        onChange={setScheduleEnd}
                        min={scheduleStart || undefined}
                        className="support_service_training_request__input support_service_training_request__input--date"
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
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
