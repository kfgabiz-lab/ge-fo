"use client";

import {
  Checkbox,
  FormControl,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  GuideCheckboxIcon,
  GuideSelectIcon,
  guideCheckboxIconsContactConsent,
} from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import PrivacyPolicyModal from "@/components/modals/PrivacyPolicyModal";
import type { EngineeringTrainingSessionDetail } from "@/data/services/engineeringTrainingSessionDetailContent";
import { engineeringTrainingSessionFormCopy } from "@/data/services/engineeringTrainingSessionDetailContent";
import {
  fetchPlaceAddress,
  fetchPlaceSuggestions,
  type PlaceSuggestion,
} from "@/lib/geo/places";
import {
  PHONE_MAX_DIGITS,
  filterEmail,
  filterLetters,
  filterPhoneDigits,
  isComposingEvent,
} from "@/lib/formInputFilters";
import {
  type CodeItem,
  type TrainingRegistrationRequest,
  fetchBusinessTypes,
  submitTrainingRegistration,
} from "../data/trainingRegistrationData";
import { fetchCaptcha, type Captcha } from "@/lib/captcha";
import { ApiError } from "@/lib/api";

const AUTOCOMPLETE_MIN_LENGTH = 1;
const AUTOCOMPLETE_DEBOUNCE_MS = 250;

const SUBMIT_SUCCESS_MESSAGE =
  "Your registration has been submitted successfully.";

const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SessionFieldErrors = {
  studentName?: boolean;
  email?: boolean;
  jobTitle?: boolean;
  phone?: boolean;
  companyName?: boolean;
  privacyConsent?: boolean;
  captcha?: boolean;
};

function SessionFieldLabel({
  children,
  required = false,
  htmlFor,
}: {
  children: string;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label
      className="support_service_training_session_detail__field-label"
      htmlFor={htmlFor}
    >
      {children}
      {required ? (
        <span className="support_service_training_session_detail__required" aria-hidden>
          {" "}
          *
        </span>
      ) : null}
    </label>
  );
}

