"use client";

import { Checkbox, MenuItem } from "@mui/material";
import { useEffect, useId, useMemo, useState } from "react";
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
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";
import {
  useRequestForTrainingForm,
  type RequestForTrainingSelectedProduct,
} from "./RequestForTrainingProvider";

type TrainingCategoryType = "power" | "automation";

const CATEGORY_TYPE_OPTIONS: { id: TrainingCategoryType; label: string }[] = [
  { id: "power", label: "Power" },
  { id: "automation", label: "Automation" },
];

const CATEGORY_PLACEHOLDER = "Category";

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

// "Other"는 실제 제품이 아니라 기획서(traning_req4dc.png)상 "제품과 상관없이 고정값으로 노출"되는 항목이라
// 그룹(id)마다 음수 id를 부여해 실제 제품 id와 충돌 없이 선택 상태를 관리한다.
const OTHER_LABEL = "Other";
function otherId(groupId: number): number {
  return -groupId;
}

export default function RequestForTrainingProductSelector() {
  const formId = useId();
  const { fields } = requestForTrainingStep4Copy;
  const { step4, setStep4Field } = useRequestForTrainingForm();
  const [tree, setTree] = useState<TrainingProductTree>({ power: [], automation: [] });
  // 기획서 규칙: default 미선택 — 카테고리를 직접 고르기 전까지 하위 드롭다운/체크박스는 나타나지 않는다.
  const [categoryType, setCategoryType] = useState<TrainingCategoryType | "">("");
  // 두 번째 드롭다운에서 고른 그룹 id(문자열). 미선택이면 빈 문자열.
  const [groupId, setGroupId] = useState<string>("");

  useEffect(() => {
    let alive = true;
    fetchTrainingProductTree().then((result) => {
      if (alive) setTree(result);
    });
    return () => {
      alive = false;
    };
  }, []);

  // 첫 번째 드롭다운(Power/Automation)에 대응하는 그룹 목록 — 계층 없이 평평한 배열이다.
  const groups: TrainingProductNode[] = categoryType ? tree[categoryType] : [];

  const selectedIds = useMemo(
    () => new Set(step4.selectedProducts.map((p) => p.id)),
    [step4.selectedProducts],
  );

  function handleCategoryTypeChange(nextType: TrainingCategoryType) {
    setCategoryType(nextType);
    // 카테고리를 바꾸면 두 번째 드롭다운은 다시 미선택 상태로 돌아간다.
    setGroupId("");
  }

  // groupId/groupTitle 은 두 번째 드롭다운에서 고른 그룹 정보 — VFD 조건부 질문 노출 판별에 쓰인다.
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
  }

  function removeTag(id: number) {
    setStep4Field(
      "selectedProducts",
      step4.selectedProducts.filter((p) => p.id !== id),
    );
  }

  // 두 번째 드롭다운에서 고른 그룹. 고르기 전에는 undefined라 체크박스 영역이 노출되지 않는다.
  const selectedGroup = groups.find((group) => String(group.id) === groupId);
  const products = selectedGroup?.products ?? [];

  return (
    <div className="support_service_training_request__field support_service_training_request__field--products">
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
          displayEmpty
          IconComponent={GuideSelectIcon}
          inputProps={{ "aria-label": "Product category", id: `${formId}-product-category` }}
          renderValue={(value) => {
            const current = CATEGORY_TYPE_OPTIONS.find((o) => o.id === value);
            return renderSelectValue(current ? current.label : CATEGORY_PLACEHOLDER, !current);
          }}
        >
          <MenuItem value="" disabled>
            {CATEGORY_PLACEHOLDER}
          </MenuItem>
          {CATEGORY_TYPE_OPTIONS.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </GuideSelect>

        {categoryType ? (
          <GuideSelect
            className="guide_field guide_field--h50 support_service_training_request__select"
            value={groupId}
            onChange={(event) => setGroupId(event.target.value as string)}
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
    </div>
  );
}
