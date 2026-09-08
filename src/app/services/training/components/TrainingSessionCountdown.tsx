"use client";

import { useEffect, useState } from "react";

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function parseTargetMs(targetIso?: string): number | null {
  if (!targetIso) return null;
  // 절대 시각(ISO-8601 datetime, 예: 2026-09-08T04:00:00Z) — 그대로 파싱해 모든 접속자가 동일 기준
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:/.test(targetIso.trim())) {
    const ms = Date.parse(targetIso.trim());
    return Number.isNaN(ms) ? null : ms;
  }
  // 날짜만(YYYY-MM-DD) — 브라우저 로컬 그날 23:59:59 (폴백)
  const parts = targetIso.trim().slice(0, 10).split("-");
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(Number);
  if (![y, m, d].every(Number.isInteger)) return null;
  return new Date(y, m - 1, d, 23, 59, 59).getTime();
}

function computeRemaining(targetMs: number): Remaining {
  const diff = Math.max(0, targetMs - Date.now());
  const totalSec = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSec / 86_400),
    hours: Math.floor((totalSec % 86_400) / 3_600),
    minutes: Math.floor((totalSec % 3_600) / 60),
    seconds: totalSec % 60,
  };
}

export default function TrainingSessionCountdown({
  targetIso,
}: {
  targetIso?: string;
}) {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const targetMs = parseTargetMs(targetIso);
    if (targetMs == null) {
      setRemaining(null);
      return;
    }
    setRemaining(computeRemaining(targetMs));
    const id = setInterval(() => {
      setRemaining(computeRemaining(targetMs));
    }, 1_000);
    return () => clearInterval(id);
  }, [targetIso]);

  if (!remaining) return null;

  return (
    <div className="support_service_training_session_detail__countdown">
      <div
        className="support_service_training_session_detail__countdown-grid"
        role="timer"
        aria-live="off"
      >
        <div className="support_service_training_session_detail__countdown-unit">
          <span className="support_service_training_session_detail__countdown-value">
            {remaining.days}
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
            {remaining.hours}
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
            {remaining.minutes}
          </span>
          <span className="support_service_training_session_detail__countdown-name">
            MINS
          </span>
        </div>
      </div>
    </div>
  );
}
