"use client";

import Checkbox from "@mui/material/Checkbox";
import { useId, useState } from "react";
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
  guideCheckboxIconsDefault,
} from "@/components/form/GuideFieldIcons";
import CommonModal from "@/components/common/CommonModal";

type CookiePreferencesModalProps = {
  open: boolean;
  onClose?: () => void;
  /** Section guide preview — in-flow layout without fixed overlay */
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
    /* Ignore quota and private-mode storage failures. */
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

/** P-FO-COMMON-040000M · Figma 7334:130670 — Cookie Settings detail */
export default function CookiePreferencesModal({
  open,
  onClose,
  embedded = false,
}: CookiePreferencesModalProps) {
  const titleId = useId();
  const [preferences, setPreferences] = useState<CookiePreferences>(
    defaultCookiePreferences,
  );

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
        {cookiePreferencesModal.description}
      </p>
      <ul className="cookie_preferences_modal__list">
        {cookiePreferencesModal.categories.map((category) => (
          <li key={category.id} className="cookie_preferences_modal__item">
            <label className="cookie_preferences_modal__check">
              <Checkbox
                checked={preferences[category.id]}
                disabled={category.required}
                icon={
                  <GuideCheckboxIcon
                    uncheckedSrc={guideCheckboxIconsDefault.uncheckedSrc}
                    checkedSrc={guideCheckboxIconsDefault.checkedSrc}
                  />
                }
                checkedIcon={
                  <GuideCheckboxIcon
                    checked
                    uncheckedSrc={guideCheckboxIconsDefault.uncheckedSrc}
                    checkedSrc={guideCheckboxIconsDefault.checkedSrc}
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
        ))}
      </ul>
    </CommonModal>
  );
}
