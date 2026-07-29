"use client";

import { InputAdornment, TextField } from "@mui/material";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { requestForTrainingStep3Copy } from "@/data/services/requestForTrainingContent";
import {
  fetchPlaceAddress,
  fetchPlaceSuggestions,
  type PlaceSuggestion,
} from "@/lib/geo/places";
import { filterEmail, filterLetters } from "@/lib/formInputFilters";
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";
import RequestForTrainingQuestionnaireIntro from "./RequestForTrainingQuestionnaireIntro";
import { useRequestForTrainingForm } from "./RequestForTrainingProvider";
import type { RequestForTrainingStep3Errors } from "./RequestForTrainingStep3";

const AUTOCOMPLETE_MIN_LENGTH = 1;
const AUTOCOMPLETE_DEBOUNCE_MS = 250;

const LOCATION_NAME_MAX = 200;
const CONTACT_PERSON_MAX = 50;
const CONTACT_DETAILS_MAX = 400;

function filterContactPerson(value: string): string {
  return value.slice(0, CONTACT_PERSON_MAX);
}

function FieldShell({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={["support_service_training_request__field", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

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
                      setStep3Field(
                        "locationName",
                        filterLetters(event.target.value, LOCATION_NAME_MAX),
                      );
                      onClearError("locationName");
                    }}
                  />
                </div>

                <div className="support_service_training_request__field support_service_training_request__field--full">
                  <RequestForTrainingFieldLabel htmlFor={`${formId}-street`}>
                    {fields.streetAddress.label}
                  </RequestForTrainingFieldLabel>
                  <div className="support_service_training_request__form-row support_service_training_request__form-row--address">
                    <FieldShell className="support_service_training_request__field--address-search">
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
                    </FieldShell>
                    <FieldShell className="support_service_training_request__field--address-2">
                      <TextField
                        id={`${formId}-address-2`}
                        className="guide_field guide_field--h50 support_service_training_request__input"
                        placeholder={fields.streetAddress.address2Placeholder}
                        value={step3.address2}
                        onChange={(event) => setStep3Field("address2", event.target.value)}
                      />
                    </FieldShell>
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
                        filterEmail(event.target.value, CONTACT_DETAILS_MAX),
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
