"use client";

import type { EngineeringTrainingSessionDetail } from "@/data/services/engineeringTrainingSessionDetailContent";
import { engineeringTrainingSessionAssets } from "@/data/services/engineeringTrainingSessionDetailContent";
import TrainingSessionCountdown from "./TrainingSessionCountdown";

// Training 세션 상세 - 우측(PC)/상단(MO) 사이드바 (ls-publish SessionDetailAside 이관)
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
              {/* DATE: 이 회차 행의 curriculum_detail2.training_date_from (회차 시작일 → STEP6 포맷) */}
              <SessionMetaLabel icon={metaIcons.date}>DATE</SessionMetaLabel>
              <p
                className="support_service_training_session_detail__meta-value"
                data-slugkey="curriculum_detail2.training_date_from"
              >
                {sidebar.date}
              </p>
            </div>
            <div className="support_service_training_session_detail__meta-item">
              {/* DURATION: 이 회차 행의 curriculum_detail2.duration (STEP6 "N Hours" 포맷) */}
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
              {/* Training Type: 이 회차 행의 curriculum_detail1.training_type 코드 → 라벨 (STEP6) */}
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
              {/* CLASS SIZE: 이 회차 행의 curriculum_detail2.capacity */}
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
            {/* 장소명(location.name): curriculum_detail2 에 대응 필드 없음(STEP4 확정).
                뷰모델에서 빈값으로 채워 미표시 — address 라인만 노출, 미태깅 */}
            <p className="support_service_training_session_detail__meta-value">
              {sidebar.location.name}
            </p>
          </div>
          <ul className="support_service_training_session_detail__meta-bullets">
            {/* 주소/전화/이메일: 이 회차 행의 curriculum_detail2.address / phone / email */}
            <li data-slugkey="curriculum_detail2.address">{sidebar.location.address}</li>
            <li data-slugkey="curriculum_detail2.phone">{sidebar.location.phone}</li>
            <li data-slugkey="curriculum_detail2.email">{sidebar.location.email}</li>
          </ul>
        </div>

        <div className="support_service_training_session_detail__meta-item support_service_training_session_detail__meta-item--products">
          {/* PRODUCTS COVERED: 연결제품 제품명 합산(_fetchedRel22=Power + _fetchedRel23=Automation,
              각 원소 _fetchedRelN[].product.product_name)을 join 문자열로 렌더.
              다중소스 합산이라 단일 slugKey 미태깅(trainingDetailData.extractProductNames) */}
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
