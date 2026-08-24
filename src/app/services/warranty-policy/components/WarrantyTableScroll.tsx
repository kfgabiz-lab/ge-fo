"use client";

import type { ReactNode } from "react";
import { useTableSwipeHint } from "@/hooks/useTableSwipeHint";

type WarrantyTableScrollProps = {
  children: ReactNode;
  withSwipe?: boolean;
  stickyFirstCol?: boolean;
};

export default function WarrantyTableScroll({
  children,
  withSwipe = false,
  stickyFirstCol = false,
}: WarrantyTableScrollProps) {
  const { scrollRef, swipeHidden, scrollbar } = useTableSwipeHint(withSwipe);

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
      {scrollbar.scrollable ? (
        <div
          className="support_service_warranty_table-scrollbar"
          aria-hidden="true"
        >
          <div className="support_service_warranty_table-scrollbar__track">
            <div
              className="support_service_warranty_table-scrollbar__thumb"
              style={{
                width: `${scrollbar.thumbWidthPct}%`,
                left: `${scrollbar.thumbLeftPct}%`,
              }}
            />
          </div>
        </div>
      ) : null}
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
