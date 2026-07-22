import { engineeringTrainingSessionCountdownDisplay } from "@/data/services/engineeringTrainingSessionDetailContent";

// Training 세션 상세 - 카운트다운 (정적 표시, ls-publish EngineeringTrainingSessionCountdown 이관)
export default function TrainingSessionCountdown() {
  const { days, hours, minutes, seconds } = engineeringTrainingSessionCountdownDisplay;

  return (
    <div className="support_service_training_session_detail__countdown" aria-hidden>
      <div
        className="support_service_training_session_detail__countdown-grid"
        role="presentation"
      >
        <div className="support_service_training_session_detail__countdown-unit">
          <span className="support_service_training_session_detail__countdown-value">
            {days}
          </span>
          <span className="support_service_training_session_detail__countdown-name">
            DAYS
          </span>
        </div>
        <span className="support_service_training_session_detail__countdown-sep" aria-hidden>
          :
        </span>
        <div className="support_service_training_session_detail__countdown-unit">
          <span className="support_service_training_session_detail__countdown-value">
            {hours}
          </span>
          <span className="support_service_training_session_detail__countdown-name">
            HOURS
          </span>
        </div>
        <span className="support_service_training_session_detail__countdown-sep" aria-hidden>
          :
        </span>
        <div className="support_service_training_session_detail__countdown-unit">
          <span className="support_service_training_session_detail__countdown-value">
            {minutes}
          </span>
          <span className="support_service_training_session_detail__countdown-name">
            MINS
          </span>
        </div>
        <span className="support_service_training_session_detail__countdown-sep" aria-hidden>
          :
        </span>
        <div className="support_service_training_session_detail__countdown-unit">
          <span className="support_service_training_session_detail__countdown-value">
            {seconds}
          </span>
          <span className="support_service_training_session_detail__countdown-name">
            SECS
          </span>
        </div>
      </div>
    </div>
  );
}
