"use client";

import { useId, useRef, type ReactNode } from "react";
import { useModalFocusTrap } from "@/lib/useModalFocusTrap";
import { useModalDismiss } from "@/lib/useModalDismiss";

type SupportFilterModalProps = {
  open: boolean;
  onClose: () => void;
  applyLabel: string;
  children: ReactNode;
};

export default function SupportFilterModal({
  open,
  onClose,
  applyLabel,
  children,
}: SupportFilterModalProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useModalFocusTrap(sheetRef, open);
  useModalDismiss(open, onClose);

  if (!open) {
    return null;
  }

  return (
    <div
      className="support_download_filter-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="support_download_filter-modal__overlay"
        aria-label="Close filter"
        tabIndex={-1}
        onClick={onClose}
      />
      <div ref={sheetRef} className="support_download_filter-modal__sheet">
        <header className="support_download_filter-modal__head">
          <h2 id={titleId} className="support_download_filter-modal__tit">
            Filter
          </h2>
          <button
            type="button"
            className="support_download_filter-modal__close"
            aria-label="Close filter"
            onClick={onClose}
          >
            <img src="/ico/ico_close_24.svg" alt="" width={24} height={24} />
          </button>
        </header>

        <div className="support_download_filter-modal__body">{children}</div>

        <div className="support_download_filter-modal__foot">
          <button
            type="button"
            className="support_download_filter-modal__apply"
            onClick={onClose}
          >
            {applyLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
