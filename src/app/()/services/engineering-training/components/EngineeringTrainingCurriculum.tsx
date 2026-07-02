"use client";

import { FormControl, InputAdornment, MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import PageNumbering from "@/components/pagination/PageNumbering";
import { engineeringTrainingPage } from "@/data/services/engineeringTrainingContent";
import EngineeringTrainingCard from "./EngineeringTrainingCard";

function renderFilterSelectValue(label: string, optionLabel: string) {
  const text = `${label}: ${optionLabel}`;

  return (
    <span className="guide_field__select-value" title={text}>
      {text}
    </span>
  );
}

function findFilterLabel(
  options: { value: string; label: string }[],
  value: string,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export default function EngineeringTrainingCurriculum() {
  const { curriculum } = engineeringTrainingPage;
  const { category, lvCategory, subCategory } = curriculum.filters;
  const [categoryValue, setCategoryValue] = useState(category.defaultValue);
  const [lvCategoryValue, setLvCategoryValue] = useState(lvCategory.defaultValue);
  const [subCategoryValue, setSubCategoryValue] = useState(
    subCategory.defaultValue,
  );
  const [query, setQuery] = useState("");
  const hasQuery = query.length > 0;

  return (
    <section
      className="support_service_training_curriculum"
      id="engineering-training-curriculum"
    >
      <div className="inner">
        <h2 className="section_tit">{curriculum.title}</h2>

        <div className="support_service_training_curriculum__filters">
          <FormControl className="guide_field guide_field--h50 guide_field--w200">
            <GuideSelect
              value={categoryValue}
              onChange={(event) =>
                setCategoryValue(String(event.target.value))
              }
              IconComponent={GuideSelectIcon}
              inputProps={{ "aria-label": category.label }}
              renderValue={(value) =>
                renderFilterSelectValue(
                  category.label,
                  findFilterLabel(category.options, String(value)),
                )
              }
            >
              {category.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </GuideSelect>
          </FormControl>

          <FormControl className="guide_field guide_field--h50 guide_field--w200 guide_field--fill-muted">
            <GuideSelect
              value={lvCategoryValue}
              onChange={(event) =>
                setLvCategoryValue(String(event.target.value))
              }
              IconComponent={GuideSelectIcon}
              inputProps={{ "aria-label": lvCategory.label }}
              renderValue={(value) =>
                renderFilterSelectValue(
                  lvCategory.label,
                  findFilterLabel(lvCategory.options, String(value)),
                )
              }
            >
              {lvCategory.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </GuideSelect>
          </FormControl>

          <FormControl className="guide_field guide_field--h50 guide_field--w200 guide_field--fill-muted">
            <GuideSelect
              value={subCategoryValue}
              onChange={(event) =>
                setSubCategoryValue(String(event.target.value))
              }
              IconComponent={GuideSelectIcon}
              inputProps={{ "aria-label": subCategory.label }}
              renderValue={(value) =>
                renderFilterSelectValue(
                  subCategory.label,
                  findFilterLabel(subCategory.options, String(value)),
                )
              }
            >
              {subCategory.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </GuideSelect>
          </FormControl>

          <TextField
            className={`guide_field guide_field--search support_service_training_curriculum__search${
              hasQuery ? " support_service_training_curriculum__search--filled" : ""
            }`}
            placeholder={curriculum.filters.searchPlaceholder}
            aria-label={curriculum.filters.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
                      aria-label="Search courses"
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
        </div>

        <ul className="support_service_training_curriculum__list">
          {curriculum.courses.map((course) => (
            <li
              key={course.id}
              className="support_service_training_curriculum__item"
            >
              <EngineeringTrainingCard course={course} />
            </li>
          ))}
        </ul>

        <PageNumbering
          className="support_service_training_curriculum__pagination"
          currentPage={1}
          totalPages={curriculum.totalPages}
          ariaLabel="Training curriculum pages"
        />
      </div>
    </section>
  );
}
