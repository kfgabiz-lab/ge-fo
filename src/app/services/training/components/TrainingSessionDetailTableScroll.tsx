"use client";

import type { ReactNode } from "react";
import { useTableSwipeHint } from "@/hooks/useTableSwipeHint";

export default function TrainingSessionDetailTableScroll({
  children,
}: {
  children: ReactNode;
}) {
  const { scrollRef, swipeHidden, scrollbar } = useTableSwipeHint();

  return (
    <div className="support_service_training_session_detail__table-viewport">
      <div
        ref={scrollRef}
        className="support_service_training_session_detail__table-wrap"
      >
        {children}
      </div>
      {scrollbar.scrollable ? (
        <div
          className="support_service_training_session_detail__table-scrollbar"
          aria-hidden="true"
        >
          <div className="support_service_training_session_detail__table-scrollbar-track">
            <div
              className="support_service_training_session_detail__table-scrollbar-thumb"
              style={{
                width: `${scrollbar.thumbWidthPct}%`,
                left: `${scrollbar.thumbLeftPct}%`,
              }}
            />
          </div>
        </div>
      ) : null}
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
