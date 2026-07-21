"use client";

import {
  Checkbox,
  FormControl,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import {
  GuideCheckboxIcon,
  GuideSelectIcon,
  guideCheckboxIconsContactConsent,
} from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  contactUsCategoryLevels,
  contactUsConsentItems,
  contactUsFormCopy,
  contactUsTechnicalInquiry,
} from "@/data/support/contactUsContent";
import {
  type CodeItem,
  type ContactUsInquiryRequest,
  fetchCountries,
  fetchInquiryTypes,
  submitContactUs,
} from "../data/contactUsData";
import ContactUsTermsModal from "./ContactUsTermsModal";

// 동의 항목 id(데이터 파일 contactUsConsentItems 기준) → 제출 플래그 매핑용 상수
const CONSENT_PRIVACY_ID = "personal-info"; // 개인정보 수집·이용 동의(필수) → privacyConsentFlag
const CONSENT_MARKETING_ID = "newsletter"; // 마케팅 수신 동의 → marketingOptInFlag

function renderSelectValue(label: string) {
  return (
    <span className="guide_field__select-value" title={label}>
      {label}
    </span>
  );
}

function ContactUsFieldLabel({
  children,
  required = false,
  htmlFor,
}: {
  children: string;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label className="support_contact_form__label" htmlFor={htmlFor}>
      {children}
      {required ? (
        <span className="support_contact_form__required" aria-hidden>
          {" "}
          *
        </span>
      ) : null}
    </label>
  );
}

function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
  fieldClassName = "",
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  fieldClassName?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={`support_contact_form__field support_contact_form__field--half ${fieldClassName}`.trim()}
    >
      <ContactUsFieldLabel htmlFor={id} required>
        {label}
      </ContactUsFieldLabel>
      <TextField
        id={id}
        className="guide_field support_contact_form__input"
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <button
                  type="button"
                  className="support_contact_form__password-toggle"
                  aria-label={visible ? "Hide password" : "Show password"}
                  onClick={() => setVisible((open) => !open)}
                >
                  <img
                    src={
                      visible
                        ? "/ico/ico_password_on_22.png"
                        : "/ico/ico_password_off_22.png"
                    }
                    alt=""
                    width={22}
                    height={22}
                  />
                </button>
              </InputAdornment>
            ),
          },
        }}
      />
    </div>
  );
}