export default function TrainingSessionDetailForm({
  session,
}: {
  session: EngineeringTrainingSessionDetail;
}) {
  const formId = useId();
  const eventDateDisplay = session.sidebar.eventDateToAttend;
  const eventDateValue = session.event?.startIso ?? "";
  const curriculumId = Number(session.curriculumId);
  const sessionId = Number(session.sessionId);

  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [typeOfBusiness, setTypeOfBusiness] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [errors, setErrors] = useState<SessionFieldErrors>({});
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const [businessTypes, setBusinessTypes] = useState<CodeItem[]>([]);

  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [captchaCode, setCaptchaCode] = useState("");

  const loadCaptcha = useCallback(async () => {
    try {
      setCaptcha(await fetchCaptcha());
    } catch {
      setCaptcha(null);
    }
  }, []);

  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suppressFetchRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streetWrapRef = useRef<HTMLDivElement>(null);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchBusinessTypes()
      .then((codes) => {
        if (alive) setBusinessTypes(codes);
      })
      .catch(() => {
        if (alive) setBusinessTypes([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha]);

  useEffect(() => {
    if (suppressFetchRef.current) {
      suppressFetchRef.current = false;
      return;
    }

    const trimmed = streetAddress.trim();
    if (trimmed.length < AUTOCOMPLETE_MIN_LENGTH) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchPlaceSuggestions(trimmed)
        .then((list) => {
          setSuggestions(list);
          setShowSuggestions(list.length > 0);
        })
        .catch(() => {
          setSuggestions([]);
          setShowSuggestions(false);
        });
    }, AUTOCOMPLETE_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [streetAddress]);

  useEffect(() => {
    if (!showSuggestions) return;
    function handlePointerDown(event: MouseEvent) {
      if (
        streetWrapRef.current &&
        !streetWrapRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [showSuggestions]);

  async function selectSuggestion(suggestion: PlaceSuggestion) {
    suppressFetchRef.current = true;
    setStreetAddress(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
    try {
      const address = await fetchPlaceAddress(suggestion.placeId);
      if (address) {
        if (address.street) {
          suppressFetchRef.current = true;
          setStreetAddress(address.street);
        }
        if (address.city) setCity(address.city);
        if (address.state) setStateProvince(address.state);
        if (address.zip) setZipCode(address.zip);
      }
    } catch {
    }
  }

  function clearError(key: keyof SessionFieldErrors) {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const emailValid =
      email.trim() !== "" && EMAIL_FORMAT_REGEX.test(email.trim());
    const captchaValid = Boolean(captcha) && /^\d{4}$/.test(captchaCode.trim());
    const nextErrors: SessionFieldErrors = {
      studentName: studentName.trim() === "",
      email: !emailValid,
      jobTitle: jobTitle.trim() === "",
      phone: phone.trim() === "",
      companyName: companyName.trim() === "",
      privacyConsent: !privacyConsent,
      captcha: !captchaValid,
    };
    setErrors(nextErrors);

    const requiredFilled =
      studentName.trim() !== "" &&
      emailValid &&
      jobTitle.trim() !== "" &&
      phone.trim() !== "" &&
      companyName.trim() !== "" &&
      eventDateValue.trim() !== "" &&
      privacyConsent;
    if (!requiredFilled) {
      alert(
        email.trim() !== "" && !emailValid
          ? "Please enter a valid email address."
          : "Please complete all required fields.",
      );
      return;
    }

    if (!captchaValid || !captcha) {
      alert("Please complete the CAPTCHA verification.");
      return;
    }

    setSubmitting(true);

    const payload: TrainingRegistrationRequest = {
      curriculumId,
      sessionId,
      studentName,
      email,
      jobTitle,
      phone,
      companyName,
      eventDate: eventDateValue,
      privacyConsentFlag: privacyConsent,
      captchaCode: captchaCode.trim(),
      captchaToken: captcha.captchaToken,
    };
    if (streetAddress.trim()) payload.streetAddress = streetAddress.trim();
    if (address2.trim()) payload.address2 = address2.trim();
    if (apartment.trim()) payload.apartment = apartment.trim();
    if (city.trim()) payload.city = city.trim();
    if (stateProvince.trim()) payload.stateProvince = stateProvince.trim();
    if (zipCode.trim()) payload.zipCode = zipCode.trim();
    if (typeOfBusiness.trim()) payload.typeOfBusiness = typeOfBusiness.trim();

    try {
      await submitTrainingRegistration(payload);
      alert(SUBMIT_SUCCESS_MESSAGE);
      window.location.reload();
    } catch (error) {
      console.error("[training-session-detail] submit failed", error);
      if (error instanceof ApiError && error.code === "CAPTCHA_FAILED") {
        setErrors((prev) => ({ ...prev, captcha: true }));
        alert("The CAPTCHA code is incorrect. Please try again.");
      } else if (error instanceof ApiError && error.code === "CAPTCHA_EXPIRED") {
        setErrors((prev) => ({ ...prev, captcha: true }));
        alert("The CAPTCHA has expired. Please try again.");
      } else {
        alert("Something went wrong while submitting. Please try again.");
      }
    } finally {
      setCaptchaCode("");
      loadCaptcha();
      setSubmitting(false);
    }
  }

  return (
    <form
      className="support_service_training_session_detail__form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="support_service_training_session_detail__form-body">
        <div className="support_service_training_session_detail__form-main">
          <div className="support_service_training_session_detail__form-grid">
        <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--2">
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-student-name`} required>
              Student Name
            </SessionFieldLabel>
            <TextField
              id={`${formId}-student-name`}
              className="guide_field guide_field--h50 support_service_training_session_detail__input"
              placeholder="Student Name"
              error={Boolean(errors.studentName)}
              value={studentName}
              onChange={(event) => {
                if (isComposingEvent(event)) {
                  setStudentName(event.target.value);
                  return;
                }
                setStudentName(filterLetters(event.target.value, 100));
                clearError("studentName");
              }}
              onCompositionEnd={(event) => {
                setStudentName(filterLetters((event.target as HTMLInputElement).value, 100));
                clearError("studentName");
              }}
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
          </div>
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-email`} required>
              E-mail Address
            </SessionFieldLabel>
            <TextField
              id={`${formId}-email`}
              className="guide_field guide_field--h50 support_service_training_session_detail__input"
              placeholder="E-mail Address"
              type="email"
              error={Boolean(errors.email)}
              value={email}
              onChange={(event) => {
                if (isComposingEvent(event)) {
                  setEmail(event.target.value);
                  return;
                }
                setEmail(filterEmail(event.target.value, 255));
                clearError("email");
              }}
              onCompositionEnd={(event) => {
                setEmail(filterEmail((event.target as HTMLInputElement).value, 255));
                clearError("email");
              }}
              slotProps={{ htmlInput: { maxLength: 255 } }}
            />
          </div>
        </div>

        <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--2">
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-job-title`} required>
              Job Title
            </SessionFieldLabel>
            <TextField
              id={`${formId}-job-title`}
              className="guide_field guide_field--h50 support_service_training_session_detail__input"
              placeholder="Job Title"
              error={Boolean(errors.jobTitle)}
              value={jobTitle}
              onChange={(event) => {
                if (isComposingEvent(event)) {
                  setJobTitle(event.target.value);
                  return;
                }
                setJobTitle(filterLetters(event.target.value, 100));
                clearError("jobTitle");
              }}
              onCompositionEnd={(event) => {
                setJobTitle(filterLetters((event.target as HTMLInputElement).value, 100));
                clearError("jobTitle");
              }}
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
          </div>
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-phone`} required>
              Phone
            </SessionFieldLabel>
            <TextField
              id={`${formId}-phone`}
              className="guide_field guide_field--h50 support_service_training_session_detail__input"
              placeholder="Phone"
              type="tel"
              inputMode="numeric"
              error={Boolean(errors.phone)}
              value={phone}
              onChange={(event) => {
                setPhone(filterPhoneDigits(event.target.value));
                clearError("phone");
              }}
              slotProps={{ htmlInput: { maxLength: PHONE_MAX_DIGITS } }}
            />
          </div>
        </div>

        <div className="support_service_training_session_detail__form-row">
          <div className="support_service_training_session_detail__field support_service_training_session_detail__field--full">
            <SessionFieldLabel htmlFor={`${formId}-company`} required>
              Company
            </SessionFieldLabel>
            <TextField
              id={`${formId}-company`}
              className="guide_field guide_field--h50 support_service_training_session_detail__input"
              placeholder="Company"
              error={Boolean(errors.companyName)}
              value={companyName}
              onChange={(event) => {
                if (isComposingEvent(event)) {
                  setCompanyName(event.target.value);
                  return;
                }
                setCompanyName(filterLetters(event.target.value, 100));
                clearError("companyName");
              }}
              onCompositionEnd={(event) => {
                setCompanyName(filterLetters((event.target as HTMLInputElement).value, 100));
                clearError("companyName");
              }}
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
          </div>
        </div>

        <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--address">
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-street`}>
              Street Address
            </SessionFieldLabel>
            <div
              className="support_service_training_session_detail__street-wrap"
              ref={streetWrapRef}
            >
              <TextField
                id={`${formId}-street`}
                className="guide_field guide_field--h50 guide_field--search support_service_training_session_detail__input"
                placeholder="Keyword Search"
                autoComplete="off"
                value={streetAddress}
                onChange={(event) => setStreetAddress(event.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end" className="guide_field__search-adorn">
                        <span
                          className="guide_field__search-icon-button"
                          aria-hidden
                        >
                          <img
                            src="/ico/ico_search_24.svg"
                            alt=""
                            width={18}
                            height={18}
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {showSuggestions ? (
                <ul
                  className="support_service_training_session_detail__suggestions"
                  role="listbox"
                  aria-label="Address suggestions"
                >
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.placeId}
                      className="support_service_training_session_detail__suggestion"
                      role="option"
                      aria-selected={false}
                    >
                      <button
                        type="button"
                        className="support_service_training_session_detail__suggestion-button"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          void selectSuggestion(suggestion);
                        }}
                      >
                        {suggestion.description}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
          <div className="support_service_training_session_detail__field">
            <TextField
              id={`${formId}-address-2`}
              className="guide_field guide_field--h50 support_service_training_session_detail__input"
              placeholder="Address 2"
              value={address2}
              onChange={(event) => setAddress2(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 255, "aria-label": "Address 2" } }}
            />
          </div>
        </div>

        <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--2">
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-apartment`}>
              Apartment, suite, etc
            </SessionFieldLabel>
            <TextField
              id={`${formId}-apartment`}
              className="guide_field guide_field--h50 support_service_training_session_detail__input"
              placeholder="Apartment, suite, etc"
              value={apartment}
              onChange={(event) => {
                if (isComposingEvent(event)) {
                  setApartment(event.target.value);
                  return;
                }
                setApartment(filterLetters(event.target.value, 100));
              }}
              onCompositionEnd={(event) => {
                setApartment(filterLetters((event.target as HTMLInputElement).value, 100));
              }}
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
          </div>
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-city`}>City</SessionFieldLabel>
            <TextField
              id={`${formId}-city`}
              className="guide_field guide_field--h50 support_service_training_session_detail__input"
              placeholder="City"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
          </div>
        </div>

        <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--2">
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-state`}>
              State/Province
            </SessionFieldLabel>
            <TextField
              id={`${formId}-state`}
              className="guide_field guide_field--h50 support_service_training_session_detail__input"
              placeholder="State/Province"
              value={stateProvince}
              onChange={(event) => setStateProvince(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
          </div>
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-zip`}>
              ZIP / Postal Code
            </SessionFieldLabel>
            <TextField
              id={`${formId}-zip`}
              className="guide_field guide_field--h50 support_service_training_session_detail__input"
              placeholder="ZIP / Postal Code"
              value={zipCode}
              onChange={(event) => setZipCode(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 20 } }}
            />
          </div>
        </div>

        <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--2">
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-business-type`}>
              Type of Business
            </SessionFieldLabel>
            <FormControl className="guide_field guide_field--h50">
              <GuideSelect
                value={typeOfBusiness}
                onChange={(event) => setTypeOfBusiness(String(event.target.value))}
                displayEmpty
                IconComponent={GuideSelectIcon}
                inputProps={{
                  id: `${formId}-business-type`,
                }}
                renderValue={(value) => {
                  const selected = businessTypes.find(
                    (option) => option.code === String(value),
                  );
                  const label = selected ? selected.name : "Type of Business";
                  return (
                    <span
                      className={
                        selected
                          ? "guide_field__select-value"
                          : "guide_field__select-value guide_field__select-value--default"
                      }
                      title={label}
                    >
                      {label}
                    </span>
                  );
                }}
              >
                <MenuItem value="" disabled>
                  Type of Business
                </MenuItem>
                {businessTypes.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.name}
                  </MenuItem>
                ))}
              </GuideSelect>
            </FormControl>
          </div>
          <div className="support_service_training_session_detail__field">
            <SessionFieldLabel htmlFor={`${formId}-event-date`} required>
              Event Date to Attend
            </SessionFieldLabel>
            <TextField
              id={`${formId}-event-date`}
              className="guide_field guide_field--h50 support_service_training_session_detail__input support_service_training_session_detail__input--readonly"
              value={eventDateDisplay}
              slotProps={{
                input: { readOnly: true },
              }}
            />
          </div>
        </div>

        </div>

          <div className="support_service_training_session_detail__form-consent">
            <hr className="support_service_training_session_detail__form-divider" />

            <div className="support_service_training_session_detail__consent">
              <label className="support_service_training_session_detail__consent-label">
                <Checkbox
                  className={`guide_checkbox${errors.privacyConsent ? " guide_checkbox--error" : ""}`}
                  disableRipple
                  checked={privacyConsent}
                  onChange={(event) => {
                    setPrivacyConsent(event.target.checked);
                    clearError("privacyConsent");
                  }}
                  icon={<GuideCheckboxIcon {...guideCheckboxIconsContactConsent} />}
                  checkedIcon={
                    <GuideCheckboxIcon checked {...guideCheckboxIconsContactConsent} />
                  }
                />
                <span>Consent to Collection and Use of Personal Information</span>
              </label>
              <button
                type="button"
                className="support_service_training_session_detail__terms-link"
                onClick={() => setTermsModalOpen(true)}
              >
                View Full Terms
              </button>
            </div>
            {errors.privacyConsent ? (
              <p className="guide_checkbox__error">This field is required.</p>
            ) : null}
          </div>
        </div>

        <div className="support_service_training_session_detail__recaptcha-box">
          <div className="support_service_training_session_detail__captcha-row">
            {captcha ? (
              <img
                src={captcha.captchaImage}
                alt="CAPTCHA"
                className="support_service_training_session_detail__captcha-image"
              />
            ) : (
              <div className="support_service_training_session_detail__captcha-image support_service_training_session_detail__captcha-image--loading" />
            )}
            <button
              type="button"
              onClick={() => loadCaptcha()}
              className="support_service_training_session_detail__captcha-refresh"
              aria-label="Refresh CAPTCHA"
            >
              <img src="/ico/ico_refresh_22.svg" alt="" width={18} height={18} />
            </button>
            <TextField
              className="guide_field guide_field--h50 support_service_training_session_detail__input support_service_training_session_detail__captcha-input"
              placeholder="CAPTCHA"
              error={Boolean(errors.captcha)}
              value={captchaCode}
              inputMode="numeric"
              onChange={(event) => {
                setCaptchaCode(event.target.value.replace(/[^0-9]/g, "").slice(0, 4));
                clearError("captcha");
              }}
              slotProps={{ htmlInput: { maxLength: 4 } }}
            />
          </div>
          {errors.captcha ? (
            <p className="guide_checkbox__error">
              Please complete the CAPTCHA verification.
            </p>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        className="btn-base btn-lv01 btn-lv01--solid support_service_training_session_detail__submit"
        disabled={
          submitting ||
          session.registrationClosed ||
          session.registrationNotYetOpen
        }
      >
        {engineeringTrainingSessionFormCopy.submitLabel}
      </button>

      <PrivacyPolicyModal
        open={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </form>
  );
}
