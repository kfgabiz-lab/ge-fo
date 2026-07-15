"use client";

import { useEffect, type ReactNode } from "react";

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
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="support_download_filter-modal" role="dialog" aria-modal="true">
      <div className="support_download_filter-modal__overlay" onClick={onClose} aria-hidden />
      <div className="support_download_filter-modal__sheet">
        <header className="support_download_filter-modal__head">
          <h2 className="support_download_filter-modal__tit">Filter</h2>
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
