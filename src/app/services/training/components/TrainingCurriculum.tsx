"use client";

import { FormControl, InputAdornment, MenuItem, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
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

// 필터 셀렉트 표시값 렌더러 ("라벨: 선택값")
function renderFilterSelectValue(label: string, optionLabel: string) {
  const text = `${label}: ${optionLabel}`;

  return (
    <span className="guide_field__select-value" title={text}>
      {text}
    </span>
  );
}

// value 로부터 옵션 라벨 조회 (없으면 value 그대로)
function findFilterLabel(
  options: { value: string; label: string }[],
  value: string,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

// 미선택(빈 값) 시 라벨만 노출하는 placeholder 렌더러
function renderFilterPlaceholder(label: string) {
  return (
    <span className="guide_field__select-value" title={label}>
      {label}
    </span>
  );
}

// Training 커리큘럼: 필터 3종 + 검색 + 카드 목록(다건, slug=currMgmt-data) + 페이지네이션.
// - Category 필터(All/Power/Automation)와 검색(title|description)은 currMgmt-data where에 연동해 재조회한다.
// - Lv/Sub Category 옵션은 category-data(depth3 노드)에서 파생. Lv/Sub가 선택되면
//   해당 그룹의 category-data PK 목록(resolveCategoryIds)을 신규 엔드포인트
//   (/training/curriculum-by-category, categoryIds 복수)로 넘겨 목록을 재조회한다.
//   (검색어는 신규 엔드포인트 미지원 — Lv/Sub 선택 중에는 검색이 API에 실리지 않음)
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
  // Category 선택값: "" = 전체(All), 그 외는 product_category 코드값(P/A)
  const [categoryValue, setCategoryValue] = useState(category.defaultValue);
  // Category select 옵션: PRODUCTCATEGORY 코드그룹으로 런타임 구성(맨 앞 UI 전용 "All")
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([{ value: "", label: "All" }]);
  // Lv Category/Sub Category 선택값(미선택="") — 옵션 파생/연쇄 + 선택 시 categoryIds 기반 목록 재조회
  const [lvCategoryValue, setLvCategoryValue] = useState(lvCategory.defaultValue);
  const [subCategoryValue, setSubCategoryValue] = useState(
    subCategory.defaultValue,
  );
  // Lv/Sub 옵션 파생 원천: category-data(depth3 노드) 최초 1회 조회 결과
  const [categoryNodes, setCategoryNodes] = useState<TrainingCategoryNode[]>([]);
  // 검색 입력값(query)과 실제 적용된 검색어(searchTerm) 분리 — 버튼 클릭/Enter 시에만 적용해 재조회
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const hasQuery = query.length > 0;

  // 코드→라벨(PRODUCTCATEGORY) 맵
  const [categoryMap, setCategoryMap] = useState<Map<string, string>>(new Map());
  // 현재 페이지(0-based, API)
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  // 현재 페이지 목록 원본
  const [rows, setRows] = useState<TrainingRow[]>([]);

  // 카테고리 코드그룹(PRODUCTCATEGORY) 최초 1회 조회 → 카드 라벨 맵 + Category select 옵션 동시 구성
  useEffect(() => {
    let alive = true;
    fetchTrainingCategories()
      .then((codes) => {
        if (!alive) return;
        setCategoryMap(toCategoryMap(codes ?? []));
        setCategoryOptions(toCategoryOptions(codes ?? []));
      })
      .catch(() => {
        // 실패 시 코드값 그대로 노출(라벨 변환 생략), 옵션은 초기 "All"만 유지
      });
    return () => {
      alive = false;
    };
  }, []);

  // Lv/Sub Category 파생용 카테고리 노드(depth3) 최초 1회 조회
  useEffect(() => {
    let alive = true;
    fetchTrainingCategoryNodes()
      .then((nodes) => {
        if (alive) setCategoryNodes(nodes);
      })
      .catch(() => {
        // 실패 시 Lv/Sub 옵션은 빈 목록 유지
      });
    return () => {
      alive = false;
    };
  }, []);

  // Category(P/A) → Lv Category 옵션 파생. All("")이면 빈 목록.
  const lvCategoryOptions = useMemo(
    () => toLvCategoryOptions(categoryNodes, categoryValue),
    [categoryNodes, categoryValue],
  );
  // Category + Lv 선택값 → Sub Category 옵션 파생. All("")이면 빈 목록.
  const subCategoryOptions = useMemo(
    () => toSubCategoryOptions(categoryNodes, categoryValue, lvCategoryValue),
    [categoryNodes, categoryValue, lvCategoryValue],
  );
  // 비활성 조건: Lv은 Category 미선택 시, Sub은 Category 또는 Lv 미선택 시
  const lvDisabled = categoryValue === "";
  const subDisabled = categoryValue === "" || lvCategoryValue === "";

  // 목록 조회: variant/카테고리/Lv·Sub/검색/페이지 변경 시
  useEffect(() => {
    let alive = true;

    // Lv/Sub Category가 선택돼 있으면 → categoryIds(복수 PK) 기반 신규 엔드포인트로 조회
    if (lvCategoryValue !== "" || subCategoryValue !== "") {
      const ids = resolveCategoryIds(
        categoryNodes,
        categoryValue,
        lvCategoryValue,
        subCategoryValue,
      );
      // 방어적: 매칭 id 없으면(이론상 없어야 함) 빈 목록 처리, 불필요한 호출 회피
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

    // Lv/Sub 미선택 → 기존 currMgmt-data where 기반 조회
    // categoryValue = product_category 코드값(P/A) 직접 사용. "" = 전체 → 조건 미포함
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
      // 최신 등록순(설계 4절 orderBy created_at desc → API 파라미터 표기 createdAt,desc)
      sort: "createdAt,desc",
      // identity 리턴 → raw TrainingRow[] 그대로 받아 categoryMap 비동기 로드 반응성 보존(toTrainingCard useMemo가 처리)
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

  // 카드(다건)
  const listItems = useMemo(
    () => rows.map((row) => toTrainingCard(row, categoryMap)),
    [rows, categoryMap],
  );

  // 카테고리 변경 시 첫 페이지로 이동 후 재조회 + Lv/Sub 선택값 리셋(default로)
  const handleCategoryChange = (value: string) => {
    setCategoryValue(value);
    setLvCategoryValue(lvCategory.defaultValue);
    setSubCategoryValue(subCategory.defaultValue);
    setPageIndex(0);
  };

  // Lv Category 변경 시 Sub Category 선택값 리셋(Sub은 이때부터 활성화됨) + 첫 페이지로
  const handleLvCategoryChange = (value: string) => {
    setLvCategoryValue(value);
    setSubCategoryValue(subCategory.defaultValue);
    setPageIndex(0);
  };

  // Sub Category 변경 시 첫 페이지로 이동 후 재조회
  const handleSubCategoryChange = (value: string) => {
    setSubCategoryValue(value);
    setPageIndex(0);
  };

  // 검색 적용(버튼 클릭/Enter) — 첫 페이지로 이동 후 재조회
  const applySearch = () => {
    setSearchTerm(query.trim());
    setPageIndex(0);
  };

  // PageNumbering(1-based) → API(0-based)
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

        {/* data-slug: Training 커리큘럼 카드 다건 리스트 (slug=currMgmt-data, 반복 렌더링) */}
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
