import Link from "next/link";
import {
  requestForTrainingNavCopy,
  type RequestForTrainingStepNumber,
} from "@/data/services/requestForTrainingContent";
import RequestForTrainingSteps from "./RequestForTrainingSteps";

export default function RequestForTraining({
  currentStep,
  children,
  previousHref,
  nextHref,
  submitLabel,
}: {
  currentStep: RequestForTrainingStepNumber;
  children: React.ReactNode;
  previousHref?: string;
  nextHref?: string;
  submitLabel?: string;
}) {
  const actionLabel = submitLabel ?? requestForTrainingNavCopy.nextLabel;
  return (
    <section
      className="support_service_training_request"
      id="request-for-training"
      aria-labelledby="request-for-training-heading"
    >
      <div className="inner">
        <RequestForTrainingSteps currentStep={currentStep} />
        <div className="support_service_training_request__body">
          {children}
          <div
            className={`support_service_training_request__actions${
              previousHref ? "" : " support_service_training_request__actions--next-only"
            }`}
          >
            {previousHref ? (
              <Link
                href={previousHref}
                className="btn-base btn-lv01 btn-lv01--line support_service_training_request__prev"
              >
                {requestForTrainingNavCopy.previousLabel}
              </Link>
            ) : null}
            {nextHref ? (
              <Link
                href={nextHref}
                className="btn-base btn-lv01 btn-lv01--solid support_service_training_request__next"
              >
                {actionLabel}
              </Link>
            ) : (
              <button
                type="button"
                className="btn-base btn-lv01 btn-lv01--solid support_service_training_request__next"
              >
                {actionLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
