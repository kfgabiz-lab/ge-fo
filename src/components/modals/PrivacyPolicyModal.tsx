"use client";

import { Fragment, useEffect, useId, useRef } from "react";
import { privacyPolicyModal } from "@/data/privacyPolicyContent";
import { useModalFocusTrap } from "@/lib/useModalFocusTrap";

type PrivacyPolicyModalProps = {
  open: boolean;
  onClose: () => void;
  /** Section guide preview — in-flow layout without fixed overlay */
  embedded?: boolean;
};

export default function PrivacyPolicyModal({
  open,
  onClose,
  embedded = false,
}: PrivacyPolicyModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useModalFocusTrap(panelRef, open && !embedded);

  useEffect(() => {
    if (!open || embedded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [embedded, open, onClose]);

  if (!open) return null;

  return (
    <div
      className={
        embedded
          ? "common_modal common_modal--embedded privacy_policy_modal"
          : "common_modal privacy_policy_modal"
      }
    >
      {!embedded ? (
        <button
          type="button"
          className="common_modal__dim"
          aria-label="Close dialog"
          onClick={onClose}
        />
      ) : null}
      <div
        ref={panelRef}
        className="common_modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="common_modal__head">
          <div className="common_modal__head-row">
            <h2 id={titleId} className="common_modal__tit">
              {privacyPolicyModal.title}
            </h2>
            <button
              type="button"
              className="common_modal__close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <hr className="common_modal__line" />
        </header>
        <div className="common_modal__body">
          {privacyPolicyModal.sections.map((section) => (
            <article key={section.heading} className="privacy_policy_modal__section">
              <h3 className="privacy_policy_modal__section-tit">{section.heading}</h3>
              <div className="privacy_policy_modal__text">
                <p>
                  {section.paragraphs[0]}
                  <br />
                  <br />
                  {section.paragraphs[1]}
                  <br />
                  <br />
                  {section.listItems.map((item, index) => (
                    <Fragment key={item}>
                      <strong>
                        {index + 1}. {item}
                      </strong>
                      <br />
                    </Fragment>
                  ))}
                  <br />
                  {section.outro}
                </p>
              </div>
            </article>
          ))}
        </div>
        <footer className="common_modal__foot">
          <button
            type="button"
            className="btn-base btn-lv01 btn-lv01--solid privacy_policy_modal__confirm"
            onClick={onClose}
          >
            {privacyPolicyModal.confirmLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}
