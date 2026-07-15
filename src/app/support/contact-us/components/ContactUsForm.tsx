"use client";

import {
  Checkbox,
  FormControl,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useId, useState } from "react";
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
  contactUsCountryOptions,
  contactUsFormCopy,
  contactUsInquiryTypes,
  contactUsTechnicalInquiry,
} from "@/data/support/contactUsContent";
import ContactUsTermsModal from "./ContactUsTermsModal";

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
  const [inquiryType, setInquiryType] = useState<
    (typeof contactUsInquiryTypes)[number]["id"]
  >(contactUsInquiryTypes[0].id);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  return (
    <section className="support_contact_form" id="support-contact-form">
      <div className="inner">
        <form
          className="support_contact_form__panel"
          onSubmit={(event) => event.preventDefault()}
        >
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
                  {contactUsInquiryTypes.map((option) => {
                    const inputId = `${formId}-${option.id}`;
                    return (
                      <label
                        key={option.id}
                        className="support_contact_form__radio-label"
                        htmlFor={inputId}
                      >
                        <input
                          id={inputId}
                          className="support_contact_form__radio"
                          type="radio"
                          name={`${formId}-inquiry-type`}
                          value={option.id}
                          checked={inquiryType === option.id}
                          onChange={() => setInquiryType(option.id)}
                        />
                        <span>{option.label}</span>
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
                    defaultValue=""
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
                    defaultValue=""
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
                { id: "email", label: contactUsFormCopy.email },
                { id: "first-name", label: contactUsFormCopy.firstName },
                { id: "last-name", label: contactUsFormCopy.lastName },
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
                />
              </div>
              <div className="support_contact_form__field support_contact_form__field--half support_contact_form__field--country">
                <ContactUsFieldLabel required>
                  {contactUsFormCopy.country}
                </ContactUsFieldLabel>
                <FormControl className="guide_field">
                  <GuideSelect
                    defaultValue=""
                    displayEmpty
                    IconComponent={GuideSelectIcon}
                    inputProps={{ "aria-label": contactUsFormCopy.country }}
                    renderValue={(value) => {
                      const label = value
                        ? (contactUsCountryOptions.find(
                            (item) => item.value === value,
                          )?.label ?? String(value))
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
                    {contactUsCountryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
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
                        defaultChecked={item.defaultChecked}
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
            <button
              type="submit"
              className="btn-base btn-lv01 btn-lv01--solid support_contact_form__submit"
            >
              {sendLabel}
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
