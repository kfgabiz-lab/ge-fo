"use client";

import { Checkbox, TextField } from "@mui/material";
import { useCallback, useEffect, useId, useState } from "react";
import {
  GuideCheckboxIcon,
  guideCheckboxIconsContactConsent,
} from "@/components/form/GuideFieldIcons";
import ContactUsTermsModal from "@/app/support/contact-us/components/ContactUsTermsModal";
import { requestForTrainingStep4Copy } from "@/data/services/requestForTrainingContent";
import { fetchCaptcha, type Captcha } from "@/lib/captcha";
import RequestForTrainingFieldError from "./RequestForTrainingFieldError";
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";
import { useRequestForTrainingForm } from "./RequestForTrainingProvider";

const COMMENTS_MAX_BYTES = 2000;

function utf8ByteSize(codePoint: number): number {
  if (codePoint <= 0x7f) return 1;
  if (codePoint <= 0x7ff) return 2;
  if (codePoint <= 0xffff) return 3;
  return 4;
}

function filterComments(value: string): string {
  let bytes = 0;
  let cut = 0;

  for (const char of value) {
    const size = utf8ByteSize(char.codePointAt(0) ?? 0);
    if (bytes + size > COMMENTS_MAX_BYTES) {
      return value.slice(0, cut);
    }
    bytes += size;
    cut += char.length;
  }

  return value;
}

export type RequestForTrainingConsentErrors = {
  consent?: boolean;
  captcha?: boolean;
};

export default function RequestForTrainingConsentSection({
  errors = {},
  onClearError,
}: {
  errors?: RequestForTrainingConsentErrors;
  onClearError?: (key: keyof RequestForTrainingConsentErrors) => void;
} = {}) {
  const formId = useId();
  const { fields } = requestForTrainingStep4Copy;
  const { step4, setStep4Field } = useRequestForTrainingForm();

  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const [captcha, setCaptcha] = useState<Captcha | null>(null);

  const loadCaptcha = useCallback(async () => {
    try {
      const next = await fetchCaptcha();
      setCaptcha(next);
      setStep4Field("captchaToken", next.captchaToken);
    } catch {
      setCaptcha(null);
      setStep4Field("captchaToken", "");
    }
  }, [setStep4Field]);

  useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha]);

  return (
    <>
      <div className="support_service_training_request__field support_service_training_request__field--full">
        <RequestForTrainingFieldLabel htmlFor={`${formId}-comments`}>
          {fields.comments.label}
        </RequestForTrainingFieldLabel>
        <TextField
          id={`${formId}-comments`}
          className="guide_field support_service_training_request__input support_service_training_request__input--textarea"
          placeholder={fields.comments.placeholder}
          multiline
          value={step4.comments}
          onChange={(event) =>
            setStep4Field("comments", filterComments(event.target.value))
          }
        />
      </div>

      <hr className="support_service_training_request__form-divider" />

      <div
        className={[
          "support_service_training_request__consent",
          errors.consent ? "support_service_training_request__field--error" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <label className="support_service_training_request__consent-label">
          <Checkbox
            className="guide_checkbox support_service_training_request__checkbox"
            disableRipple
            checked={step4.consentChecked}
            onChange={(event) => {
              setStep4Field("consentChecked", event.target.checked);
              onClearError?.("consent");
            }}
            icon={<GuideCheckboxIcon {...guideCheckboxIconsContactConsent} />}
            checkedIcon={
              <GuideCheckboxIcon checked {...guideCheckboxIconsContactConsent} />
            }
          />
          <span>{fields.consent.label}</span>
        </label>
        <button
          type="button"
          className="support_service_training_request__terms-link"
          onClick={() => setTermsModalOpen(true)}
        >
          {fields.consent.termsLabel}
        </button>
        {errors.consent ? (
          <RequestForTrainingFieldError message="Please agree to the collection and use of your personal information." />
        ) : null}
      </div>

      <div
        className={[
          "support_service_training_request__recaptcha-box",
          errors.captcha ? "support_service_training_request__field--error" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="support_service_training_request__captcha-row">
          {captcha ? (
            <img
              src={captcha.captchaImage}
              alt="CAPTCHA"
              className="support_service_training_request__captcha-image"
            />
          ) : (
            <div className="support_service_training_request__captcha-image support_service_training_request__captcha-image--loading" />
          )}
          <button
            type="button"
            onClick={() => loadCaptcha()}
            className="support_service_training_request__captcha-refresh"
            aria-label="Refresh CAPTCHA"
          >
            <img src="/ico/ico_refresh_22.svg" alt="" width={18} height={18} />
          </button>
          <TextField
            className="guide_field guide_field--h50 support_service_training_request__input support_service_training_request__captcha-input"
            placeholder="CAPTCHA"
            error={Boolean(errors.captcha)}
            value={step4.captchaCode}
            inputMode="numeric"
            onChange={(event) => {
              setStep4Field(
                "captchaCode",
                event.target.value.replace(/[^0-9]/g, "").slice(0, 4),
              );
              onClearError?.("captcha");
            }}
            slotProps={{ htmlInput: { maxLength: 4 } }}
          />
        </div>
        {errors.captcha ? (
          <RequestForTrainingFieldError message="Please complete the CAPTCHA verification." />
        ) : null}
      </div>

      <ContactUsTermsModal
        open={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </>
  );
}