export default function ContactUsForm() {
  const formId = useId();
  const isMobile = useMediaQuery("(max-width: 780px)");
  const countryPlaceholder = isMobile
    ? contactUsFormCopy.countryPlaceholderMobile
    : contactUsFormCopy.countryPlaceholder;
  const sendLabel = isMobile
    ? contactUsFormCopy.sendLabelMobile
    : contactUsFormCopy.sendLabel;
  // 공통코드 API(GET /api/v1/fo/codes/{groupCode})로 로딩하는 옵션 목록
  const [inquiryTypes, setInquiryTypes] = useState<CodeItem[]>([]);
  const [countries, setCountries] = useState<CodeItem[]>([]);

  // 폼 입력 상태 (제출 시 값을 모으기 위해 전부 제어 컴포넌트로 관리)
  const [inquiryType, setInquiryType] = useState(""); // 선택된 문의유형 code(대문자)
  const [categoryValues, setCategoryValues] = useState<Record<string, string>>(
    {},
  ); // 제품 카테고리 lv1/lv2/lv3 선택값(선택)
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState(""); // 선택된 국가 code(대문자, 예: US)
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // 동의 체크 상태 — 데이터 파일 기본값(defaultChecked)으로 초기화
  const [consent, setConsent] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      contactUsConsentItems.map((item) => [item.id, item.defaultChecked]),
    ),
  );
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // 제출 진행/결과 상태
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  // 마운트 시 문의유형/국가 옵션을 공통코드 API로 조회 (warranty-policy의 alive 가드 패턴)
  useEffect(() => {
    let alive = true;
    fetchInquiryTypes()
      .then((codes) => {
        if (!alive) return;
        setInquiryTypes(codes);
        // 원래 UX(첫 라디오 선택) 유지 — 첫 코드로 초기 선택
        if (codes.length > 0) setInquiryType((prev) => prev || codes[0].code);
      })
      .catch(() => {
        if (alive) setInquiryTypes([]);
      });
    fetchCountries()
      .then((codes) => {
        if (alive) setCountries(codes);
      })
      .catch(() => {
        if (alive) setCountries([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  // 제출 처리 — 폼 상태를 ContactUsInquiryRequest로 조립해 POST
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitResult(null);
    setSubmitting(true);

    // 필수 필드 + 선택 카테고리를 스펙에 맞게 조립 (교차검증/코드검증은 BE에 위임)
    const payload: ContactUsInquiryRequest = {
      type: inquiryType,
      email,
      firstName,
      lastName,
      companyName,
      country,
      description,
      password,
      confirmPassword,
      marketingOptInFlag: Boolean(consent[CONSENT_MARKETING_ID]),
      privacyConsentFlag: Boolean(consent[CONSENT_PRIVACY_ID]),
    };
    // 제품 카테고리는 선택 항목 — 값이 있을 때만 전송
    if (categoryValues.lv1) payload.productCategoryLv1 = categoryValues.lv1;
    if (categoryValues.lv2) payload.productCategoryLv2 = categoryValues.lv2;
    if (categoryValues.lv3) payload.productCategoryLv3 = categoryValues.lv3;

    try {
      await submitContactUs(payload);
      setSubmitResult({ ok: true, message: contactUsFormCopy.submitSuccess });
    } catch {
      // fetchApi는 비정상 응답(400 등) 시 Error를 throw — 상세 사유는 BE가 재검증
      setSubmitResult({ ok: false, message: contactUsFormCopy.submitError });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="support_contact_form" id="support-contact-form">
      <div className="inner">
        <form className="support_contact_form__panel" onSubmit={handleSubmit}>
          <div className="support_contact_form__body">
            <fieldset className="support_contact_form__group support_contact_form__group--inquiry">
              <legend className="ir">{contactUsFormCopy.inquiryType}</legend>
              <div className="support_contact_form__inquiry-fields">
                <ContactUsFieldLabel required>
                  {contactUsFormCopy.inquiryType}
                </ContactUsFieldLabel>
                <div
                  className="support_contact_form__radios"
                  role="radiogroup"
                  aria-label={contactUsFormCopy.inquiryType}
                >
                  {inquiryTypes.map((option) => {
                    const inputId = `${formId}-${option.code}`;
                    return (
                      <label
                        key={option.code}
                        className="support_contact_form__radio-label"
                        htmlFor={inputId}
                      >
                        <input
                          id={inputId}
                          className="support_contact_form__radio"
                          type="radio"
                          name={`${formId}-inquiry-type`}
                          value={option.code}
                          checked={inquiryType === option.code}
                          onChange={() => setInquiryType(option.code)}
                        />
                        <span>{option.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <Link
                href={contactUsTechnicalInquiry.href}
                className="btn-text-30 support_contact_form__external-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {contactUsTechnicalInquiry.label}
                <span className="btn-text-30__icon">
                  <span className="icon_link-14" aria-hidden />
                </span>
              </Link>
            </fieldset>

            <div className="support_contact_form__row support_contact_form__row--category">
              <div className="support_contact_form__field support_contact_form__field--category">
                <ContactUsFieldLabel>
                  {contactUsFormCopy.productCategory}
                </ContactUsFieldLabel>
                <FormControl className="guide_field">
                  <GuideSelect
                    value={categoryValues[contactUsCategoryLevels[0].id] ?? ""}
                    onChange={(event) =>
                      setCategoryValues((prev) => ({
                        ...prev,
                        [contactUsCategoryLevels[0].id]: String(
                          event.target.value,
                        ),
                      }))
                    }
                    displayEmpty
                    IconComponent={GuideSelectIcon}
                    inputProps={{
                      "aria-label": contactUsCategoryLevels[0].ariaLabel,
                    }}
                    renderValue={(value) => {
                      const label = value
                        ? String(value)
                        : contactUsCategoryLevels[0].label;
                      return renderSelectValue(label);
                    }}
                  >
                    <MenuItem value="" disabled>
                      {contactUsCategoryLevels[0].label}
                    </MenuItem>
                    <MenuItem value={contactUsCategoryLevels[0].label}>
                      {contactUsCategoryLevels[0].label}
                    </MenuItem>
                  </GuideSelect>
                </FormControl>
              </div>
              {contactUsCategoryLevels.slice(1).map((level) => (
                <FormControl
                  key={level.id}
                  className="guide_field support_contact_form__category-select"
                >
                  <GuideSelect
                    value={categoryValues[level.id] ?? ""}
                    onChange={(event) =>
                      setCategoryValues((prev) => ({
                        ...prev,
                        [level.id]: String(event.target.value),
                      }))
                    }
                    displayEmpty
                    IconComponent={GuideSelectIcon}
                    inputProps={{ "aria-label": level.ariaLabel }}
                    renderValue={(value) => {
                      const label = value ? String(value) : level.label;
                      return renderSelectValue(label);
                    }}
                  >
                    <MenuItem value="" disabled>
                      {level.label}
                    </MenuItem>
                    <MenuItem value={level.label}>{level.label}</MenuItem>
                  </GuideSelect>
                </FormControl>
              ))}
            </div>

            <div className="support_contact_form__row support_contact_form__row--3 support_contact_form__row--contact">
              {[
                {
                  id: "email",
                  label: contactUsFormCopy.email,
                  type: "email",
                  value: email,
                  onChange: setEmail,
                },
                {
                  id: "first-name",
                  label: contactUsFormCopy.firstName,
                  type: "text",
                  value: firstName,
                  onChange: setFirstName,
                },
                {
                  id: "last-name",
                  label: contactUsFormCopy.lastName,
                  type: "text",
                  value: lastName,
                  onChange: setLastName,
                },
              ].map((field) => (
                <div
                  key={field.id}
                  className={`support_contact_form__field support_contact_form__field--third support_contact_form__field--${field.id}`}
                >
                  <ContactUsFieldLabel
                    htmlFor={`${formId}-${field.id}`}
                    required
                  >
                    {field.label}
                  </ContactUsFieldLabel>
                  <TextField
                    id={`${formId}-${field.id}`}
                    className="guide_field support_contact_form__input"
                    type={field.type}
                    required
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="support_contact_form__row support_contact_form__row--company-country">
              <div className="support_contact_form__field support_contact_form__field--half support_contact_form__field--company">
                <ContactUsFieldLabel
                  htmlFor={`${formId}-company`}
                  required
                >
                  {contactUsFormCopy.companyName}
                </ContactUsFieldLabel>
                <TextField
                  id={`${formId}-company`}
                  className="guide_field support_contact_form__input"
                  required
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                />
              </div>
              <div className="support_contact_form__field support_contact_form__field--half support_contact_form__field--country">
                <ContactUsFieldLabel required>
                  {contactUsFormCopy.country}
                </ContactUsFieldLabel>
                <FormControl className="guide_field">
                  <GuideSelect
                    value={country}
                    onChange={(event) => setCountry(String(event.target.value))}
                    displayEmpty
                    IconComponent={GuideSelectIcon}
                    inputProps={{ "aria-label": contactUsFormCopy.country }}
                    renderValue={(value) => {
                      const label = value
                        ? (countries.find((item) => item.code === value)?.name ??
                          String(value))
                        : countryPlaceholder;
                      return (
                        <span
                          className={
                            value
                              ? "guide_field__select-value"
                              : countryPlaceholder
                                ? "guide_field__select-value guide_field__select-value--default"
                                : "guide_field__select-value"
                          }
                          title={label}
                        >
                          {label}
                        </span>
                      );
                    }}
                  >
                    {countryPlaceholder ? (
                      <MenuItem value="" disabled>
                        {countryPlaceholder}
                      </MenuItem>
                    ) : (
                      <MenuItem value="" sx={{ display: "none" }}>
                        {" "}
                      </MenuItem>
                    )}
                    {countries.map((option) => (
                      <MenuItem key={option.code} value={option.code}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </GuideSelect>
                </FormControl>
              </div>
            </div>

            <div className="support_contact_form__group support_contact_form__group--details">
              <ContactUsFieldLabel
                htmlFor={`${formId}-details`}
                required
              >
                {contactUsFormCopy.inquiryDetails}
              </ContactUsFieldLabel>
              <TextField
                id={`${formId}-details`}
                className="guide_field support_contact_form__input support_contact_form__input--textarea"
                placeholder={contactUsFormCopy.inquiryDetailsPlaceholder}
                multiline
                minRows={5}
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="support_contact_form__row support_contact_form__row--password">
              <PasswordField
                id={`${formId}-password`}
                label={contactUsFormCopy.password}
                placeholder={contactUsFormCopy.passwordPlaceholder}
                value={password}
                onChange={setPassword}
                fieldClassName="support_contact_form__field--password"
              />
              <PasswordField
                id={`${formId}-confirm-password`}
                label={contactUsFormCopy.confirmPassword}
                placeholder={contactUsFormCopy.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={setConfirmPassword}
                fieldClassName="support_contact_form__field--confirm-password"
              />
            </div>

            <div className="support_contact_form__consent">
              <hr className="support_contact_form__divider" />
              <div className="support_contact_form__consent-items">
                {contactUsConsentItems.map((item) => {
                  const checkboxId = `${formId}-${item.id}`;
                  return (
                  <div key={item.id} className="support_contact_form__consent-row">
                    <label
                      className="support_contact_form__consent-label"
                      htmlFor={checkboxId}
                    >
                      <Checkbox
                        className="guide_checkbox"
                        checked={Boolean(consent[item.id])}
                        onChange={(event) =>
                          setConsent((prev) => ({
                            ...prev,
                            [item.id]: event.target.checked,
                          }))
                        }
                        disableRipple
                        icon={
                          <GuideCheckboxIcon
                            {...guideCheckboxIconsContactConsent}
                          />
                        }
                        checkedIcon={
                          <GuideCheckboxIcon
                            checked
                            {...guideCheckboxIconsContactConsent}
                          />
                        }
                        slotProps={{
                          input: { id: checkboxId, name: item.id },
                        }}
                      />
                      <span>
                        {item.label}
                        {"required" in item && item.required ? (
                          <span
                            className="support_contact_form__required"
                            aria-hidden
                          >
                            {" "}
                            *
                          </span>
                        ) : null}
                      </span>
                    </label>
                    {item.termsHref ? (
                      <Link
                        href={item.termsHref}
                        className="support_contact_form__terms-link"
                      >
                        {item.termsLabel}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="support_contact_form__terms-link"
                        onClick={() => setTermsModalOpen(true)}
                      >
                        {item.termsLabel}
                      </button>
                    )}
                  </div>
                );
                })}
              </div>
            </div>
          </div>

          <div className="support_contact_form__submit-wrap">
            {submitResult ? (
              <p
                className={`support_contact_form__message ${
                  submitResult.ok
                    ? "support_contact_form__message--success"
                    : "support_contact_form__message--error"
                }`}
                role={submitResult.ok ? "status" : "alert"}
              >
                {submitResult.message}
              </p>
            ) : null}
            <button
              type="submit"
              className="btn-base btn-lv01 btn-lv01--solid support_contact_form__submit"
              disabled={submitting}
            >
              {submitting ? contactUsFormCopy.sendingLabel : sendLabel}
            </button>
          </div>
        </form>
      </div>
      <ContactUsTermsModal
        open={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </section>
  );
}
