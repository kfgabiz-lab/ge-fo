"use client";

import {
  Checkbox,
  FormControl,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useId, useRef, useState } from "react";
import {
  GuideCheckboxIcon,
  GuideSelectIcon,
  guideCheckboxIconsContactConsent,
} from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import type { EngineeringTrainingSessionDetail } from "@/data/services/engineeringTrainingSessionDetailContent";
import { engineeringTrainingSessionFormCopy } from "@/data/services/engineeringTrainingSessionDetailContent";
import {
  fetchPlaceAddress,
  fetchPlaceSuggestions,
  type PlaceSuggestion,
} from "@/lib/geo/places";
import {
  type CodeItem,
  type TrainingRegistrationRequest,
  fetchBusinessTypes,
  submitTrainingRegistration,
} from "../data/trainingRegistrationData";

// Training 세션 상세 - 등록 폼(실제 제출 연동). Contact Us 폼의 컨트롤드 입력/errors/제출 패턴 이식.
// 주소 자동완성은 WhereToBuySearch 의 디바운스+바깥클릭닫기+listbox 패턴 이식.

// 주소 자동완성 조회 최소 입력 길이 / 디바운스 지연(ms) — WhereToBuySearch 와 동일 값
const AUTOCOMPLETE_MIN_LENGTH = 1;
const AUTOCOMPLETE_DEBOUNCE_MS = 250;

// 제출 성공 안내 문구(퍼블리싱엔 없는 문구 — 성공 시에만 alert 로 안내)
const SUBMIT_SUCCESS_MESSAGE =
  "Your registration has been submitted successfully.";

