"use client";

import Checkbox from "@mui/material/Checkbox";
import { useEffect, useId, useState } from "react";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_PREFERENCES_STORAGE_KEY,
  cookiePreferencesModal,
  defaultCookiePreferences,
  type CookieConsentValue,
  type CookiePreferenceId,
  type CookiePreferences,
} from "@/data/common/cookieSettingsContent";
import {
  GuideCheckboxIcon,
  guideCheckboxIconsContactConsent,
} from "@/components/form/GuideFieldIcons";
import CommonModal from "@/components/common/CommonModal";

type CookiePreferencesModalProps = {
  open: boolean;
  onClose?: () => void;
  embedded?: boolean;
};

function persistPreferences(
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
  }
}

function getAllPreferences(value: boolean): CookiePreferences {
  return Object.fromEntries(
    cookiePreferencesModal.categories.map((category) => [
      category.id,
      category.required ? true : value,
    ]),
  ) as CookiePreferences;
}

function getStoredPreferences(): CookiePreferences {
  try {
    const saved = window.localStorage.getItem(
      COOKIE_PREFERENCES_STORAGE_KEY,
    );

    // 저장된 값이 없으면 categories의 defaultChecked 값 사용
    if (!saved) {
      return defaultCookiePreferences;
    }

    const parsed = JSON.parse(saved) as Partial<CookiePreferences>;

    // 누락된 항목은 defaultChecked 값으로 보완
    return {
      ...defaultCookiePreferences,
      ...parsed,
      necessary: true, // 필수 쿠키는 항상 체크
    };
  } catch {
    return defaultCookiePreferences;
  }
}


export default function CookiePreferencesModal({
  open,
  onClose,
  embedded = false,
}: CookiePreferencesModalProps) {
  const titleId = useId();
  const [preferences, setPreferences] = useState<CookiePreferences>(
    defaultCookiePreferences,
  );

  useEffect(() => {
  if (!open) return;

  setPreferences(getStoredPreferences());
  }, [open]);

  const updatePreference = (id: CookiePreferenceId, checked: boolean) => {
    setPreferences((current) => ({ ...current, [id]: checked }));
  };

  const saveAndClose = (
    consent: CookieConsentValue,
    nextPreferences: CookiePreferences,
  ) => {
    setPreferences(nextPreferences);
    persistPreferences(consent, nextPreferences);
    onClose?.();
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      embedded={embedded}
      titleId={titleId}
      title={cookiePreferencesModal.title}
      className="cookie_preferences_modal"
      dimLabel="Close cookie settings"
      footerClassName="cookie_preferences_modal__actions"
      footer={
        <>
          <button
            type="button"
            className="btn-base btn-lv01 btn-lv01--line cookie_preferences_modal__btn"
            onClick={() => saveAndClose("rejected", getAllPreferences(false))}
          >
            {cookiePreferencesModal.rejectLabel}
          </button>
          <button
            type="button"
            className="btn-base btn-lv01 btn-lv01--line cookie_preferences_modal__btn"
            onClick={() => saveAndClose("custom", preferences)}
          >
            {cookiePreferencesModal.saveLabel}
          </button>
          <button
            type="button"
            className="btn-base btn-lv01 btn-lv01--solid cookie_preferences_modal__btn"
            onClick={() => saveAndClose("accepted", getAllPreferences(true))}
          >
            {cookiePreferencesModal.acceptLabel}
          </button>
        </>
      }
    >
      <p className="cookie_preferences_modal__intro">
        {cookiePreferencesModal.descriptionBefore}
        <a
          href={cookiePreferencesModal.termsOfServiceHref}
          className="cookie_preferences_modal__link"
        >
          {cookiePreferencesModal.termsOfServiceLabel}
        </a>
      </p>
      <ul className="cookie_preferences_modal__list">
        {cookiePreferencesModal.categories.map((category) => {
          const checkboxIcons = category.required
            ? {
                uncheckedSrc:
                  guideCheckboxIconsContactConsent.disabledCheckedSrc,
                checkedSrc:
                  guideCheckboxIconsContactConsent.disabledCheckedSrc,
              }
            : guideCheckboxIconsContactConsent;

          return (
          <li key={category.id} className="cookie_preferences_modal__item">
            <label className="cookie_preferences_modal__check">
              <Checkbox
                checked={preferences[category.id]}
                disabled={category.required}
                icon={
                  <GuideCheckboxIcon {...checkboxIcons} />
                }
                checkedIcon={
                  <GuideCheckboxIcon
                    checked
                    {...checkboxIcons}
                  />
                }
                onChange={(_, checked) => updatePreference(category.id, checked)}
                inputProps={{
                  "aria-describedby": `${titleId}-${category.id}-description`,
                }}
              />
              <span className="cookie_preferences_modal__item-tit">
                {category.title}
              </span>
            </label>
            <p
              id={`${titleId}-${category.id}-description`}
              className="cookie_preferences_modal__item-desc"
            >
              {category.description}
            </p>
          </li>
          );
        })}
      </ul>
    </CommonModal>
  );
}
