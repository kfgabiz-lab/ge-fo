import {
  requestForTrainingAssets,
  getRequestForTrainingSteps,
  type RequestForTrainingStepNumber,
} from "@/data/services/requestForTrainingContent";
import { Fragment, type CSSProperties } from "react";

export default function RequestForTrainingSteps({
  currentStep,
}: {
  currentStep: RequestForTrainingStepNumber;
}) {
  const steps = getRequestForTrainingSteps(currentStep);

  return (
    <div
      className="support_service_training_request__steps"
      style={
        {
          "--support-training-steps-bg": `url(${requestForTrainingAssets.stepBarBg})`,
        } as CSSProperties
      }
    >
      <div className="support_service_training_request__steps-list" role="list">
        {steps.map((step, index) => (
          <Fragment key={step.id}>
            <div
              className={`support_service_training_request__step${
                step.status === "active" ? " is-active" : ""
              }${step.status === "completed" ? " is-completed" : ""}`}
              role="listitem"
            >
              <div className="support_service_training_request__step-icon">
                <img
                  className="support_service_training_request__step-icon-img"
                  src={step.icon}
                  alt=""
                  width={step.status === "completed" ? 16 : 24}
                  height={step.status === "completed" ? 16 : 24}
                  loading="lazy"
                  decoding="async"
                />
                <span className="support_service_training_request__step-num" aria-hidden>
                  {index + 1}
                </span>
              </div>
              <div className="support_service_training_request__step-text">
                <span className="support_service_training_request__step-label">
                  {step.stepLabel}
                </span>
                <span className="support_service_training_request__step-title">{step.title}</span>
              </div>
            </div>
            {index < steps.length - 1 ? (
              <>
                <img
                  className={`support_service_training_request__step-arrow${
                    step.status === "active" ? " is-active" : ""
                  }`}
                  src={step.arrow}
                  alt=""
                  width={24}
                  height={24}
                  loading="lazy"
                  decoding="async"
                  aria-hidden
                />
                <span
                  className={`support_service_training_request__step-connector${
                    step.status === "completed" ? " is-filled" : ""
                  }`}
                  aria-hidden
                />
              </>
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
