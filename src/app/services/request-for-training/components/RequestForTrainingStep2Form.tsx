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

// 기획서(traning_req2dc.png) 입력 제한 — 허용되지 않는 문자는 입력 시점에 자동 제거한다.
const SESSION_COUNT_MAX = 200; // 교육 세션 수: 영문+숫자만, 최대 200byte
// 교육 기간(sessionDays)은 기획서상 "최대 20byte"가 있으나 사용자 확정으로 별도 글자수 제한 없음(숫자만 필터만 적용).
const STUDENT_COUNT_MAX = 18; // 교육 인원 수: 1~18만 허용(19 이상 차단, 사용자 확정 — 원본 힌트 "Maximum 18 per session"과 경계값 일치)

/** 영문자+숫자만 남기고 최대 200자로 자름 */
function filterLettersAndDigits(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, "").slice(0, SESSION_COUNT_MAX);
}

/** 숫자만 남김(길이 제한 없음) */
function filterDigitsOnly(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

/** 숫자만 남기고 18 초과 시 18로 고정 */
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

// 입력값은 스텝 간 유지를 위해 Provider(Context + sessionStorage)에서 관리하고,
// 필수값 누락 표시(errors)는 Next 클릭 시점에 상위(RequestForTrainingStep2)에서 내려준다.
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

  // 시작일 변경 시 종료일이 시작일보다 이전이면 초기화(원본 로직 그대로)
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
