"use client";

import { Checkbox, TextField } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { useId, useRef, useState } from "react";
import {
  GuideCheckboxIcon,
  guideCheckboxIconsContactConsent,
} from "@/components/form/GuideFieldIcons";
import ContactUsTermsModal from "@/app/support/contact-us/components/ContactUsTermsModal";
import { requestForTrainingStep4Copy } from "@/data/services/requestForTrainingContent";
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

export default function RequestForTrainingConsentSection() {
  const formId = useId();
  const { fields } = requestForTrainingStep4Copy;
  const { step4, setStep4Field } = useRequestForTrainingForm();

  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

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

      <div className="support_service_training_request__consent">
        <label className="support_service_training_request__consent-label">
          <Checkbox
            className="guide_checkbox support_service_training_request__checkbox"
            disableRipple
            checked={step4.consentChecked}
            onChange={(event) =>
              setStep4Field("consentChecked", event.target.checked)
            }
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
      </div>

      {recaptchaSiteKey ? (
        <div className="support_service_training_request__recaptcha-box">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={recaptchaSiteKey}
            onChange={(token) => setStep4Field("recaptchaToken", token ?? "")}
            onExpired={() => setStep4Field("recaptchaToken", "")}
          />
        </div>
      ) : null}

      <ContactUsTermsModal
        open={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </>
  );
}