// 이메일 형식 검증(값이 있어도 형식이 아니면 에러) — BE @Email 거부 전에 화면에서 먼저 차단
const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Send 클릭 시 빈 값인 필수 텍스트 필드 에러 표시용 맵(체크박스/셀렉트는 대상 아님)
type SessionFieldErrors = {
  studentName?: boolean;
  email?: boolean;
  jobTitle?: boolean;
  phone?: boolean;
  companyName?: boolean;
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
  // 전송값: 세션 시작일("yyyy-MM-dd"). 표시값과 달리 서버 파싱용 원본 문자열.
  const eventDateValue = session.event?.startIso ?? "";
  // FK 컬럼 매핑: route 의 courseId=커리큘럼 page_data.id, sessionId=회차 page_data.id
  const curriculumId = Number(session.courseId);
  const sessionId = Number(session.sessionId);

  // 폼 입력 상태(전부 제어 컴포넌트)
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
  const [typeOfBusiness, setTypeOfBusiness] = useState(""); // BUSINESSTYPE 코드값(001/002/003)
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [errors, setErrors] = useState<SessionFieldErrors>({});

  // Type of Business 옵션(공통코드 API)
  const [businessTypes, setBusinessTypes] = useState<CodeItem[]>([]);

  // reCAPTCHA 토큰/위젯 참조
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // 주소 자동완성 후보/드롭다운 상태
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // 후보 선택으로 인한 setStreetAddress 재조회 1회 억제
  const suppressFetchRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streetWrapRef = useRef<HTMLDivElement>(null);

  // 제출 진행 상태
  const [submitting, setSubmitting] = useState(false);

  // 마운트 시 비즈니스 유형 옵션 조회(실패 시 빈 배열 폴백 → 옵션 없음)
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

  // 도로명 입력 변화 시 디바운스 후 자동완성 후보 조회(WhereToBuySearch 패턴)
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

  // 바깥 클릭 시 드롭다운 닫기(WhereToBuySearch 패턴)
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

  // 자동완성 후보 선택 → 도로명 채움 + City/State/ZIP 자동 채움(실패 시 조용히 스킵)
  async function selectSuggestion(suggestion: PlaceSuggestion) {
    suppressFetchRef.current = true;
    setStreetAddress(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
    try {
      const address = await fetchPlaceAddress(suggestion.placeId);
      if (address) {
        // street 파싱값이 있으면 그것으로 정규화(없으면 선택한 description 유지)
        if (address.street) {
          suppressFetchRef.current = true;
          setStreetAddress(address.street);
        }
        if (address.city) setCity(address.city);
        if (address.state) setStateProvince(address.state);
        if (address.zip) setZipCode(address.zip);
      }
    } catch {
      // 주소 파싱 실패 시 자동채움 스킵 — 수동 입력 유지
    }
  }

  // 필수 텍스트 필드 변경 시 에러 표시 해제
  function clearError(key: keyof SessionFieldErrors) {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  // 제출 처리 — 필수/형식 검증 → reCAPTCHA 토큰 확인 → POST
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    // 빈 값/형식 오류인 필수 텍스트 필드 에러 표시(이메일은 값이 있어도 형식 검증)
    const emailValid =
      email.trim() !== "" && EMAIL_FORMAT_REGEX.test(email.trim());
    const nextErrors: SessionFieldErrors = {
      studentName: studentName.trim() === "",
      email: !emailValid,
      jobTitle: jobTitle.trim() === "",
      phone: phone.trim() === "",
      companyName: companyName.trim() === "",
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
      // 이메일만 형식 오류인 경우 전용 문구, 그 외(빈값 등)는 Contact Us 동일 문구 패턴
      alert(
        email.trim() !== "" && !emailValid
          ? "Please enter a valid email address."
          : "Please complete all required fields.",
      );
      return;
    }

    // reCAPTCHA 토큰 없으면 차단
    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA verification.");
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
      recaptchaToken,
    };
    // 선택 필드는 값 있을 때만 포함
    if (streetAddress.trim()) payload.streetAddress = streetAddress.trim();
    if (address2.trim()) payload.address2 = address2.trim();
    if (apartment.trim()) payload.apartment = apartment.trim();
    if (city.trim()) payload.city = city.trim();
    if (stateProvince.trim()) payload.stateProvince = stateProvince.trim();
    if (zipCode.trim()) payload.zipCode = zipCode.trim();
    if (typeOfBusiness.trim()) payload.typeOfBusiness = typeOfBusiness.trim();

    try {
      await submitTrainingRegistration(payload);
      // 성공만 alert 로 안내(Contact Us 패턴)
      alert(SUBMIT_SUCCESS_MESSAGE);
    } catch {
      // 실패 시 별도 안내 없음(Contact Us 패턴)
    } finally {
      // reCAPTCHA 토큰은 1회성 — 재제출 대비 리셋
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
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
                setStudentName(event.target.value);
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
                setEmail(event.target.value);
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
                setJobTitle(event.target.value);
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
                // 자동 하이픈 포맷팅 없이 숫자만 남긴다(숫자 아닌 입력 차단)
                setPhone(event.target.value.replace(/[^0-9]/g, ""));
                clearError("phone");
              }}
              slotProps={{ htmlInput: { maxLength: 20 } }}
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
                setCompanyName(event.target.value);
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
                        // input blur 전에 선택 확정되도록 mousedown 에서 처리
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
              aria-label="Address 2"
              value={address2}
              onChange={(event) => setAddress2(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 255 } }}
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
              onChange={(event) => setApartment(event.target.value)}
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
                  "aria-label": "Type of Business",
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
              slotProps={{ input: { readOnly: true } }}
            />
          </div>
        </div>

        </div>

          <div className="support_service_training_session_detail__form-consent">
            <hr className="support_service_training_session_detail__form-divider" />

            <div className="support_service_training_session_detail__consent">
              <label className="support_service_training_session_detail__consent-label">
                <Checkbox
                  className="guide_checkbox"
                  disableRipple
                  checked={privacyConsent}
                  onChange={(event) => setPrivacyConsent(event.target.checked)}
                  icon={<GuideCheckboxIcon {...guideCheckboxIconsContactConsent} />}
                  checkedIcon={
                    <GuideCheckboxIcon checked {...guideCheckboxIconsContactConsent} />
                  }
                />
                <span>Consent to Collection and Use of Personal Information</span>
              </label>
              <Link
                href="/support/contact-us/terms"
                className="support_service_training_session_detail__terms-link"
              >
                View Full Terms
              </Link>
            </div>
          </div>
        </div>

        {recaptchaSiteKey ? (
          <div className="support_service_training_session_detail__recaptcha-box">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={recaptchaSiteKey}
              onChange={(token) => setRecaptchaToken(token)}
              onExpired={() => setRecaptchaToken(null)}
            />
          </div>
        ) : null}
      </div>

      <button
        type="submit"
        className="btn-base btn-lv01 btn-lv01--solid support_service_training_session_detail__submit"
        disabled={submitting}
      >
        {engineeringTrainingSessionFormCopy.submitLabel}
      </button>
    </form>
  );
}
