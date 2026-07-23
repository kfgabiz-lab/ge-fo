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
  type DevicesTreeRow,
  fetchDevicesTreeRows,
} from "@/data/gnb/devicesTree";
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

// devices-tree 행의 rowId → parentId 매칭/셀렉트 value 용 문자열 키.
function rowKey(row: DevicesTreeRow): string {
  return row.rowId != null ? String(row.rowId) : "";
}

// 제품 카테고리 cascading 셀렉트 한 단계의 렌더 설정.
type CategoryLevelConfig = {
  id: string;
  placeholder: string; // 미선택 시 표시 라벨(Lv1/Lv2/Lv3 Category)
  ariaLabel: string;
  value: string; // 선택된 rowId(문자열)
  options: { value: string; label: string }[]; // value=rowId, label=표시명
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
  // 제품 카테고리 원본 데이터(devices-tree flat 행) — GNB 메가메뉴와 동일 엔드포인트 재사용
  const [deviceRows, setDeviceRows] = useState<DevicesTreeRow[]>([]);
  // 제품 카테고리 lv1/lv2/lv3 선택값 — 각 단계에서 선택한 행의 rowId(문자열, 선택 항목)
  const [categoryIds, setCategoryIds] = useState<{
    lv1: string;
    lv2: string;
    lv3: string;
  }>({ lv1: "", lv2: "", lv3: "" });
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

  // 제출 진행 상태 — 성공/실패 모두 퍼블리싱대로 별도 안내 문구 없음(성공만 alert()로 안내)
  const [submitting, setSubmitting] = useState(false);

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

  // 마운트 시 제품 카테고리(devices-tree) 실데이터 조회. 실패 시 빈 배열 폴백 → 옵션 없음 상태로 표시.
  useEffect(() => {
    let alive = true;
    fetchDevicesTreeRows()
      .then((rows) => {
        if (alive) setDeviceRows(rows);
      })
      .catch(() => {
        if (alive) setDeviceRows([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Lv1(depth1) → Lv2(depth2, 상위 rowId 일치) → Lv3(depth3, 상위 rowId 일치) cascading 옵션 파생
  const lv1Rows = deviceRows.filter((row) => row.depth === "1");
  const lv2Rows = deviceRows.filter(
    (row) => row.depth === "2" && row.parentId === categoryIds.lv1,
  );
  const lv3Rows = deviceRows.filter(
    (row) => row.depth === "3" && row.parentId === categoryIds.lv2,
  );

  // 제품 카테고리 3단 셀렉트 렌더 설정 — 상위 변경 시 하위 선택 초기화(일반 cascading 관행)
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
      onChange: (value) => setCategoryIds({ lv1: value, lv2: "", lv3: "" }),
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

  // 단일 카테고리 셀렉트 렌더 — value=rowId, renderValue 는 옵션에서 라벨을 역조회해 표시
  function renderCategorySelect(config: CategoryLevelConfig) {
    return (
      <GuideSelect
        value={config.value}
        onChange={(event) => config.onChange(String(event.target.value))}
        displayEmpty
        disabled={config.disabled}
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

  // 제출 처리 — 폼 상태를 ContactUsInquiryRequest로 조립해 POST
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    // 필수 항목 누락 확인
    const requiredFilled =
      inquiryType.trim() !== "" &&
      email.trim() !== "" &&
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      companyName.trim() !== "" &&
      country.trim() !== "" &&
      description.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      Boolean(consent[CONSENT_PRIVACY_ID]);
    if (!requiredFilled) {
      alert("Please complete all required fields.");
      return;
    }

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
    // 제품 카테고리는 선택 항목 — 선택된 레벨의 라벨을 "카테고리1 | 카테고리2 | 카테고리3" 형태로 결합해 전송
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
    // Lv3(제품)의 product-data PK — BE가 담당자 이메일 조회에 사용
    if (lv3Row?.productId != null) {
      payload.productId = lv3Row.productId;
    }

    try {
      await submitContactUs(payload);
      // 성공은 alert()로 안내(퍼블리싱엔 없는 문구, 사용자 지정 내용)
      alert(contactUsFormCopy.submitSuccess);
    } catch {
      // 실패 시 퍼블리싱대로 별도 안내 없음
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
                  {renderCategorySelect(categoryLevels[0])}
                </FormControl>
              </div>
              {categoryLevels.slice(1).map((level) => (
                <FormControl
                  key={level.id}
                  className="guide_field support_contact_form__category-select"
                >
                  {renderCategorySelect(level)}
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
                      const label = value ? String(value) : countryPlaceholder;
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
                        {option.code}
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
