"use client";

import { InputAdornment, TextField } from "@mui/material";
import { useEffect, useId, useRef, useState } from "react";
import { requestForTrainingStep3Copy } from "@/data/services/requestForTrainingContent";
import {
  fetchPlaceAddress,
  fetchPlaceSuggestions,
  type PlaceSuggestion,
} from "@/lib/geo/places";
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";
import RequestForTrainingQuestionnaireIntro from "./RequestForTrainingQuestionnaireIntro";
import { useRequestForTrainingForm } from "./RequestForTrainingProvider";
import type { RequestForTrainingStep3Errors } from "./RequestForTrainingStep3";

// 주소 자동완성 조회 최소 입력 길이 / 디바운스 지연(ms) — Step1Form과 동일 값
const AUTOCOMPLETE_MIN_LENGTH = 1;
const AUTOCOMPLETE_DEBOUNCE_MS = 250;

// 기획서(traning_req3dc.png) 입력 제한 — 허용되지 않는 문자는 입력 시점에 자동 제거한다.
const LOCATION_NAME_MAX = 200; // 교육 장소: 영문만, 최대 200byte
const CONTACT_PERSON_MAX = 50; // 수업 담당자: 모든 문자 허용, 최대 50byte(필터 없음)
const CONTACT_DETAILS_MAX = 400; // 연락처/이메일: 영문/숫자/-_@ + 마침표(사용자 확정), 최대 400byte

/** 영문자 + 공백만 남기고 최대 200자로 자름 */
function filterLocationName(value: string): string {
  return value.replace(/[^A-Za-z ]/g, "").slice(0, LOCATION_NAME_MAX);
}

/** 필터 없이 최대 50자로만 자름(기획서: 모든 문자 입력 가능) */
function filterContactPerson(value: string): string {
  return value.slice(0, CONTACT_PERSON_MAX);
}

/** 이메일/전화 혼용 허용 문자(영문/숫자/. _ - @)만 남기고 최대 400자로 자름 */
function filterContactDetails(value: string): string {
  return value.replace(/[^A-Za-z0-9._@-]/g, "").slice(0, CONTACT_DETAILS_MAX);
}

