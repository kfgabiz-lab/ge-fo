"use client";

import type { EngineeringTrainingSessionDetail } from "@/data/services/engineeringTrainingSessionDetailContent";
import { engineeringTrainingSessionAssets } from "@/data/services/engineeringTrainingSessionDetailContent";
import TrainingSessionCountdown from "./TrainingSessionCountdown";
import TrainingSessionLocationMap from "./TrainingSessionLocationMap";

function SessionMetaLabel({
  icon,
  children,
}: {
  icon: string;
  children: string;
}) {
  return (
    <p className="support_service_training_session_detail__meta-label">
      <span className="support_service_training_session_detail__meta-icon" aria-hidden>
        <img src={icon} alt="" width={20} height={20} loading="lazy" decoding="async" />
      </span>
      {children}
    </p>
  );
}

export default function TrainingSessionDetailAside({
  session,
  variant,
  onRegister,
}: {
  session: EngineeringTrainingSessionDetail;
  variant: "pc" | "mo";
  onRegister: () => void;
}) {
  const { sidebar } = session;
  const { metaIcons } = engineeringTrainingSessionAssets;

  return (
    <aside
      className={`support_service_training_session_detail__aside support_service_training_session_detail__aside--${variant}`}
    >
      <TrainingSessionCountdown targetIso={session.countdownTo} />

      <div className="support_service_training_session_detail__meta">
        <div className="support_service_training_session_detail__meta-grid">
          <div className="support_service_training_session_detail__meta-row">
            <div className="support_service_training_session_detail__meta-item">
              <SessionMetaLabel icon={metaIcons.date}>DATE</SessionMetaLabel>
              <p
                className="support_service_training_session_detail__meta-value"
                data-slugkey="curriculum_detail2.training_date_from"
              >
                {sidebar.date}
              </p>
            </div>
            <div className="support_service_training_session_detail__meta-item">
              <SessionMetaLabel icon={metaIcons.duration}>DURATION</SessionMetaLabel>
              <p
                className="support_service_training_session_detail__meta-value"
                data-slugkey="curriculum_detail2.duration"
              >
                {sidebar.duration}
              </p>
            </div>
          </div>

          <div className="support_service_training_session_detail__meta-row">
            <div className="support_service_training_session_detail__meta-item">
              <SessionMetaLabel icon={metaIcons.trainingType}>
                Training Type
              </SessionMetaLabel>
              <p
                className="support_service_training_session_detail__meta-value"
                data-slugkey="curriculum_detail1.training_type"
              >
                {sidebar.trainingType}
              </p>
            </div>
            <div className="support_service_training_session_detail__meta-item">
              <SessionMetaLabel icon={metaIcons.classSize}>CLASS SIZE</SessionMetaLabel>
              <p
                className="support_service_training_session_detail__meta-value"
                data-slugkey="curriculum_detail2.capacity"
              >
                {sidebar.classSize}
              </p>
            </div>
          </div>
        </div>

        <div className="support_service_training_session_detail__meta-item support_service_training_session_detail__meta-item--location">
          <div className="support_service_training_session_detail__meta-head">
            <SessionMetaLabel icon={metaIcons.location}>
              LOCATION INFORMATION
            </SessionMetaLabel>
            <p className="support_service_training_session_detail__meta-value">
              {sidebar.location.name}
            </p>
          </div>
          <ul className="support_service_training_session_detail__meta-bullets">
            {sidebar.location.address.trim() ? (
              <li data-slugkey="curriculum_detail2.address">{sidebar.location.address}</li>
            ) : null}
            <li data-slugkey="curriculum_detail2.phone">{sidebar.location.phone}</li>
            <li data-slugkey="curriculum_detail2.email">{sidebar.location.email}</li>
          </ul>
          {sidebar.location.address.trim() ? (
            <TrainingSessionLocationMap address={sidebar.location.address} />
          ) : null}
        </div>

        <div className="support_service_training_session_detail__meta-item support_service_training_session_detail__meta-item--products">
          <SessionMetaLabel icon={metaIcons.products}>
            PRODUCTS COVERED
          </SessionMetaLabel>
          <p className="support_service_training_session_detail__meta-text">
            {sidebar.productsCovered}
          </p>
        </div>

        <button
          type="button"
          className="btn-base btn-lv01 btn-lv01--line support_service_training_session_detail__register"
          onClick={onRegister}
        >
          <span>{sidebar.registerLabel}</span>
          <img
            src={engineeringTrainingSessionAssets.registerScrollIcon}
            alt=""
            width={16}
            height={16}
            loading="lazy"
            decoding="async"
            aria-hidden
          />
        </button>
      </div>
    </aside>
  );
}
