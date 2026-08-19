"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
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

const emptySubscribe = () => () => undefined;

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
  const canPortal = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useModalFocusTrap(panelRef, active);
  useModalDismiss(active, onClose);

  if (!open) return null;

  const rootClassName = ["common_modal", embedded && "common_modal--embedded", className]
    .filter(Boolean)
    .join(" ");
  const footClassName = ["common_modal__foot", footerClassName]
    .filter(Boolean)
    .join(" ");

  const modalElement = (
    <div className={rootClassName} {...(active ? { "data-lenis-prevent": "" } : {})}>
      {!embedded ? (
        <button
          type="button"
          className="common_modal__dim"
          aria-label={dimLabel}
          tabIndex={-1}
          onWheel={(event) => event.preventDefault()}
          onTouchMove={(event) => event.preventDefault()}
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

  if (embedded || !canPortal) {
    return modalElement;
  }

  return createPortal(modalElement, document.body);
}
