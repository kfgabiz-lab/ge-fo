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
import {
  filterDigitsOnly,
  filterEmail,
  filterLetters,
  filterPhoneDigits,
  isComposingEvent,
} from "@/lib/formInputFilters";
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";
import RequestForTrainingQuestionnaireIntro from "./RequestForTrainingQuestionnaireIntro";
import { useRequestForTrainingForm } from "./RequestForTrainingProvider";
import type { RequestForTrainingStep1Errors } from "./RequestForTrainingStep1";

const AUTOCOMPLETE_MIN_LENGTH = 1;
const AUTOCOMPLETE_DEBOUNCE_MS = 250;

const LETTERS_MAX = 200;
const EMAIL_MAX = 254;

function FieldError({ message }: { message: string }) {
  return (
    <p className="support_service_training_request__error" role="alert">
      {message}
    </p>
  );
}

function FieldShell({
  className = "",
  error,
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
    setStep1Field("streetAddress", suggestion.description);
    onClearError("streetAddress");
    setSuggestions([]);
    setShowSuggestions(false);
    try {
      const address = await fetchPlaceAddress(suggestion.placeId);
      if (address) {
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
                    if (isComposingEvent(event)) {
                      setStep1Field("firstName", event.target.value);
                      return;
                    }
                    setStep1Field("firstName", filterLetters(event.target.value, LETTERS_MAX));
                    onClearError("firstName");
                  }}
                  onCompositionEnd={(event) => {
                    setStep1Field("firstName", filterLetters((event.target as HTMLInputElement).value, LETTERS_MAX));
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
                  onChange={(event) => {
                    if (isComposingEvent(event)) {
                      setStep1Field("lastName", event.target.value);
                      return;
                    }
                    setStep1Field("lastName", filterLetters(event.target.value, LETTERS_MAX));
                  }}
                  onCompositionEnd={(event) =>
                    setStep1Field("lastName", filterLetters((event.target as HTMLInputElement).value, LETTERS_MAX))
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
                  if (isComposingEvent(event)) {
                    setStep1Field("company", event.target.value);
                    return;
                  }
                  setStep1Field("company", filterLetters(event.target.value, LETTERS_MAX));
                  onClearError("company");
                }}
                onCompositionEnd={(event) => {
                  setStep1Field("company", filterLetters((event.target as HTMLInputElement).value, LETTERS_MAX));
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
                    slotProps={{
                      htmlInput: { "aria-label": fields.streetAddress.address2Placeholder },
                    }}
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
                    setStep1Field("zip", filterDigitsOnly(event.target.value));
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
                    if (isComposingEvent(event)) {
                      setStep1Field("email", event.target.value);
                      return;
                    }
                    setStep1Field("email", filterEmail(event.target.value, EMAIL_MAX));
                    onClearError("email");
                  }}
                  onCompositionEnd={(event) => {
                    setStep1Field("email", filterEmail((event.target as HTMLInputElement).value, EMAIL_MAX));
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
                  onChange={(event) => {
                    if (isComposingEvent(event)) {
                      setStep1Field("title", event.target.value);
                      return;
                    }
                    setStep1Field("title", filterLetters(event.target.value, LETTERS_MAX));
                  }}
                  onCompositionEnd={(event) =>
                    setStep1Field("title", filterLetters((event.target as HTMLInputElement).value, LETTERS_MAX))
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
