"use client";

import { InputAdornment, TextField } from "@mui/material";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  requestForTrainingStep1Copy,
  requestForTrainingTypeOptions,
} from "@/data/services/requestForTrainingContent";
import {
  fetchPlaceAddress,
  fetchPlaceSuggestions,
  type PlaceSuggestion,
} from "@/lib/geo/places";
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";
import RequestForTrainingQuestionnaireIntro from "./RequestForTrainingQuestionnaireIntro";
import { useRequestForTrainingForm } from "./RequestForTrainingProvider";
import type { RequestForTrainingStep1Errors } from "./RequestForTrainingStep1";

// 주소 자동완성 조회 최소 입력 길이 / 디바운스 지연(ms) — TrainingSessionDetailForm(WhereToBuySearch 패턴)과 동일 값
const AUTOCOMPLETE_MIN_LENGTH = 1;
const AUTOCOMPLETE_DEBOUNCE_MS = 250;

// 기획서(traning_req1dc.png) 입력 제한 — 허용되지 않는 문자는 입력 시점에 자동 제거한다.
// 영문 텍스트 필드(First Name / Last Name / Company / Title): 영문자 + 공백만, 최대 200byte(영문만이라 1자=1byte).
const LETTERS_MAX = 200;
// 전화 계열(Phone / Cell Phone / Sales Contact): 숫자만, 지역코드 3 + 국번 3 + 가입자번호 4 = 10자리.
const PHONE_MAX_DIGITS = 10;
// Email Address 최대 길이(기획서에 길이 규정이 없어 별도 확정된 값).
const EMAIL_MAX = 50;

/** 영문자 + 공백만 남기고 최대 200자로 자름 */
function filterLetters(value: string): string {
  return value.replace(/[^A-Za-z ]/g, "").slice(0, LETTERS_MAX);
}

/** 숫자만 남기고 최대 10자리로 자름(하이픈 자동삽입은 기획서에 없어 하지 않음) */
function filterPhoneDigits(value: string): string {
  return value.replace(/[^0-9]/g, "").slice(0, PHONE_MAX_DIGITS);
}

/** 이메일 허용 문자(영문/숫자/. _ - @)만 남기고 최대 50자로 자름 */
function filterEmail(value: string): string {
  return value.replace(/[^A-Za-z0-9._@-]/g, "").slice(0, EMAIL_MAX);
}

/**
 * 에러 / 정상 구분 (값 내용이 아니라 props로 판단) — Figma 1689:8145
 * - 에러: FieldShell `error="메시지"` + TextField `error`
 *   → `--field--error` 클래스, helper 문구, 빨간 보더
 * - 정상: `error` prop 생략 (FieldShell / TextField 모두)
 *   → 기본 보더, helper 없음
 */
function FieldError({ message }: { message: string }) {
  return (
    <p className="support_service_training_request__error" role="alert">
      {message}
    </p>
  );
}

