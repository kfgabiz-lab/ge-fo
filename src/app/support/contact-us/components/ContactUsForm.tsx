"use client";

import {
  Checkbox,
  FormControl,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  GuideCheckboxIcon,
  GuideSelectIcon,
  guideCheckboxIconsContactConsent,
} from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { pushDataLayerEvent } from "@/lib/gtm";
import {
  type DevicesTreeRow,
  fetchDevicesTreeRows,
  resolveDevicesCategorySelection,
} from "@/data/gnb/devicesTree";
import {
  CATEGORY_CONTEXT_PARAM,
  PRODUCT_CONTEXT_PARAM,
  parseCategoryContext,
  parseProductContext,
} from "@/lib/navigation/categoryContext";
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

const CONSENT_MARKETING_ID = "newsletter";
const PRODUCT_CATEGORY_REQUIRED_INQUIRY_TYPES = [
  "PRODUCT_INFORMATION",
  "QUOTATION_REQUEST",
];
const QUOTATION_REQUEST_INQUIRY_TYPE = "QUOTATION_REQUEST";
const ORDERABLE_PRODUCT_ORDER_METHOD = "01";
const DISCONTINUED_PRODUCT_ORDER_STATUS = "99";
const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function filterDeviceRowsByInquiryType(
  rows: DevicesTreeRow[],
  inquiryType: string,
): DevicesTreeRow[] {
  const isQuotationRequest = inquiryType === QUOTATION_REQUEST_INQUIRY_TYPE;
  const lv3Rows = rows.filter(
    (row) =>
      row.depth === "3" &&
      row.productOrderStatus !== DISCONTINUED_PRODUCT_ORDER_STATUS &&
      (!isQuotationRequest ||
        row.productOrderMethod === ORDERABLE_PRODUCT_ORDER_METHOD),
  );
  const lv3ParentIds = new Set(lv3Rows.map((row) => row.parentId ?? ""));
  const lv2Rows = rows.filter(
    (row) =>
      row.depth === "2" &&
      row.rowId != null &&
      lv3ParentIds.has(String(row.rowId)),
  );
  const lv2ParentIds = new Set(lv2Rows.map((row) => row.parentId ?? ""));
  const lv1Rows = rows.filter(
    (row) =>
      row.depth === "1" &&
      row.rowId != null &&
      lv2ParentIds.has(String(row.rowId)),
  );
  return [...lv1Rows, ...lv2Rows, ...lv3Rows];
}

function renderSelectValue(label: string) {
  return (
    <span className="guide_field__select-value" title={label}>
      {label}
    </span>
  );
}

function rowKey(row: DevicesTreeRow): string {
  return row.rowId != null ? String(row.rowId) : "";
}

type ContactFieldErrors = {
  email?: boolean;
  firstName?: boolean;
  lastName?: boolean;
  companyName?: boolean;
  country?: boolean;
  description?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
  productCategory?: boolean;
};

type CategoryLevelConfig = {
  id: string;
  placeholder: string;
  ariaLabel: string;
  value: string;
  options: { value: string; label: string }[];
  disabled: boolean;
  onChange: (value: string) => void;
};

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
  error = false,
  errorMessage,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  fieldClassName?: string;
  error?: boolean;
  errorMessage?: string;
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
        error={error}
        helperText={errorMessage}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{
          htmlInput: {
            autoComplete: "off",
          },
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
                        ? "/ico/ico_password_on_22.webp"
                        : "/ico/ico_password_off_22.webp"
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
  return (
    <Suspense fallback={null}>
      <ContactUsFormContent />
    </Suspense>
  );
}

