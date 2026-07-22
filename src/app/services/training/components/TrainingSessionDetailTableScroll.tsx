"use client";

import type { ReactNode } from "react";
import { useTableSwipeHint } from "@/hooks/useTableSwipeHint";

// Training 세션 상세 - Agenda 테이블 가로 스크롤/스와이프 힌트 (ls-publish SessionDetailTableScroll 이관)
// 스크롤/스와이프 감지 로직은 공통 훅 useTableSwipeHint로 승격, 마크업/클래스는 세션 상세 고유.
export default function TrainingSessionDetailTableScroll({
  children,
}: {
  children: ReactNode;
}) {
  const { scrollRef, swipeHidden } = useTableSwipeHint();

  return (
    <div className="support_service_training_session_detail__table-viewport">
      <div
        ref={scrollRef}
        className="support_service_training_session_detail__table-wrap"
      >
        {children}
      </div>
      <div
        className={`support_service_training_session_detail__table-swipe${
          swipeHidden ? " is-hidden" : ""
        }`}
        aria-hidden
      >
        <img
          className="support_service_training_session_detail__table-swipe-icon"
          src="/ico/ico_swipe_70.svg"
          alt=""
          width={70}
          height={70}
          loading="lazy"
          decoding="async"
        />
        <p className="support_service_training_session_detail__table-swipe-label">
          Swipe
        </p>
      </div>
    </div>
  );
}
