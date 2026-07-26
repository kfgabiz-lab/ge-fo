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
// 리프 카테고리(id)마다 음수 id를 부여해 실제 제품 id와 충돌 없이 선택 상태를 관리한다.
const OTHER_LABEL = "Other";
function otherId(leafCategoryId: number): number {
  return -leafCategoryId;
}

export default function RequestForTrainingProductSelector() {
  const formId = useId();
  const { fields } = requestForTrainingStep4Copy;
  const { step4, setStep4Field } = useRequestForTrainingForm();
  const [tree, setTree] = useState<TrainingProductTree>({ power: [], automation: [] });
  // 기획서 규칙: default 미선택 — 카테고리를 직접 고르기 전까지 하위 드롭다운/체크박스는 나타나지 않는다.
  const [categoryType, setCategoryType] = useState<TrainingCategoryType | "">("");
  const [path, setPath] = useState<TrainingProductNode[]>([]);

  useEffect(() => {
    let alive = true;
    fetchTrainingProductTree().then((result) => {
      if (alive) setTree(result);
    });
    return () => {
      alive = false;
    };
  }, []);

  const rootNodes = categoryType ? tree[categoryType] : [];

  const selectedIds = useMemo(
    () => new Set(step4.selectedProducts.map((p) => p.id)),
    [step4.selectedProducts],
  );

  function handleCategoryTypeChange(nextType: TrainingCategoryType) {
    setCategoryType(nextType);
    setPath([]);
  }

  // depth번째 드롭다운에서 nextNode를 고르면, 그보다 하위(depth+1 이후) 선택은 다시 미선택 상태로 돌아간다.
  function handleLevelChange(depth: number, nextNode: TrainingProductNode) {
    setPath([...path.slice(0, depth), nextNode]);
  }

  function toggleProduct(id: number, name: string) {
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
    };
    setStep4Field("selectedProducts", [...step4.selectedProducts, next]);
  }

  function removeTag(id: number) {
    setStep4Field(
      "selectedProducts",
      step4.selectedProducts.filter((p) => p.id !== id),
    );
  }

  // 카테고리를 고를 때마다 그 하위 단계까지만 드롭다운을 하나씩 노출한다(있는 데이터만큼만).
  const dropdownLevels: { key: string; options: TrainingProductNode[]; value: string }[] = [];
  let levelNodes = rootNodes;
  for (let depth = 0; depth < path.length + 1; depth += 1) {
    if (levelNodes.length === 0) break;
    const selectedNode = path[depth];
    dropdownLevels.push({
      key: `level-${depth}`,
      options: levelNodes,
      value: selectedNode ? String(selectedNode.id) : "",
    });
    if (!selectedNode || !selectedNode.children) break;
    levelNodes = selectedNode.children;
  }

  const leaf = path.length > 0 && !path[path.length - 1].children ? path[path.length - 1] : undefined;
  const products = leaf?.products ?? [];

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

        {dropdownLevels.map((level, depth) => (
          <GuideSelect
            key={level.key}
            className="guide_field guide_field--h50 support_service_training_request__select"
            value={level.value}
            onChange={(event) => {
              const nextNode = level.options.find(
                (o) => String(o.id) === event.target.value,
              );
              if (nextNode) handleLevelChange(depth, nextNode);
            }}
            displayEmpty
            IconComponent={GuideSelectIcon}
            inputProps={{ "aria-label": `Product subcategory ${depth + 1}` }}
            renderValue={(value) => {
              const current = level.options.find((o) => String(o.id) === value);
              return renderSelectValue(current ? current.title : CATEGORY_PLACEHOLDER, !current);
            }}
          >
            <MenuItem value="" disabled>
              {CATEGORY_PLACEHOLDER}
            </MenuItem>
            {level.options.map((option) => (
              <MenuItem key={option.id} value={String(option.id)}>
                {option.title}
              </MenuItem>
            ))}
          </GuideSelect>
        ))}
      </div>

      {leaf ? (
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
                      onChange={() => toggleProduct(product.id, product.name)}
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
                  checked={selectedIds.has(otherId(leaf.id))}
                  onChange={() => toggleProduct(otherId(leaf.id), OTHER_LABEL)}
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
