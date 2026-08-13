"use client";

import { useRef, type ReactNode } from "react";
import { useModalFocusTrap } from "@/lib/useModalFocusTrap";
import { useModalDismiss } from "@/lib/useModalDismiss";

type CommonModalProps = {
  open: boolean;
  onClose?: () => void;
  embedded?: boolean;
  titleId: string;
  title: ReactNode;
  className?: string;
  dimLabel?: string;
  footerClassName?: string;
  footer?: ReactNode;
  children: ReactNode;
};

export default function CommonModal({
  open,
  onClose,
  embedded = false,
  titleId,
  title,
  className,
  dimLabel = "Close dialog",
  footerClassName,
  footer,
  children,
}: CommonModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const active = open && !embedded;

  useModalFocusTrap(panelRef, active);
  useModalDismiss(active, onClose);

  if (!open) return null;

  const rootClassName = ["common_modal", embedded && "common_modal--embedded", className]
    .filter(Boolean)
    .join(" ");
  const footClassName = ["common_modal__foot", footerClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      {!embedded ? (
        <button
          type="button"
          className="common_modal__dim"
          aria-label={dimLabel}
          tabIndex={-1}
          onClick={() => onClose?.()}
        />
      ) : null}
      <div
        ref={panelRef}
        className="common_modal__panel"
        role="dialog"
        aria-modal={!embedded}
        aria-labelledby={titleId}
      >
        <header className="common_modal__head">
          <div className="common_modal__head-row">
            <h2 id={titleId} className="common_modal__tit">
              {title}
            </h2>
            <button
              type="button"
              className="common_modal__close"
              aria-label="Close"
              onClick={() => onClose?.()}
            />
          </div>
          <hr className="common_modal__line" />
        </header>
        <div className="common_modal__body">{children}</div>
        {footer ? <footer className={footClassName}>{footer}</footer> : null}
      </div>
    </div>
  );
}
