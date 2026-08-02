"use client";

import { Checkbox, MenuItem } from "@mui/material";
import { useEffect, useId, useMemo, useState } from "react";
import {
  fetchTrainingCategories,
  type CodeItem,
} from "@/app/services/training/data/trainingData";
import {
  GuideCheckboxIcon,
  GuideSelectIcon,
  guideCheckboxIconsContactConsent,
} from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import { requestForTrainingStep4Copy } from "@/data/services/requestForTrainingContent";
import {
  fetchTrainingProductTree,
  type TrainingProductNode,
  type TrainingProductTree,
} from "@/lib/training/trainingProductTree";
import RequestForTrainingFieldError from "./RequestForTrainingFieldError";
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";
import {
  useRequestForTrainingForm,
  type RequestForTrainingCategoryType,
  type RequestForTrainingSelectedProduct,
} from "./RequestForTrainingProvider";

type TrainingCategoryType = RequestForTrainingCategoryType;

type CategoryTypeOption = { id: TrainingCategoryType; label: string };

const CATEGORY_PLACEHOLDER = "Category";

function toCategoryTypeOptions(codes: CodeItem[]): CategoryTypeOption[] {
  return (codes ?? [])
    .map((code) => ({
      id: code.name.toLowerCase() as TrainingCategoryType,
      label: code.name,
    }))
    .filter((option) => option.id === "power" || option.id === "automation");
}

function renderSelectValue(label: string, isPlaceholder: boolean) {
  return (
    <span
      className={
        isPlaceholder
          ? "guide_field__select-value guide_field__select-value--default"
          : "guide_field__select-value"
      }
      title={label}
    >
      {label}
    </span>
  );
}

const OTHER_LABEL = "Other";
function otherId(groupId: number): number {
  return -groupId;
}

