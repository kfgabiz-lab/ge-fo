"use client";

import { MenuItem } from "@mui/material";
import { useEffect, useId, useMemo, useState } from "react";
import { fetchCurriculumByCategoryIds } from "@/app/services/training/data/trainingData";
import { fetchTrainingDetailRows } from "@/app/services/training/data/trainingDetailData";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import { requestForTrainingStep4Copy } from "@/data/services/requestForTrainingContent";
import {
  fetchTrainingProductTree,
  type TrainingProductTreeItem,
} from "@/lib/training/trainingProductTree";
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";
import {
  useRequestForTrainingForm,
  type RequestForTrainingSelectedProduct,
} from "./RequestForTrainingProvider";

const CURRICULUM_LIST_SIZE = 50;

type PickerOption = { id: number; title: string };

export function resolveRelatedCategoryIds(
  products: RequestForTrainingSelectedProduct[],
  items: TrainingProductTreeItem[],
): number[] {
  const ids = new Set<number>();
  for (const product of products) {
    if (!Number.isFinite(product.id) || product.id <= 0) continue;
    ids.add(product.id);
    for (const item of items) {
      const matched =
        product.type === "P"
          ? Number(item.lv2Id) === product.id
          : Number(item.productId) === product.id;
      if (!matched) continue;
      const categoryId = Number(item.categoryId);
      if (Number.isFinite(categoryId) && categoryId > 0) ids.add(categoryId);
    }
  }
  return Array.from(ids);
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

export default function RequestForTrainingCurriculumSelector() {
  const formId = useId();
  const { relatedCurriculum } = requestForTrainingStep4Copy.fields;
  const { step4, setStep4Field } = useRequestForTrainingForm();
  const [treeItems, setTreeItems] = useState<TrainingProductTreeItem[]>([]);
  const [curricula, setCurricula] = useState<PickerOption[]>([]);
  const [sessions, setSessions] = useState<PickerOption[]>([]);
  const [curriculaLoaded, setCurriculaLoaded] = useState(false);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchTrainingProductTree()
      .then((tree) => {
        if (alive) setTreeItems(tree.items ?? []);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const categoryIds = useMemo(
    () => resolveRelatedCategoryIds(step4.selectedProducts, treeItems),
    [step4.selectedProducts, treeItems],
  );
  const categoryIdsKey = categoryIds.join(",");

  useEffect(() => {
    let alive = true;
    if (categoryIds.length === 0) {
      setCurricula([]);
      setCurriculaLoaded(true);
      return;
    }
    setCurriculaLoaded(false);
    fetchCurriculumByCategoryIds({
      categoryIds,
      page: 0,
      size: CURRICULUM_LIST_SIZE,
    })
      .then((res) => {
        if (!alive) return;
        setCurricula(
          res.content.map((row) => {
            const curriculum = (row.dataJson ?? {}).curriculum as
              | { title?: string }
              | undefined;
            return { id: Number(row.id), title: curriculum?.title ?? "" };
          }),
        );
      })
      .catch(() => {
        if (alive) setCurricula([]);
      })
      .finally(() => {
        if (alive) setCurriculaLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, [categoryIdsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let alive = true;
    const curriculumId = step4.curriculumId;
    if (curriculumId == null) {
      setSessions([]);
      setSessionsLoaded(true);
      return;
    }
    setSessionsLoaded(false);
    fetchTrainingDetailRows(String(curriculumId))
      .then((rows) => {
        if (!alive) return;
        setSessions(
          rows.map((row) => {
            const detail2 = (row.dataJson ?? {}).curriculum_detail2 as
              | { title?: string }
              | undefined;
            return { id: Number(row.id), title: detail2?.title ?? "" };
          }),
        );
      })
      .catch(() => {
        if (alive) setSessions([]);
      })
      .finally(() => {
        if (alive) setSessionsLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, [step4.curriculumId]);

  useEffect(() => {
    if (!curriculaLoaded || step4.curriculumId == null) return;
    if (curricula.some((option) => option.id === step4.curriculumId)) return;
    setStep4Field("curriculumId", null);
    setStep4Field("sessionId", null);
  }, [curricula, curriculaLoaded, step4.curriculumId, setStep4Field]);

  if (step4.selectedProducts.length === 0) return null;

  const hasCurricula = curricula.length > 0;
  const hasSessions = sessions.length > 0;

  return (
    <div className="support_service_training_request__field">
      <RequestForTrainingFieldLabel
        htmlFor={`${formId}-related-curriculum`}
        required={relatedCurriculum.required}
      >
        {relatedCurriculum.label}
      </RequestForTrainingFieldLabel>

      {!curriculaLoaded ? null : hasCurricula ? (
        <div className="support_service_training_request__form-row support_service_training_request__form-row--selects">
          <GuideSelect
            className="guide_field guide_field--h50 support_service_training_request__select"
            value={step4.curriculumId == null ? "" : String(step4.curriculumId)}
            onChange={(event) => {
              const next = event.target.value as string;
              setStep4Field("curriculumId", next === "" ? null : Number(next));
              setStep4Field("sessionId", null);
            }}
            displayEmpty
            IconComponent={GuideSelectIcon}
            inputProps={{
              "aria-label": "Related curriculum",
              id: `${formId}-related-curriculum`,
            }}
            renderValue={(value) => {
              const current = curricula.find(
                (option) => String(option.id) === value,
              );
              return renderSelectValue(
                current ? current.title : relatedCurriculum.curriculumPlaceholder,
                !current,
              );
            }}
          >
            <MenuItem value="">{relatedCurriculum.nonePlaceholder}</MenuItem>
            {curricula.map((option) => (
              <MenuItem key={option.id} value={String(option.id)}>
                {option.title}
              </MenuItem>
            ))}
          </GuideSelect>

          {step4.curriculumId != null && sessionsLoaded && hasSessions ? (
            <GuideSelect
              className="guide_field guide_field--h50 support_service_training_request__select"
              value={step4.sessionId == null ? "" : String(step4.sessionId)}
              onChange={(event) => {
                const next = event.target.value as string;
                setStep4Field("sessionId", next === "" ? null : Number(next));
              }}
              displayEmpty
              IconComponent={GuideSelectIcon}
              inputProps={{ "aria-label": "Related session" }}
              renderValue={(value) => {
                const current = sessions.find(
                  (option) => String(option.id) === value,
                );
                return renderSelectValue(
                  current ? current.title : relatedCurriculum.sessionPlaceholder,
                  !current,
                );
              }}
            >
              <MenuItem value="">{relatedCurriculum.nonePlaceholder}</MenuItem>
              {sessions.map((option) => (
                <MenuItem key={option.id} value={String(option.id)}>
                  {option.title}
                </MenuItem>
              ))}
            </GuideSelect>
          ) : null}
        </div>
      ) : (
        <p className="support_service_training_request__field-hint">
          {relatedCurriculum.emptyHint}
        </p>
      )}

      {curriculaLoaded &&
      hasCurricula &&
      step4.curriculumId != null &&
      sessionsLoaded &&
      !hasSessions ? (
        <p className="support_service_training_request__field-hint">
          {relatedCurriculum.sessionEmptyHint}
        </p>
      ) : null}
    </div>
  );
}
