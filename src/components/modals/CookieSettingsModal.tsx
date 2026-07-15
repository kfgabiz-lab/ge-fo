"use client";

import { useId, useRef } from "react";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  cookieSettingsModal,
  type CookieConsentValue,
} from "@/data/common/cookieSettingsContent";
import { useModalFocusTrap } from "@/lib/useModalFocusTrap";
import { useModalDismiss } from "@/lib/useModalDismiss";

type CookieSettingsModalProps = {
  open: boolean;
  onClose?: () => void;
  /** Section guide preview — in-flow, no fixed overlay */
  embedded?: boolean;
  onSettings?: () => void;
};

function persistConsent(value: CookieConsentValue) {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value);
  } catch {
    /* ignore quota / private mode */
  }
}

/** Figma 7334:130893 (PC) · 7334:131063 (MO) — Cookie Settings banner */
export default function CookieSettingsModal({
  open,
  onClose,
  embedded = false,
  onSettings,
}: CookieSettingsModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const active = open && !embedded;

  useModalFocusTrap(panelRef, active);
  useModalDismiss(active, onClose);

  if (!open) return null;

  const handleAccept = () => {
    persistConsent("accepted");
    onClose?.();
  };

  const handleReject = () => {
    persistConsent("rejected");
    onClose?.();
  };

  return (
    <div
      className={
        embedded
          ? "cookie_settings_modal cookie_settings_modal--embedded"
          : "cookie_settings_modal"
      }
    >
      {!embedded ? (
        <button
          type="button"
          className="cookie_settings_modal__dim"
          aria-label="Close cookie settings"
          onClick={() => onClose?.()}
        />
      ) : null}
      <div
        ref={panelRef}
        className="cookie_settings_modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="cookie_settings_modal__text">
          <h2 id={titleId} className="cookie_settings_modal__tit">
            {cookieSettingsModal.title}
          </h2>
          <div className="cookie_settings_modal__desc">
            {cookieSettingsModal.descriptionLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        <div className="cookie_settings_modal__actions">
          <button
            type="button"
            className="cookie_settings_modal__btn cookie_settings_modal__btn--line"
            onClick={() => onSettings?.()}
          >
            {cookieSettingsModal.settingsLabel}
          </button>
          <button
            type="button"
            className="cookie_settings_modal__btn cookie_settings_modal__btn--line"
            onClick={handleReject}
          >
            {cookieSettingsModal.rejectLabel}
          </button>
          <button
            type="button"
            className="cookie_settings_modal__btn cookie_settings_modal__btn--solid"
            onClick={handleAccept}
          >
            {cookieSettingsModal.acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
