"use client";

import { useEffect, useState } from "react";

// Training 세션 상세 - 카운트다운 (register_period_to 기준 실시간)
// - 기준 시각 = 등록 마감일(register_period_to) 당일 23:59:59(local)
// - 1초 틱으로 남은 days/hours/mins/secs 갱신, 마감 경과 시 0 표기
// - 값 없으면 렌더하지 않음(숨김)

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

// register_period_to("YYYY-MM-DD"[...]) → 마감 순간(ms). 파싱 실패 시 null
function parseTargetMs(targetIso?: string): number | null {
  if (!targetIso) return null;
  const parts = targetIso.trim().slice(0, 10).split("-");
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(Number);
  if (![y, m, d].every(Number.isInteger)) return null;
  // 등록 마감일 당일 끝(23:59:59)까지를 기준으로 카운트다운
  return new Date(y, m - 1, d, 23, 59, 59).getTime();
}

// 남은 시간(ms) → days/hours/mins/secs (음수 방지)
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

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export default function TrainingSessionCountdown({
  targetIso,
}: {
  targetIso?: string;
}) {
  // SSR/최초 클라이언트 렌더는 동일하게 null(하이드레이션 불일치 방지) →
  // 마운트 후 effect 에서 실제 값 계산/틱 시작
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

  // 값 없음(파싱 불가 or 미마운트) → 숨김
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
            {pad2(remaining.hours)}
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
            {pad2(remaining.minutes)}
          </span>
          <span className="support_service_training_session_detail__countdown-name">
            MINS
          </span>
        </div>
      </div>
    </div>
  );
}
