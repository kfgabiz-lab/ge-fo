"use client";

import { useEffect, useId, useRef } from "react";
import {
  contactUsViewResponseDetailSample,
  contactUsViewResponseModal,
} from "@/data/support/contactUsContent";
import { useModalFocusTrap } from "@/lib/useModalFocusTrap";

type ContactUsViewResponseDetailModalProps = {
  open: boolean;
  onClose: () => void;
  variant: "answered" | "pending";
  embedded?: boolean;
};

export default function ContactUsViewResponseDetailModal({
  open,
  onClose,
  variant,
  embedded = false,
}: ContactUsViewResponseDetailModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const sample = contactUsViewResponseDetailSample;

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

  const responseDate =
    variant === "answered" ? sample.respondedAt : sample.submittedAt;
  const responseDateTime = variant === "answered" ? "2026-06-22T11:23" : "2026-06-19T16:25";

  const productTrail = (
    <nav
      className="support_contact_view_response_detail_modal__trail"
      aria-label="Inquiry products"
    >
      <span>{sample.productTrail[0]}</span>
      <span className="support_contact_view_response_detail_modal__trail-sep" aria-hidden>
        |
      </span>
      {sample.productTrail.slice(1).map((item, index) => (
        <span key={item} className="support_contact_view_response_detail_modal__trail-item">
          {index > 0 ? (
            <span
              className="support_contact_view_response_detail_modal__trail-chevron"
              aria-hidden
            >
              &gt;
            </span>
          ) : null}
          <span>{item}</span>
        </span>
      ))}
    </nav>
  );

  return (
    <div
      className={
        embedded
          ? "common_modal common_modal--embedded support_contact_view_response_detail_modal"
          : "common_modal support_contact_view_response_detail_modal"
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
              {contactUsViewResponseModal.title}
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
          <section className="support_contact_view_response_detail_modal__inquiry">
            <p className="support_contact_view_response_detail_modal__type">
              {sample.inquiryType}
            </p>
            <div className="support_contact_view_response_detail_modal__section-head">
              <div className="support_contact_view_response_detail_modal__section-head-main">
                <span className="support_contact_view_response_detail_modal__badge">Q</span>
                <h3 className="support_contact_view_response_detail_modal__section-tit">
                  Inquiry Details
                </h3>
              </div>
              <time
                className="support_contact_view_response_detail_modal__date"
                dateTime="2026-06-19T16:25"
              >
                {sample.submittedAt}
              </time>
            </div>
            {productTrail}
            <div className="support_contact_view_response_detail_modal__text">
              {sample.inquiryBody.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </section>
          <hr className="support_contact_view_response_detail_modal__divider" />
          <section
            className={`support_contact_view_response_detail_modal__response${
              variant === "pending"
                ? " support_contact_view_response_detail_modal__response--pending"
                : ""
            }`}
          >
            <div className="support_contact_view_response_detail_modal__section-head">
              <div className="support_contact_view_response_detail_modal__section-head-main">
                <span className="support_contact_view_response_detail_modal__badge">A</span>
                <h3 className="support_contact_view_response_detail_modal__section-tit">
                  Response Details
                </h3>
              </div>
              <time
                className="support_contact_view_response_detail_modal__date"
                dateTime={responseDateTime}
              >
                {responseDate}
              </time>
            </div>
            {variant === "answered" ? (
              <>
                {productTrail}
                <div className="support_contact_view_response_detail_modal__text">
                  {sample.responseBody.map((line) =>
                    line ? <p key={line}>{line}</p> : <p key="spacer" aria-hidden>&nbsp;</p>,
                  )}
                </div>
              </>
            ) : (
              <div className="support_contact_view_response_detail_modal__pending">
                <p className="support_contact_view_response_detail_modal__pending-tit">
                  {sample.pendingTitle}
                </p>
                <p className="support_contact_view_response_detail_modal__pending-desc">
                  {sample.pendingDescription}
                </p>
              </div>
            )}
          </section>
        </div>
        <footer className="common_modal__foot">
          <button
            type="button"
            className="btn-base btn-lv01 btn-lv01--solid support_contact_view_response_detail_modal__confirm"
            onClick={onClose}
          >
            {contactUsViewResponseModal.confirmLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}
