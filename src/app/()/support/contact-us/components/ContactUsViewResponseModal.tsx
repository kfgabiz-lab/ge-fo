"use client";

import { useEffect, useId, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import { contactUsViewResponseModal } from "@/data/support/contactUsContent";
import { useModalFocusTrap } from "@/lib/useModalFocusTrap";

type ContactUsViewResponseModalProps = {
  open: boolean;
  onClose: () => void;
  /** Section guide preview — in-flow layout without fixed overlay */
  embedded?: boolean;
  /** Figma 5565:128558 — show validation errors on open */
  showErrorsOnOpen?: boolean;
};

type FieldErrors = {
  inquiryNumber?: string;
  password?: string;
};

export default function ContactUsViewResponseModal({
  open,
  onClose,
  embedded = false,
  showErrorsOnOpen = false,
}: ContactUsViewResponseModalProps) {
  const titleId = useId();
  const inquiryId = useId();
  const passwordId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [inquiryNumber, setInquiryNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

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

  useEffect(() => {
    if (!open) {
      setInquiryNumber("");
      setPassword("");
      setErrors({});
      return;
    }

    if (showErrorsOnOpen) {
      setErrors({
        inquiryNumber: contactUsViewResponseModal.fieldError,
        password: contactUsViewResponseModal.fieldError,
      });
    }
  }, [open, showErrorsOnOpen]);

  if (!open) return null;

  const handleConfirm = () => {
    const nextErrors: FieldErrors = {};

    if (!inquiryNumber.trim()) {
      nextErrors.inquiryNumber = contactUsViewResponseModal.fieldError;
    }
    if (!password.trim()) {
      nextErrors.password = contactUsViewResponseModal.fieldError;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
  };

  return (
    <div
      className={
        embedded
          ? "common_modal common_modal--embedded support_contact_view_response_modal"
          : "common_modal support_contact_view_response_modal"
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
          <div className="support_contact_view_response_modal__intro">
            <h3 className="support_contact_view_response_modal__heading">
              {contactUsViewResponseModal.heading}
            </h3>
            <div className="support_contact_view_response_modal__desc">
              {contactUsViewResponseModal.description.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          <div className="support_contact_view_response_modal__fields">
            <div className="support_contact_view_response_modal__field">
              <label
                className="support_contact_view_response_modal__label"
                htmlFor={inquiryId}
              >
                {contactUsViewResponseModal.inquiryNumberLabel}
                <span className="support_contact_view_response_modal__required" aria-hidden>
                  {" "}
                  *
                </span>
              </label>
              <TextField
                id={inquiryId}
                className={`guide_field support_contact_view_response_modal__input${
                  errors.inquiryNumber
                    ? " support_contact_view_response_modal__input--error"
                    : ""
                }`}
                value={inquiryNumber}
                onChange={(event) => {
                  setInquiryNumber(event.target.value);
                  if (errors.inquiryNumber) {
                    setErrors((prev) => ({ ...prev, inquiryNumber: undefined }));
                  }
                }}
                error={Boolean(errors.inquiryNumber)}
              />
              {errors.inquiryNumber ? (
                <p className="support_contact_view_response_modal__error" role="alert">
                  {errors.inquiryNumber}
                </p>
              ) : null}
            </div>
            <div className="support_contact_view_response_modal__field">
              <label
                className="support_contact_view_response_modal__label"
                htmlFor={passwordId}
              >
                {contactUsViewResponseModal.passwordLabel}
                <span className="support_contact_view_response_modal__required" aria-hidden>
                  {" "}
                  *
                </span>
              </label>
              <TextField
                id={passwordId}
                className={`guide_field support_contact_view_response_modal__input${
                  errors.password ? " support_contact_view_response_modal__input--error" : ""
                }`}
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                error={Boolean(errors.password)}
              />
              {errors.password ? (
                <p className="support_contact_view_response_modal__error" role="alert">
                  {errors.password}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <footer className="common_modal__foot">
          <button
            type="button"
            className="btn-base btn-lv01 btn-lv01--solid support_contact_view_response_modal__confirm"
            onClick={handleConfirm}
          >
            {contactUsViewResponseModal.confirmLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}
