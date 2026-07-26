import Link from "next/link";
import {
  requestForTrainingNavCopy,
  type RequestForTrainingStepNumber,
} from "@/data/services/requestForTrainingContent";
import RequestForTrainingSteps from "./RequestForTrainingSteps";

// Step1~4 공용 셸(스텝 바 + 본문 + 이전/다음 버튼). ls-publish 원본 마크업 그대로 이관.
// nextHref 없이 onNextClick 을 넘기면 원본에 이미 있던 button 분기를 그대로 쓰면서
// 클릭 시 검증 후 이동하도록 처리한다(마크업/클래스 변경 없음).
export default function RequestForTraining({
  currentStep,
  children,
  previousHref,
  nextHref,
  submitLabel,
  onNextClick,
}: {
  currentStep: RequestForTrainingStepNumber;
  children: React.ReactNode;
  previousHref?: string;
  nextHref?: string;
  submitLabel?: string;
  onNextClick?: () => void;
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
                onClick={onNextClick}
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
