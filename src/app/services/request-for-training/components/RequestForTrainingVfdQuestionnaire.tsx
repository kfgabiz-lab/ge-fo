"use client";

import { useId } from "react";
import { requestForTrainingStep4Copy } from "@/data/services/requestForTrainingContent";
import RequestForTrainingCheckboxGroup from "./RequestForTrainingCheckboxGroup";
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";
import { useRequestForTrainingForm } from "./RequestForTrainingProvider";

// 기획서(traning_req4dc.png) item2 — Variable Frequency Drive 제품을 선택한 경우에만 노출되는 3문항.
// 노출 조건 판별은 상위(RequestForTrainingStep4Form)에서 하고, 여기서는 문항만 그린다.
// 입력값은 Provider(step4) 에 보관하므로 조건이 꺼졌다 다시 켜져도 값이 유지된다.
const VFD_UNDERSTANDING_OPTIONS = ["Yes", "No"] as const;

export default function RequestForTrainingVfdQuestionnaire() {
  const formId = useId();
  const { fields } = requestForTrainingStep4Copy;
  const { step4, setStep4Field } = useRequestForTrainingForm();

  return (
    <>
      <RequestForTrainingCheckboxGroup
        legend={fields.jobTitles.label}
        required={fields.jobTitles.required}
        options={fields.jobTitles.options}
        selected={step4.jobTitles}
        onChange={(next) => setStep4Field("jobTitles", next)}
      />

      <RequestForTrainingCheckboxGroup
        legend={fields.studentInvolvement.label}
        required={fields.studentInvolvement.required}
        options={fields.studentInvolvement.options}
        selected={step4.studentInvolvement}
        onChange={(next) => setStep4Field("studentInvolvement", next)}
      />

      <div className="support_service_training_request__field support_service_training_request__field--full">
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
                  onChange={() => setStep4Field("vfdUnderstanding", option)}
                />
                <span>{option}</span>
              </label>
            );
          })}
        </div>

        {/* Yes 인 경우에만 하위 체크박스 노출 — 하위 항목 자체는 필수가 아니다. */}
        {step4.vfdUnderstanding === "Yes" ? (
          <div className="support_service_training_request__product-panel support_service_training_request__product-panel--nested">
            <RequestForTrainingCheckboxGroup
              legend=""
              options={fields.vfdUnderstanding.yesFollowUpOptions}
              selected={step4.vfdUnderstandingTopics}
              onChange={(next) => setStep4Field("vfdUnderstandingTopics", next)}
              hint="(Select all that apply.)"
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
