"use client";

import type { ReactNode } from "react";
import { useTableSwipeHint } from "@/hooks/useTableSwipeHint";

type WarrantyTableScrollProps = {
  children: ReactNode;
  /** Show mobile swipe hint overlay (Figma 6880:144915) */
  withSwipe?: boolean;
  /** Sticky first column + edge shadow (Figma 6880:144576) */
  stickyFirstCol?: boolean;
};

export default function WarrantyTableScroll({
  children,
  withSwipe = false,
  stickyFirstCol = false,
}: WarrantyTableScrollProps) {
  // 스크롤/스와이프 감지 로직은 공통 훅으로 승격, withSwipe=false면 힌트 미표시
  const { scrollRef, swipeHidden } = useTableSwipeHint(withSwipe);

  return (
    <div
      className={
        stickyFirstCol
          ? "support_service_warranty_table-viewport support_service_warranty_table-viewport--sticky"
          : "support_service_warranty_table-viewport"
      }
    >
      <div ref={scrollRef} className="support_service_warranty_table-wrap">
        {children}
      </div>
      {withSwipe ? (
        <div
          className={
            swipeHidden
              ? "support_service_warranty_table-swipe is-hidden"
              : "support_service_warranty_table-swipe"
          }
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            decoding="async"
            className="support_service_warranty_table-swipe__icon"
            src="/ico/ico_swipe_70.svg"
            alt=""
          />
          <p className="support_service_warranty_table-swipe__label">Swipe</p>
        </div>
      ) : null}
    </div>
  );
}
