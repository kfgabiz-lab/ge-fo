"use client";

import { useId, useRef } from "react";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_PREFERENCES_STORAGE_KEY,
  cookiePreferencesModal,
  cookieSettingsModal,
  type CookieConsentValue,
  type CookiePreferences,
} from "@/data/common/cookieSettingsContent";
import { useModalFocusTrap } from "@/lib/useModalFocusTrap";
import { useModalDismiss } from "@/lib/useModalDismiss";

type CookieSettingsModalProps = {
  open: boolean;
  onClose?: () => void;
  embedded?: boolean;
  onSettings?: () => void;
};

function getAllPreferences(value: boolean): CookiePreferences {
  return Object.fromEntries(
    cookiePreferencesModal.categories.map((category) => [
      category.id,
      category.required ? true : value,
    ]),
  ) as CookiePreferences;
}

function persistConsent(
  consent: CookieConsentValue,
  preferences: CookiePreferences,
) {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, consent);
    window.localStorage.setItem(
      COOKIE_PREFERENCES_STORAGE_KEY,
      JSON.stringify(preferences),
    );
  } catch {
    // localStorage 접근 불가 시 무시
  }
}

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
    persistConsent("accepted", getAllPreferences(true));
    onClose?.();
  };

  const handleReject = () => {
    persistConsent("rejected", getAllPreferences(false));
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
          tabIndex={-1}
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
            <p>{cookieSettingsModal.description}</p>
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