function ContactUsFormContent() {
  const formId = useId();
  const searchParams = useSearchParams();
  const initialCategoryId = parseCategoryContext(
    searchParams.get(CATEGORY_CONTEXT_PARAM),
  );
  const initialProductId = parseProductContext(
    searchParams.get(PRODUCT_CONTEXT_PARAM),
  );
  const isMobile = useMediaQuery("(max-width: 780px)");
  const countryPlaceholder = isMobile
    ? contactUsFormCopy.countryPlaceholderMobile
    : contactUsFormCopy.countryPlaceholder;
  const sendLabel = isMobile
    ? contactUsFormCopy.sendLabelMobile
    : contactUsFormCopy.sendLabel;
  const [inquiryTypes, setInquiryTypes] = useState<CodeItem[]>([]);
  const [countries, setCountries] = useState<CodeItem[]>([]);

  const [inquiryType, setInquiryType] = useState("");
  const productCategoryRequired =
    PRODUCT_CATEGORY_REQUIRED_INQUIRY_TYPES.includes(inquiryType);
  const [rawDeviceRows, setRawDeviceRows] = useState<DevicesTreeRow[]>([]);
  const [categoryIds, setCategoryIds] = useState<{
    lv1: string;
    lv2: string;
    lv3: string;
  }>({ lv1: "", lv2: "", lv3: "" });
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [consent, setConsent] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      contactUsConsentItems.map((item) => [item.id, item.defaultChecked]),
    ),
  );
  const [errors, setErrors] = useState<ContactFieldErrors>({});

  const [submitting, setSubmitting] = useState(false);
  const submitAckParts = contactUsFormCopy.submitAck.split("{privacyPolicy}");

  useEffect(() => {
    let alive = true;
    fetchInquiryTypes()
      .then((codes) => {
        if (!alive) return;
        setInquiryTypes(codes);
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

  useEffect(() => {
    let alive = true;
    fetchDevicesTreeRows()
      .then((rows) => {
        if (!alive) return;
        setRawDeviceRows(rows);
        const initialRows = filterDeviceRowsByInquiryType(rows, "");
        const selection = resolveDevicesCategorySelection(
          initialRows,
          initialCategoryId,
          initialProductId,
        );
        if (selection.lv1) setCategoryIds(selection);
      })
      .catch(() => {
        if (alive) setRawDeviceRows([]);
      });
    return () => {
      alive = false;
    };
  }, [initialCategoryId, initialProductId]);

  const deviceRows = useMemo(
    () => filterDeviceRowsByInquiryType(rawDeviceRows, inquiryType),
    [rawDeviceRows, inquiryType],
  );

  const lv1Rows = deviceRows.filter((row) => row.depth === "1");
  const lv2Rows = deviceRows.filter(
    (row) => row.depth === "2" && row.parentId === categoryIds.lv1,
  );
  const lv3Rows = deviceRows.filter(
    (row) => row.depth === "3" && row.parentId === categoryIds.lv2,
  );

  const categoryLevels: CategoryLevelConfig[] = [
    {
      id: contactUsCategoryLevels[0].id,
      placeholder: contactUsCategoryLevels[0].label,
      ariaLabel: contactUsCategoryLevels[0].ariaLabel,
      value: categoryIds.lv1,
      options: lv1Rows.map((row) => ({
        value: rowKey(row),
        label: row.categoryTitle ?? "",
      })),
      disabled: false,
      onChange: (value) => {
        setCategoryIds({ lv1: value, lv2: "", lv3: "" });
        if (errors.productCategory) {
          setErrors((prev) => ({ ...prev, productCategory: undefined }));
        }
      },
    },
    {
      id: contactUsCategoryLevels[1].id,
      placeholder: contactUsCategoryLevels[1].label,
      ariaLabel: contactUsCategoryLevels[1].ariaLabel,
      value: categoryIds.lv2,
      options: lv2Rows.map((row) => ({
        value: rowKey(row),
        label: row.categoryTitle ?? "",
      })),
      disabled: !categoryIds.lv1 || lv2Rows.length === 0,
      onChange: (value) =>
        setCategoryIds((prev) => ({ ...prev, lv2: value, lv3: "" })),
    },
    {
      id: contactUsCategoryLevels[2].id,
      placeholder: contactUsCategoryLevels[2].label,
      ariaLabel: contactUsCategoryLevels[2].ariaLabel,
      value: categoryIds.lv3,
      options: lv3Rows.map((row) => ({
        value: rowKey(row),
        label: row.productTitle ?? "",
      })),
      disabled: !categoryIds.lv2 || lv3Rows.length === 0,
      onChange: (value) =>
        setCategoryIds((prev) => ({ ...prev, lv3: value })),
    },
  ];

  function renderCategorySelect(config: CategoryLevelConfig, error = false) {
    return (
      <GuideSelect
        value={config.value}
        onChange={(event) => config.onChange(String(event.target.value))}
        displayEmpty
        disabled={config.disabled}
        error={error}
        IconComponent={GuideSelectIcon}
        inputProps={{ "aria-label": config.ariaLabel }}
        renderValue={(value) => {
          const selected = config.options.find(
            (option) => option.value === String(value),
          );
          return renderSelectValue(selected ? selected.label : config.placeholder);
        }}
      >
        <MenuItem value="" disabled>
          {config.placeholder}
        </MenuItem>
        {config.options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </GuideSelect>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const descriptionValue = descriptionRef.current?.value ?? "";
    const emailValid =
      email.trim() !== "" && EMAIL_FORMAT_REGEX.test(email.trim());
    const nextErrors: ContactFieldErrors = {
      email: !emailValid,
      firstName: firstName.trim() === "",
      lastName: lastName.trim() === "",
      companyName: companyName.trim() === "",
      country: country.trim() === "",
      description: descriptionValue.trim() === "",
      password: password.trim() === "",
      confirmPassword: confirmPassword.trim() === "",
      productCategory: productCategoryRequired && categoryIds.lv3.trim() === "",
    };
    setErrors(nextErrors);

    const requiredFilled =
      inquiryType.trim() !== "" &&
      emailValid &&
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      companyName.trim() !== "" &&
      country.trim() !== "" &&
      descriptionValue.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      (!productCategoryRequired || categoryIds.lv3.trim() !== "");
    if (!requiredFilled) {
      alert(
        email.trim() !== "" && !emailValid
          ? "Please enter a valid email address."
          : "Please complete all required fields.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      alert(contactUsFormCopy.confirmPasswordMismatch);
      return;
    }
    setPasswordMismatch(false);

    setSubmitting(true);

    const payload: ContactUsInquiryRequest = {
      type: inquiryType,
      email,
      firstName,
      lastName,
      companyName,
      country,
      description: descriptionValue,
      password,
      confirmPassword,
      marketingOptInFlag: Boolean(consent[CONSENT_MARKETING_ID]),
      privacyConsentFlag: true,
    };
    const lv1Row = lv1Rows.find((row) => rowKey(row) === categoryIds.lv1);
    const lv2Row = lv2Rows.find((row) => rowKey(row) === categoryIds.lv2);
    const lv3Row = lv3Rows.find((row) => rowKey(row) === categoryIds.lv3);
    const categoryLabels = [
      lv1Row?.categoryTitle,
      lv2Row?.categoryTitle,
      lv3Row?.productTitle,
    ].filter((label): label is string => Boolean(label));
    if (categoryLabels.length > 0) {
      payload.productCategory = categoryLabels.join(" | ");
    }
    if (lv3Row?.productId != null) {
      payload.productId = lv3Row.productId;
    }

    try {
      await submitContactUs(payload);
      pushDataLayerEvent({
        event: "generate_lead",
        form_name: "Contact Us",
        inquiry_type:
          inquiryTypes.find((option) => option.code === inquiryType)?.name ??
          inquiryType,
      });
      alert(contactUsFormCopy.submitSuccess);
      window.location.href = "/support/contact-us";
    } catch {
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="support_contact_form" id="support-contact-form">
      <div className="inner">
        <form
          className="support_contact_form__panel"
          onSubmit={handleSubmit}
          noValidate
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
                          onChange={() => {
                            setInquiryType(option.code);
                            setCategoryIds({ lv1: "", lv2: "", lv3: "" });
                          }}
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
                <ContactUsFieldLabel required={productCategoryRequired}>
                  {contactUsFormCopy.productCategory}
                </ContactUsFieldLabel>
                <FormControl className="guide_field">
                  {renderCategorySelect(
                    categoryLevels[0],
                    Boolean(errors.productCategory),
                  )}
                </FormControl>
              </div>
              {categoryLevels.slice(1).map((level) => (
                <FormControl
                  key={level.id}
                  className="guide_field support_contact_form__category-select"
                >
                  {renderCategorySelect(level, Boolean(errors.productCategory))}
                </FormControl>
              ))}
            </div>

            <div className="support_contact_form__row support_contact_form__row--3 support_contact_form__row--contact">
              {[
                {
                  id: "email",
                  errorKey: "email" as const,
                  label: contactUsFormCopy.email,
                  type: "email",
                  value: email,
                  onChange: setEmail,
                },
                {
                  id: "first-name",
                  errorKey: "firstName" as const,
                  label: contactUsFormCopy.firstName,
                  type: "text",
                  value: firstName,
                  onChange: setFirstName,
                },
                {
                  id: "last-name",
                  errorKey: "lastName" as const,
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
                    error={Boolean(errors[field.errorKey])}
                    value={field.value}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                      if (errors[field.errorKey]) {
                        setErrors((prev) => ({
                          ...prev,
                          [field.errorKey]: undefined,
                        }));
                      }
                    }}
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
                  error={Boolean(errors.companyName)}
                  value={companyName}
                  onChange={(event) => {
                    setCompanyName(event.target.value);
                    if (errors.companyName) {
                      setErrors((prev) => ({ ...prev, companyName: undefined }));
                    }
                  }}
                />
              </div>
              <div className="support_contact_form__field support_contact_form__field--half support_contact_form__field--country">
                <ContactUsFieldLabel htmlFor={`${formId}-country`} required>
                  {contactUsFormCopy.country}
                </ContactUsFieldLabel>
                <FormControl className="guide_field">
                  <GuideSelect
                    value={country}
                    onChange={(event) => {
                      setCountry(String(event.target.value));
                      if (errors.country) {
                        setErrors((prev) => ({ ...prev, country: undefined }));
                      }
                    }}
                    error={Boolean(errors.country)}
                    displayEmpty
                    IconComponent={GuideSelectIcon}
                    inputProps={{ id: `${formId}-country` }}
                    renderValue={(value) => {
                       const selected = countries.find(
                          (option) => option.code === String(value),
                      );
                      const label = value ? selected?.name ?? String(value) : countryPlaceholder;
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
              <textarea
                id={`${formId}-details`}
                ref={descriptionRef}
                className={[
                  "support_contact_form__textarea",
                  errors.description ? "support_contact_form__textarea--error" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                placeholder={contactUsFormCopy.inquiryDetailsPlaceholder}
                rows={5}
                required
                defaultValue=""
                onChange={() => {
                  setErrors((prev) =>
                    prev.description
                      ? { ...prev, description: undefined }
                      : prev,
                  );
                }}
              />
            </div>

            <div className="support_contact_form__row support_contact_form__row--password">
              <PasswordField
                id={`${formId}-password`}
                label={contactUsFormCopy.password}
                placeholder={contactUsFormCopy.passwordPlaceholder}
                value={password}
                onChange={(value) => {
                  setPassword(value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                  if (passwordMismatch) setPasswordMismatch(false);
                }}
                error={Boolean(errors.password)}
                fieldClassName="support_contact_form__field--password"
              />
              <PasswordField
                id={`${formId}-confirm-password`}
                label={contactUsFormCopy.confirmPassword}
                placeholder={contactUsFormCopy.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(value) => {
                  setConfirmPassword(value);
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }
                  if (passwordMismatch) setPasswordMismatch(false);
                }}
                error={Boolean(errors.confirmPassword) || passwordMismatch}
                errorMessage={
                  passwordMismatch
                    ? contactUsFormCopy.confirmPasswordMismatch
                    : undefined
                }
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
                          input: {
                            id: checkboxId,
                            name: item.id,
                          },
                        }}
                      />
                      <span className="support_contact_form__consent-text">
                        {item.label}
                        {"labelRest" in item && item.labelRest ? (
                          <span className="support_contact_form__consent-text-rest">
                            {item.labelRest}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  </div>
                );
                })}
              </div>
            </div>
          </div>

          <div className="support_contact_form__submit-wrap">
            <p className="support_contact_form__consent-note">
              {submitAckParts[0]}
              <Link
                href="/privacy-policy"
                className="support_contact_form__consent-note-link"
              >
                {contactUsFormCopy.submitAckLinkLabel}
              </Link>
              {submitAckParts[1]}
            </p>
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
    </section>
  );
}
