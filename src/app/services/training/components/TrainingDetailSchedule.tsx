"use client";

import { FormControl, MenuItem } from "@mui/material";
import { useMemo, useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import { emptyStateIconSrc } from "@/data/commonAssets";
import type { EngineeringTrainingDetail } from "@/data/services/engineeringTrainingDetailContent";
import { toCategoryOptions, type CodeItem } from "../data/trainingData";
import TrainingDetailSession from "./TrainingDetailSession";

const MONTH_OPTIONS = [
  { value: "", label: "All" },
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export default function TrainingDetailSchedule({
  detail,
  trainingTypeCodes,
}: {
  detail: EngineeringTrainingDetail;
  trainingTypeCodes: CodeItem[];
}) {
  const { trainingTypeFilter, monthFilter, sessions } = detail.schedule;

  const typeOptions = useMemo(
    () => toCategoryOptions(trainingTypeCodes),
    [trainingTypeCodes],
  );

  const [typeValue, setTypeValue] = useState("");
  const [monthValue, setMonthValue] = useState("");

  const filteredSessions = useMemo(
    () =>
      sessions.filter((s) => {
        if (typeValue && !(s.typeCodes ?? []).includes(typeValue)) return false;
        if (monthValue) {
          const fromMonth = (s.isoDate ?? "").slice(5, 7);
          const toMonth = (s.isoDateTo ?? "").slice(5, 7);
          const selectedMonth = Number(monthValue);

          if (monthValue < fromMonth || monthValue > toMonth) {
            return false;
          }
          
         }
        return true;
      }),
    [sessions, typeValue, monthValue],
  );

  const typeDisplayLabel = typeValue
    ? (typeOptions.find((o) => o.value === typeValue)?.label ?? trainingTypeFilter.label)
    : trainingTypeFilter.label;
  const monthDisplayLabel = monthValue
    ? (MONTH_OPTIONS.find((o) => o.value === monthValue)?.label ?? monthFilter.label)
    : monthFilter.label;

  return (
    <section
      className="support_service_training_detail_schedule"
      id="engineering-training-detail-schedule"
    >
      <div className="inner">
        <div className="support_service_training_detail_schedule__toolbar">
          <FormControl className="guide_field guide_field--h50 guide_field--w200">
            <GuideSelect
              value={typeValue}
              displayEmpty
              onChange={(event) => setTypeValue(String(event.target.value))}
              IconComponent={GuideSelectIcon}
              inputProps={{ "aria-label": trainingTypeFilter.label }}
              renderValue={() => (
                <span
                  className="guide_field__select-value"
                  title={typeDisplayLabel}
                >
                  {typeDisplayLabel}
                </span>
              )}
            >
              {typeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </GuideSelect>
          </FormControl>

          <FormControl className="guide_field guide_field--h50 guide_field--w200">
            <GuideSelect
              value={monthValue}
              displayEmpty
              onChange={(event) => setMonthValue(String(event.target.value))}
              IconComponent={GuideSelectIcon}
              inputProps={{ "aria-label": monthFilter.label }}
              renderValue={() => (
                <span
                  className="guide_field__select-value"
                  title={monthDisplayLabel}
                >
                  {monthDisplayLabel}
                </span>
              )}
            >
              {MONTH_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </GuideSelect>
          </FormControl>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="support_service_training_detail_schedule__empty">
            <div
              className="support_service_training_detail_schedule__empty-icon"
              aria-hidden="true"
            >
              <img src={emptyStateIconSrc} alt="" />
            </div>
            <div className="support_service_training_detail_schedule__empty-text">
              <p className="support_service_training_detail_schedule__empty-title">
                There are no results
              </p>
              <p className="support_service_training_detail_schedule__empty-desc">
                Try adjusting your filters
              </p>
            </div>
          </div>
        ) : (
          <ul
            className="support_service_training_detail_schedule__list"
            data-slug="currDtlMgmt-data"
            data-slug-repeat="true"
          >
            {filteredSessions.map((session) => (
              <TrainingDetailSession key={session.id} session={session} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