export default function RequestForTrainingProductSelector({
  error = false,
  onClearError,
}: {
  error?: boolean;
  onClearError?: () => void;
} = {}) {
  const formId = useId();
  const { fields } = requestForTrainingStep4Copy;
  const { step1, step4, setStep4Field } = useRequestForTrainingForm();
  const [tree, setTree] = useState<TrainingProductTree>({
    power: [],
    automation: [],
    items: [],
  });
  const [categoryTypeOptions, setCategoryTypeOptions] = useState<CategoryTypeOption[]>([]);
  const categoryType = step4.productCategoryType;
  const groupId = step4.productGroupId;
  const isEngineeringTrack = step1.trainingTrack === "engineering";

  useEffect(() => {
    let alive = true;
    fetchTrainingProductTree(true).then((result) => {
      if (alive) setTree(result);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    fetchTrainingCategories()
      .then((codes) => {
        if (alive) setCategoryTypeOptions(toCategoryTypeOptions(codes ?? []));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!isEngineeringTrack && categoryType !== "power") {
      setStep4Field("productCategoryType", "power");
      setStep4Field("productGroupId", "");
    }
  }, [isEngineeringTrack, categoryType, setStep4Field]);

  const groups: TrainingProductNode[] = categoryType ? tree[categoryType] : [];

  const selectedIds = useMemo(
    () => new Set(step4.selectedProducts.map((p) => p.id)),
    [step4.selectedProducts],
  );

  function handleCategoryTypeChange(nextType: TrainingCategoryType) {
    setStep4Field("productCategoryType", nextType);
    setStep4Field("productGroupId", "");
  }

  function toggleProduct(id: number, name: string, groupId: number, groupTitle: string) {
    if (selectedIds.has(id)) {
      setStep4Field(
        "selectedProducts",
        step4.selectedProducts.filter((p) => p.id !== id),
      );
      return;
    }
    const next: RequestForTrainingSelectedProduct = {
      id,
      name,
      type: categoryType === "power" ? "P" : "A",
      groupId,
      groupTitle,
    };
    setStep4Field("selectedProducts", [...step4.selectedProducts, next]);
    onClearError?.();
  }

  function removeTag(id: number) {
    setStep4Field(
      "selectedProducts",
      step4.selectedProducts.filter((p) => p.id !== id),
    );
  }

  const selectedGroup = groups.find((group) => String(group.id) === groupId);
  const products = selectedGroup?.products ?? [];

  return (
    <div
      className={[
        "support_service_training_request__field",
        "support_service_training_request__field--products",
        error ? "support_service_training_request__field--error" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <RequestForTrainingFieldLabel
        htmlFor={`${formId}-product-category`}
        required={fields.products.required}
      >
        {fields.products.label}
      </RequestForTrainingFieldLabel>

      <div className="support_service_training_request__form-row support_service_training_request__form-row--selects">
        <GuideSelect
          className="guide_field guide_field--h50 support_service_training_request__select"
          value={categoryType}
          onChange={(event) =>
            handleCategoryTypeChange(event.target.value as TrainingCategoryType)
          }
          disabled={!isEngineeringTrack}
          displayEmpty
          IconComponent={GuideSelectIcon}
          inputProps={{ "aria-label": "Product category", id: `${formId}-product-category` }}
          renderValue={(value) => {
            const current = categoryTypeOptions.find((o) => o.id === value);
            return renderSelectValue(current ? current.label : CATEGORY_PLACEHOLDER, !current);
          }}
        >
          <MenuItem value="" disabled>
            {CATEGORY_PLACEHOLDER}
          </MenuItem>
          {categoryTypeOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </GuideSelect>

        {categoryType ? (
          <GuideSelect
            className="guide_field guide_field--h50 support_service_training_request__select"
            value={groupId}
            onChange={(event) =>
              setStep4Field("productGroupId", event.target.value as string)
            }
            displayEmpty
            IconComponent={GuideSelectIcon}
            inputProps={{ "aria-label": "Product subcategory" }}
            renderValue={(value) => {
              const current = groups.find((group) => String(group.id) === value);
              return renderSelectValue(current ? current.title : CATEGORY_PLACEHOLDER, !current);
            }}
          >
            <MenuItem value="" disabled>
              {CATEGORY_PLACEHOLDER}
            </MenuItem>
            {groups.map((group) => (
              <MenuItem key={group.id} value={String(group.id)}>
                {group.title}
              </MenuItem>
            ))}
          </GuideSelect>
        ) : null}
      </div>

      {selectedGroup ? (
        <div className="support_service_training_request__product-panel">
          <fieldset
            className="support_service_training_request__checkbox-group support_service_training_request__checkbox-group--no-legend"
            aria-label="Product options"
          >
            <div className="support_service_training_request__checkboxes">
              {products.map((product) => {
                const checked = selectedIds.has(product.id);
                const inputId = `${formId}-product-${product.id}`;
                return (
                  <label
                    key={product.id}
                    className="support_service_training_request__checkbox-label"
                    htmlFor={inputId}
                  >
                    <Checkbox
                      id={inputId}
                      className="guide_checkbox support_service_training_request__checkbox"
                      disableRipple
                      checked={checked}
                      onChange={() =>
                        toggleProduct(
                          product.id,
                          product.name,
                          selectedGroup.id,
                          selectedGroup.title,
                        )
                      }
                      icon={<GuideCheckboxIcon {...guideCheckboxIconsContactConsent} />}
                      checkedIcon={
                        <GuideCheckboxIcon checked {...guideCheckboxIconsContactConsent} />
                      }
                    />
                    <span>{product.name}</span>
                  </label>
                );
              })}
              <label
                className="support_service_training_request__checkbox-label"
                htmlFor={`${formId}-product-other`}
              >
                <Checkbox
                  id={`${formId}-product-other`}
                  className="guide_checkbox support_service_training_request__checkbox"
                  disableRipple
                  checked={selectedIds.has(otherId(selectedGroup.id))}
                  onChange={() =>
                    toggleProduct(
                      otherId(selectedGroup.id),
                      OTHER_LABEL,
                      selectedGroup.id,
                      selectedGroup.title,
                    )
                  }
                  icon={<GuideCheckboxIcon {...guideCheckboxIconsContactConsent} />}
                  checkedIcon={<GuideCheckboxIcon checked {...guideCheckboxIconsContactConsent} />}
                />
                <span>{OTHER_LABEL}</span>
              </label>
            </div>
            {fields.products.hint ? (
              <p className="support_service_training_request__field-hint">
                {fields.products.hint}
              </p>
            ) : null}
          </fieldset>
        </div>
      ) : null}

      {step4.selectedProducts.length > 0 ? (
        <div className="support_service_training_request__product-panel">
          <hr className="support_service_training_request__product-divider" aria-hidden />
          <div className="support_service_training_request__tags">
            {step4.selectedProducts.map((product) => (
              <span key={product.id} className="support_service_training_request__tag">
                <span className="support_service_training_request__tag-label">
                  {product.name}
                </span>
                <button
                  type="button"
                  className="support_service_training_request__tag-remove"
                  aria-label={`Remove ${product.name}`}
                  onClick={() => removeTag(product.id)}
                >
                  <img
                    src="/ico/ico_clear_12.svg"
                    alt=""
                    width={12}
                    height={12}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {error ? (
        <RequestForTrainingFieldError message="Please select at least one product." />
      ) : null}
    </div>
  );
}