function FieldShell({
  className = "",
  error, // string이면 에러 UI, undefined면 정상
  label,
  children,
}: {
  className?: string;
  error?: string;
  label?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={[
        "support_service_training_request__field",
        error ? "support_service_training_request__field--error" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="support_service_training_request__control">
        {label}
        {children}
      </div>
      {error ? <FieldError message={error} /> : null}
    </div>
  );
}

// 입력값은 스텝 간 유지를 위해 Provider(Context + sessionStorage)에서 관리하고,
// 필수값 누락 표시(errors)는 Next 클릭 시점에 상위(RequestForTrainingStep1)에서 내려준다.
export default function RequestForTrainingStep1Form({
  errors,
  onClearError,
}: {
  errors: RequestForTrainingStep1Errors;
  onClearError: (key: keyof RequestForTrainingStep1Errors) => void;
}) {
  const formId = useId();
  const { fields } = requestForTrainingStep1Copy;
  const { step1, setStep1Field } = useRequestForTrainingForm();

  // 주소 자동완성 후보/드롭다운 상태 (TrainingSessionDetailForm 로직 이식)
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // 후보 선택으로 인한 streetAddress 갱신 시 재조회 1회 억제
  const suppressFetchRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streetWrapRef = useRef<HTMLDivElement>(null);

  // 도로명 입력 변화 시 디바운스 후 자동완성 후보 조회
  useEffect(() => {
    if (suppressFetchRef.current) {
      suppressFetchRef.current = false;
      return;
    }

    const trimmed = step1.streetAddress.trim();
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
  }, [step1.streetAddress]);

  // 바깥 클릭 시 드롭다운 닫기
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

  // 자동완성 후보 선택 → 도로명 채움 + City/State/ZIP 자동 채움(실패 시 조용히 스킵, 이후 수동 수정 가능)
  async function selectSuggestion(suggestion: PlaceSuggestion) {
    suppressFetchRef.current = true;
    setStep1Field("streetAddress", suggestion.description);
    onClearError("streetAddress");
    setSuggestions([]);
    setShowSuggestions(false);
    try {
      const address = await fetchPlaceAddress(suggestion.placeId);
      if (address) {
        // street 파싱값이 있으면 그것으로 정규화(없으면 선택한 description 유지)
        if (address.street) {
          suppressFetchRef.current = true;
          setStep1Field("streetAddress", address.street);
        }
        if (address.city) {
          setStep1Field("city", address.city);
          onClearError("city");
        }
        if (address.state) {
          setStep1Field("state", address.state);
          onClearError("state");
        }
        if (address.zip) {
          setStep1Field("zip", address.zip);
          onClearError("zip");
        }
      }
    } catch {
      // 주소 파싱 실패 시 자동채움 스킵 — 수동 입력 유지
    }
  }

  return (
    <div className="support_service_training_request__panel">
      <div className="support_service_training_request__panel-inner">
        <RequestForTrainingQuestionnaireIntro />

        <form
          className="support_service_training_request__form"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="support_service_training_request__form-grid">
            <div className="support_service_training_request__field support_service_training_request__field--full support_service_training_request__field--track">
              <RequestForTrainingFieldLabel required>
                {fields.trainingTrack.label}
              </RequestForTrainingFieldLabel>
              <div
                className="support_service_training_request__radios"
                role="radiogroup"
                aria-label={fields.trainingTrack.label}
              >
                {requestForTrainingTypeOptions.map((option) => {
                  const inputId = `${formId}-${option.id}`;
                  return (
                    <label
                      key={option.id}
                      className="support_service_training_request__radio-label"
                      htmlFor={inputId}
                    >
                      <input
                        id={inputId}
                        className="support_service_training_request__radio"
                        type="radio"
                        name={`${formId}-training-track`}
                        value={option.id}
                        checked={step1.trainingTrack === option.id}
                        onChange={() => setStep1Field("trainingTrack", option.id)}
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="support_service_training_request__form-row support_service_training_request__form-row--2">
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel
                  htmlFor={`${formId}-first-name`}
                  required
                >
                  {fields.firstName.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-first-name`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.firstName.placeholder}
                  value={step1.firstName}
                  error={Boolean(errors.firstName)}
                  onChange={(event) => {
                    setStep1Field("firstName", filterLetters(event.target.value));
                    onClearError("firstName");
                  }}
                />
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-last-name`}>
                  {fields.lastName.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-last-name`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.lastName.placeholder}
                  value={step1.lastName}
                  onChange={(event) =>
                    setStep1Field("lastName", filterLetters(event.target.value))
                  }
                />
              </div>
            </div>

            <div className="support_service_training_request__field support_service_training_request__field--full">
              <RequestForTrainingFieldLabel htmlFor={`${formId}-company`} required>
                {fields.company.label}
              </RequestForTrainingFieldLabel>
              <TextField
                id={`${formId}-company`}
                className="guide_field guide_field--h50 support_service_training_request__input"
                placeholder={fields.company.placeholder}
                value={step1.company}
                error={Boolean(errors.company)}
                onChange={(event) => {
                  setStep1Field("company", filterLetters(event.target.value));
                  onClearError("company");
                }}
              />
            </div>

            <div className="support_service_training_request__field support_service_training_request__field--full">
              <RequestForTrainingFieldLabel htmlFor={`${formId}-street`} required>
                {fields.streetAddress.label}
              </RequestForTrainingFieldLabel>
              <div className="support_service_training_request__form-row support_service_training_request__form-row--address">
                <FieldShell
                  className="support_service_training_request__field--address-search"
                >
                  {/* 자동완성 드롭다운 앵커(position: relative) — 입력 마크업 자체는 원본 그대로 */}
                  <div
                    className="support_service_training_request__street-wrap"
                    ref={streetWrapRef}
                  >
                    <TextField
                      id={`${formId}-street`}
                      className="guide_field guide_field--h50 guide_field--search support_service_training_request__input support_service_training_request__input--search"
                      placeholder={fields.streetAddress.searchPlaceholder}
                      value={step1.streetAddress}
                      error={Boolean(errors.streetAddress)}
                      onChange={(event) => {
                        setStep1Field("streetAddress", event.target.value);
                        onClearError("streetAddress");
                      }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              className="guide_field__search-adorn"
                            >
                              <button
                                type="button"
                                className="guide_field__search-icon-button"
                                aria-label="Search address"
                              >
                                <img
                                  src="/ico/ico_search_24.svg"
                                  alt=""
                                  width={18}
                                  height={18}
                                  loading="lazy"
                                  decoding="async"
                                />
                              </button>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    {showSuggestions ? (
                      <ul
                        className="support_service_training_request__suggestions"
                        role="listbox"
                        aria-label="Address suggestions"
                      >
                        {suggestions.map((suggestion) => (
                          <li
                            key={suggestion.placeId}
                            className="support_service_training_request__suggestion"
                            role="option"
                            aria-selected={false}
                          >
                            <button
                              type="button"
                              className="support_service_training_request__suggestion-button"
                              // onMouseDown: input blur 전에 선택이 확정되도록 mousedown 에서 처리
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
                </FieldShell>
                <FieldShell
                  className="support_service_training_request__field--address-2"
                >
                  <TextField
                    id={`${formId}-address-2`}
                    className="guide_field guide_field--h50 support_service_training_request__input"
                    placeholder={fields.streetAddress.address2Placeholder}
                    aria-label={fields.streetAddress.address2Placeholder}
                    value={step1.address2}
                    onChange={(event) =>
                      setStep1Field("address2", event.target.value)
                    }
                  />
                </FieldShell>
              </div>
            </div>

            <div className="support_service_training_request__form-row support_service_training_request__form-row--2">
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-city`} required>
                  {fields.city.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-city`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.city.placeholder}
                  value={step1.city}
                  error={Boolean(errors.city)}
                  onChange={(event) => {
                    setStep1Field("city", event.target.value);
                    onClearError("city");
                  }}
                />
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-state`} required>
                  {fields.state.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-state`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.state.placeholder}
                  value={step1.state}
                  error={Boolean(errors.state)}
                  onChange={(event) => {
                    setStep1Field("state", event.target.value);
                    onClearError("state");
                  }}
                />
              </div>
            </div>

            <div className="support_service_training_request__form-row support_service_training_request__form-row--2">
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-zip`} required>
                  {fields.zip.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-zip`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.zip.placeholder}
                  value={step1.zip}
                  error={Boolean(errors.zip)}
                  onChange={(event) => {
                    setStep1Field("zip", event.target.value);
                    onClearError("zip");
                  }}
                />
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-phone`} required>
                  {fields.phone.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-phone`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.phone.placeholder}
                  type="tel"
                  value={step1.phone}
                  error={Boolean(errors.phone)}
                  onChange={(event) => {
                    setStep1Field("phone", filterPhoneDigits(event.target.value));
                    onClearError("phone");
                  }}
                />
              </div>
            </div>

            {/* 기획서(traning_req1.png) 기준 추가 행 — ZIP/Phone 다음, Cell Phone/Sales Contact 앞 */}
            <div className="support_service_training_request__form-row support_service_training_request__form-row--2">
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-email`} required>
                  {fields.email.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-email`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.email.placeholder}
                  value={step1.email}
                  error={Boolean(errors.email)}
                  onChange={(event) => {
                    setStep1Field("email", filterEmail(event.target.value));
                    onClearError("email");
                  }}
                />
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-title`}>
                  {fields.title.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-title`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.title.placeholder}
                  value={step1.title}
                  onChange={(event) =>
                    setStep1Field("title", filterLetters(event.target.value))
                  }
                />
              </div>
            </div>

            <div className="support_service_training_request__form-row support_service_training_request__form-row--2">
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-cell-phone`}>
                  {fields.cellPhone.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-cell-phone`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.cellPhone.placeholder}
                  type="tel"
                  value={step1.cellPhone}
                  onChange={(event) =>
                    setStep1Field("cellPhone", filterPhoneDigits(event.target.value))
                  }
                />
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-sales-contact`}>
                  {fields.salesContact.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-sales-contact`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.salesContact.placeholder}
                  value={step1.salesContact}
                  onChange={(event) =>
                    setStep1Field(
                      "salesContact",
                      filterPhoneDigits(event.target.value),
                    )
                  }
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
