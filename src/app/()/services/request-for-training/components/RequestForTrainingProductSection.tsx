"use client";

import { FormControl, MenuItem } from "@mui/material";
import { useId, useMemo, useState } from "react";
import GuideSelect from "@/components/form/GuideSelect";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import {
  requestForTrainingStep4CategoryOptions,
  type RequestForTrainingStep4Variant,
} from "@/data/services/requestForTrainingContent";
import RequestForTrainingCheckboxGroup from "./RequestForTrainingCheckboxGroup";
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";

type RequestForTrainingProductSectionProps = {
  label: string;
  required?: boolean;
  hint: string;
  variant: RequestForTrainingStep4Variant;
};

export default function RequestForTrainingProductSection({
  label,
  required = false,
  hint,
  variant,
}: RequestForTrainingProductSectionProps) {
  const formId = useId();
  const [categoryId, setCategoryId] = useState<RequestForTrainingStep4Variant>(variant);
  const category = useMemo(
    () =>
      requestForTrainingStep4CategoryOptions.find((option) => option.id === categoryId) ??
      requestForTrainingStep4CategoryOptions[0],
    [categoryId],
  );
  const [subcategoryId, setSubcategoryId] = useState(category.subcategories[0].id);
  const subcategory = useMemo(() => {
    const resolved =
      category.subcategories.find((option) => option.id === subcategoryId) ??
      category.subcategories[0];
    return resolved;
  }, [category, subcategoryId]);
  const [selected, setSelected] = useState<string[]>([...subcategory.defaultSelected]);

  const handleCategoryChange = (nextCategoryId: RequestForTrainingStep4Variant) => {
    const nextCategory =
      requestForTrainingStep4CategoryOptions.find((option) => option.id === nextCategoryId) ??
      requestForTrainingStep4CategoryOptions[0];
    const nextSubcategory = nextCategory.subcategories[0];

    setCategoryId(nextCategoryId);
    setSubcategoryId(nextSubcategory.id);
    setSelected([...nextSubcategory.defaultSelected]);
  };

  const handleSubcategoryChange = (nextSubcategoryId: string) => {
    const nextSubcategory =
      category.subcategories.find((option) => option.id === nextSubcategoryId) ??
      category.subcategories[0];

    setSubcategoryId(nextSubcategory.id);
    setSelected([...nextSubcategory.defaultSelected]);
  };

  const removeTag = (product: string) => {
    setSelected(selected.filter((value) => value !== product));
  };

  return (
    <div className="support_service_training_request__field support_service_training_request__field--products">
      <RequestForTrainingFieldLabel htmlFor={`${formId}-product-category`} required={required}>
        {label}
      </RequestForTrainingFieldLabel>
      <div className="support_service_training_request__form-row support_service_training_request__form-row--2 support_service_training_request__form-row--selects">
        <FormControl className="guide_field guide_field--h50 support_service_training_request__select">
          <GuideSelect
            value={categoryId}
            onChange={(event) =>
              handleCategoryChange(event.target.value as RequestForTrainingStep4Variant)
            }
            IconComponent={GuideSelectIcon}
            inputProps={{
              "aria-label": "Product category",
              id: `${formId}-product-category`,
            }}
            renderValue={() => (
              <span className="guide_field__select-value" title={category.label}>
                {category.label}
              </span>
            )}
          >
            {requestForTrainingStep4CategoryOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </GuideSelect>
        </FormControl>
        <FormControl className="guide_field guide_field--h50 support_service_training_request__select">
          <GuideSelect
            value={subcategoryId}
            onChange={(event) => handleSubcategoryChange(event.target.value as string)}
            IconComponent={GuideSelectIcon}
            inputProps={{
              "aria-label": "Product subcategory",
              id: `${formId}-product-subcategory`,
            }}
            renderValue={() => (
              <span className="guide_field__select-value" title={subcategory.label}>
                {subcategory.label}
              </span>
            )}
          >
            {category.subcategories.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </GuideSelect>
        </FormControl>
      </div>
      <div className="support_service_training_request__product-panel">
        <RequestForTrainingCheckboxGroup
          legend=""
          options={subcategory.products}
          selected={selected}
          onChange={setSelected}
          hint={hint}
        />
        {selected.length > 0 ? (
          <>
            <hr className="support_service_training_request__product-divider" aria-hidden />
            <div className="support_service_training_request__tags">
              {selected.map((product) => (
                <span key={product} className="support_service_training_request__tag">
                  <span className="support_service_training_request__tag-label">{product}</span>
                  <button
                    type="button"
                    className="support_service_training_request__tag-remove"
                    aria-label={`Remove ${product}`}
                    onClick={() => removeTag(product)}
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
          </>
        ) : null}
      </div>
    </div>
  );
}