// 입력값은 스텝 간 유지를 위해 Provider(Context + sessionStorage)에서 관리하고,
// 필수값 누락 표시(errors)는 Next 클릭 시점에 상위(RequestForTrainingStep3)에서 내려준다.
export default function RequestForTrainingStep3Form({
  errors,
  onClearError,
}: {
  errors: RequestForTrainingStep3Errors;
  onClearError: (key: keyof RequestForTrainingStep3Errors) => void;
}) {
  const formId = useId();
  const { fields } = requestForTrainingStep3Copy;
  const { step3, setStep3Field } = useRequestForTrainingForm();
  const isInPerson = step3.trainingFormat === "In-Person";

  // 주소 자동완성 후보/드롭다운 상태 (Step1Form 로직 그대로 복붙 — 필드명만 step3 기준으로 교체)
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suppressFetchRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streetWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (suppressFetchRef.current) {
      suppressFetchRef.current = false;
      return;
    }

    const trimmed = step3.streetAddress.trim();
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
  }, [step3.streetAddress]);

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
    setStep3Field("streetAddress", suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
    try {
      const address = await fetchPlaceAddress(suggestion.placeId);
      if (address) {
        if (address.street) {
          suppressFetchRef.current = true;
          setStep3Field("streetAddress", address.street);
        }
        if (address.city) setStep3Field("city", address.city);
        if (address.state) setStep3Field("state", address.state);
        if (address.zip) setStep3Field("zip", address.zip);
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
            <div className="support_service_training_request__field support_service_training_request__field--full">
              <RequestForTrainingFieldLabel required>
                {fields.trainingFormat.label}
              </RequestForTrainingFieldLabel>
              <div
                className="support_service_training_request__radios"
                role="radiogroup"
                aria-label={fields.trainingFormat.label}
              >
                {fields.trainingFormat.options.map((option) => {
                  const inputId = `${formId}-format-${option.replace(/\s+/g, "-").toLowerCase()}`;
                  return (
                    <label
                      key={option}
                      className="support_service_training_request__radio-label"
                      htmlFor={inputId}
                    >
                      <input
                        id={inputId}
                        className="support_service_training_request__radio"
                        type="radio"
                        name={`${formId}-training-format`}
                        value={option}
                        checked={step3.trainingFormat === option}
                        onChange={() => setStep3Field("trainingFormat", option)}
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 기획서(traning_req3dc.png) 요구 — Virtual 선택 시 [1a] 영역(장소명~연락처) 전체 숨김 */}
            {isInPerson ? (
              <>
                <div className="support_service_training_request__field support_service_training_request__field--full">
                  <RequestForTrainingFieldLabel
                    htmlFor={`${formId}-location-name`}
                    required
                  >
                    {fields.locationName.label}
                  </RequestForTrainingFieldLabel>
                  <TextField
                    id={`${formId}-location-name`}
                    className="guide_field guide_field--h50 support_service_training_request__input"
                    value={step3.locationName}
                    error={Boolean(errors.locationName)}
                    onChange={(event) => {
                      setStep3Field("locationName", filterLocationName(event.target.value));
                      onClearError("locationName");
                    }}
                  />
                </div>

                <div className="support_service_training_request__field support_service_training_request__field--full">
                  <RequestForTrainingFieldLabel htmlFor={`${formId}-street`}>
                    {fields.streetAddress.label}
                  </RequestForTrainingFieldLabel>
                  <div className="support_service_training_request__form-row support_service_training_request__form-row--address">
                    <div
                      className="support_service_training_request__street-wrap"
                      ref={streetWrapRef}
                    >
                      <TextField
                        id={`${formId}-street`}
                        className="guide_field guide_field--h50 guide_field--search support_service_training_request__input support_service_training_request__input--search"
                        placeholder={fields.streetAddress.searchPlaceholder}
                        value={step3.streetAddress}
                        onChange={(event) =>
                          setStep3Field("streetAddress", event.target.value)
                        }
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
                    <TextField
                      id={`${formId}-address-2`}
                      className="guide_field guide_field--h50 support_service_training_request__input"
                      placeholder={fields.streetAddress.address2Placeholder}
                      value={step3.address2}
                      onChange={(event) => setStep3Field("address2", event.target.value)}
                    />
                  </div>
                </div>

                <div className="support_service_training_request__form-row support_service_training_request__form-row--2">
                  <div className="support_service_training_request__field">
                    <RequestForTrainingFieldLabel htmlFor={`${formId}-city`}>
                      {fields.city.label}
                    </RequestForTrainingFieldLabel>
                    <TextField
                      id={`${formId}-city`}
                      className="guide_field guide_field--h50 support_service_training_request__input"
                      placeholder={fields.city.placeholder}
                      value={step3.city}
                      onChange={(event) => setStep3Field("city", event.target.value)}
                    />
                  </div>
                  <div className="support_service_training_request__field">
                    <RequestForTrainingFieldLabel htmlFor={`${formId}-state`}>
                      {fields.state.label}
                    </RequestForTrainingFieldLabel>
                    <TextField
                      id={`${formId}-state`}
                      className="guide_field guide_field--h50 support_service_training_request__input"
                      placeholder={fields.state.placeholder}
                      value={step3.state}
                      onChange={(event) => setStep3Field("state", event.target.value)}
                    />
                  </div>
                </div>

                <div className="support_service_training_request__field support_service_training_request__field--full">
                  <RequestForTrainingFieldLabel htmlFor={`${formId}-zip`}>
                    {fields.zip.label}
                  </RequestForTrainingFieldLabel>
                  <TextField
                    id={`${formId}-zip`}
                    className="guide_field guide_field--h50 support_service_training_request__input"
                    placeholder={fields.zip.placeholder}
                    value={step3.zip}
                    onChange={(event) => setStep3Field("zip", event.target.value)}
                  />
                </div>

                <div className="support_service_training_request__field support_service_training_request__field--full">
                  <RequestForTrainingFieldLabel htmlFor={`${formId}-contact-person`}>
                    {fields.contactPerson.label}
                  </RequestForTrainingFieldLabel>
                  <TextField
                    id={`${formId}-contact-person`}
                    className="guide_field guide_field--h50 support_service_training_request__input"
                    value={step3.contactPerson}
                    onChange={(event) =>
                      setStep3Field("contactPerson", filterContactPerson(event.target.value))
                    }
                  />
                </div>

                <div className="support_service_training_request__field support_service_training_request__field--full">
                  <RequestForTrainingFieldLabel
                    htmlFor={`${formId}-contact-details`}
                    required
                  >
                    {fields.contactDetails.label}
                  </RequestForTrainingFieldLabel>
                  <TextField
                    id={`${formId}-contact-details`}
                    className="guide_field guide_field--h50 support_service_training_request__input"
                    value={step3.contactDetails}
                    error={Boolean(errors.contactDetails)}
                    onChange={(event) => {
                      setStep3Field(
                        "contactDetails",
                        filterContactDetails(event.target.value),
                      );
                      onClearError("contactDetails");
                    }}
                  />
                </div>
              </>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
