"use client";

import { FormControl, InputAdornment, MenuItem, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import { guideSearchFieldMobileSlotProps } from "@/components/form/guideFieldMobileProps";
import PageNumbering from "@/components/pagination/PageNumbering";
import { fetchData } from "@/lib/pageDataApi";
import type {
  TrainingCurriculumData,
  TrainingVariant,
} from "../data/trainingContent";
import {
  TRAINING_LIST_SIZE,
  TRAINING_SLUG,
  fetchTrainingByCategoryIds,
  fetchTrainingCategories,
  fetchTrainingCategoryNodes,
  resolveCategoryIds,
  toCategoryMap,
  toCategoryOptions,
  toLvCategoryOptions,
  toSubCategoryOptions,
  toTrainingCard,
  trainingDetailHref,
  trainingStatusWhere,
  type TrainingCategoryNode,
  type TrainingRow,
} from "../data/trainingData";
import TrainingCard from "./TrainingCard";

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

function renderFilterPlaceholder(label: string) {
  return (
    <span className="guide_field__select-value" title={label}>
      {label}
    </span>
  );
}

export default function TrainingCurriculum({
  curriculum,
  variant,
  sectionId,
  ariaLabel,
  detailHrefPrefix,
}: {
  curriculum: TrainingCurriculumData;
  variant: TrainingVariant;
  sectionId: string;
  ariaLabel: string;
  detailHrefPrefix: string;
}) {
  const { category, lvCategory, subCategory } = curriculum.filters;
  const [categoryValue, setCategoryValue] = useState(category.defaultValue);
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([{ value: "", label: "All" }]);
  const [lvCategoryValue, setLvCategoryValue] = useState(lvCategory.defaultValue);
  const [subCategoryValue, setSubCategoryValue] = useState(
    subCategory.defaultValue,
  );
  const [categoryNodes, setCategoryNodes] = useState<TrainingCategoryNode[]>([]);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const hasQuery = query.length > 0;

  const [categoryMap, setCategoryMap] = useState<Map<string, string>>(new Map());
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rows, setRows] = useState<TrainingRow[]>([]);

  useEffect(() => {
    let alive = true;
    fetchTrainingCategories()
      .then((codes) => {
        if (!alive) return;
        setCategoryMap(toCategoryMap(codes ?? []));
        setCategoryOptions(toCategoryOptions(codes ?? []));
      })
      .catch(() => {
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    fetchTrainingCategoryNodes()
      .then((nodes) => {
        if (alive) setCategoryNodes(nodes);
      })
      .catch(() => {
      });
    return () => {
      alive = false;
    };
  }, []);

  const lvCategoryOptions = useMemo(
    () => toLvCategoryOptions(categoryNodes, categoryValue),
    [categoryNodes, categoryValue],
  );
  const subCategoryOptions = useMemo(
    () => toSubCategoryOptions(categoryNodes, categoryValue, lvCategoryValue),
    [categoryNodes, categoryValue, lvCategoryValue],
  );
  const lvDisabled = categoryValue === "";
  const subDisabled = categoryValue === "" || lvCategoryValue === "";

  useEffect(() => {
    let alive = true;

    if (lvCategoryValue !== "" || subCategoryValue !== "") {
      const ids = resolveCategoryIds(
        categoryNodes,
        categoryValue,
        lvCategoryValue,
        subCategoryValue,
      );
      if (ids.length === 0) {
        setRows([]);
        setTotalPages(1);
        return () => {
          alive = false;
        };
      }
      fetchTrainingByCategoryIds({
        categoryIds: ids,
        variant,
        page: pageIndex,
        size: TRAINING_LIST_SIZE,
      })
        .then((res) => {
          if (!alive) return;
          setRows(res.content);
          setTotalPages(res.totalPages || 1);
        })
        .catch(() => {
          if (alive) setRows([]);
        });
      return () => {
        alive = false;
      };
    }

    fetchData<TrainingRow>({
      slug: TRAINING_SLUG,
      page: pageIndex,
      size: TRAINING_LIST_SIZE,
      where: {
        ...trainingStatusWhere(variant),
        ...(categoryValue
          ? { "eq_curriculum.product_category": categoryValue }
          : {}),
        ...(searchTerm ? { "title|description": searchTerm } : {}),
      },
      sort: "createdAt,desc",
      리턴함수: (items) => items,
    })
      .then((res) => {
        if (!alive) return;
        setRows(res.content);
        setTotalPages(res.totalPages || 1);
      })
      .catch(() => {
        if (alive) setRows([]);
      });
    return () => {
      alive = false;
    };
  }, [
    variant,
    categoryValue,
    lvCategoryValue,
    subCategoryValue,
    searchTerm,
    pageIndex,
    categoryNodes,
  ]);

  const listItems = useMemo(
    () => rows.map((row) => toTrainingCard(row, categoryMap)),
    [rows, categoryMap],
  );

  const handleCategoryChange = (value: string) => {
    setCategoryValue(value);
    setLvCategoryValue(lvCategory.defaultValue);
    setSubCategoryValue(subCategory.defaultValue);
    setPageIndex(0);
  };

  const handleLvCategoryChange = (value: string) => {
    setLvCategoryValue(value);
    setSubCategoryValue(subCategory.defaultValue);
    setPageIndex(0);
  };

  const handleSubCategoryChange = (value: string) => {
    setSubCategoryValue(value);
    setPageIndex(0);
  };

  const applySearch = () => {
    setSearchTerm(query.trim());
    setPageIndex(0);
  };

  const handlePageChange = (page: number) => {
    setPageIndex(Math.max(0, page - 1));
  };

  return (
    <section className="support_service_training_curriculum" id={sectionId}>
      <div className="inner">
        <div className="support_service_training_curriculum__filters">
          <FormControl className="guide_field guide_field--h50 guide_field--w200">
            <GuideSelect
              value={categoryValue}
              displayEmpty
              onChange={(event) =>
                handleCategoryChange(String(event.target.value))
              }
              IconComponent={GuideSelectIcon}
              inputProps={{ "aria-label": category.label }}
              renderValue={(value) =>
                renderFilterSelectValue(
                  category.label,
                  findFilterLabel(categoryOptions, String(value)),
                )
              }
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </GuideSelect>
          </FormControl>

          <FormControl className="guide_field guide_field--h50 guide_field--w200 guide_field--fill-muted">
            <GuideSelect
              value={lvCategoryValue}
              displayEmpty
              disabled={lvDisabled}
              onChange={(event) =>
                handleLvCategoryChange(String(event.target.value))
              }
              IconComponent={GuideSelectIcon}
              inputProps={{ "aria-label": lvCategory.label }}
              renderValue={(value) =>
                String(value)
                  ? renderFilterSelectValue(
                      lvCategory.label,
                      findFilterLabel(lvCategoryOptions, String(value)),
                    )
                  : renderFilterPlaceholder(lvCategory.label)
              }
            >
              {lvCategoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </GuideSelect>
          </FormControl>

          <FormControl className="guide_field guide_field--h50 guide_field--w200 guide_field--fill-muted">
            <GuideSelect
              value={subCategoryValue}
              displayEmpty
              disabled={subDisabled}
              onChange={(event) =>
                handleSubCategoryChange(String(event.target.value))
              }
              IconComponent={GuideSelectIcon}
              inputProps={{ "aria-label": subCategory.label }}
              renderValue={(value) =>
                String(value)
                  ? renderFilterSelectValue(
                      subCategory.label,
                      findFilterLabel(subCategoryOptions, String(value)),
                    )
                  : renderFilterPlaceholder(subCategory.label)
              }
            >
              {subCategoryOptions.map((option) => (
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
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applySearch();
              }
            }}
            slotProps={{
              ...guideSearchFieldMobileSlotProps,
              input: {
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className="guide_field__search-adorn"
                  >
                    {hasQuery ? (
                      <button
                        type="button"
                        className="guide_field__search-clear"
                        aria-label="Clear search"
                        onClick={() => {
                          setQuery("");
                          setSearchTerm("");
                          setPageIndex(0);
                        }}
                      >
                        <span className="guide_field__search-clear-icon" aria-hidden>
                          <img
                            src="/ico/ico_clear_12_black.svg"
                            alt=""
                            width={10}
                            height={10}
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="guide_field__search-icon-button"
                      aria-label="Search courses"
                      onClick={applySearch}
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

        <ul
          className="support_service_training_curriculum__list"
          data-slug="currMgmt-data"
          data-slug-repeat="true"
        >
          {listItems.map((item) => (
            <li
              key={item.id}
              className="support_service_training_curriculum__item"
              data-slug-item
            >
              <TrainingCard
                course={item}
                detailHref={trainingDetailHref(detailHrefPrefix, item.id)}
              />
            </li>
          ))}
        </ul>

        <PageNumbering
          className="support_service_training_curriculum__pagination"
          currentPage={pageIndex + 1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          ariaLabel={ariaLabel}
        />
      </div>
    </section>
  );
}
