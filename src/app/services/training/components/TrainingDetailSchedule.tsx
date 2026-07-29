"use client";

import { FormControl, MenuItem } from "@mui/material";
import { useMemo, useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import type {
  EngineeringTrainingDetail,
  EngineeringTrainingSession,
} from "@/data/services/engineeringTrainingDetailContent";
import TrainingDetailSession from "./TrainingDetailSession";

const TYPE_OPTIONS = [
  { value: "", label: "All" },
  { value: "001", label: "In-Person" },
  { value: "002", label: "Virtual" },
];

const MONTH_OPTIONS = [
  { value: "", label: "All" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
];

export default function TrainingDetailSchedule({
  detail,
  hrefPrefix,
}: {
  detail: EngineeringTrainingDetail;
  hrefPrefix: string;
}) {
  const { trainingTypeFilter, monthFilter, sessions } = detail.schedule;

  const [typeValue, setTypeValue] = useState("");
  const [monthValue, setMonthValue] = useState("");

  const filteredSessions = useMemo(
    () =>
      sessions.filter((s) => {
        if (typeValue && !(s.typeCodes ?? []).includes(typeValue)) return false;
        if (monthValue && (s.isoDate ?? "").slice(5, 7) !== monthValue) {
          return false;
        }
        return true;
      }),
    [sessions, typeValue, monthValue],
  );

  const groupedSessions = useMemo(() => {
    const groups: { date: string; sessions: EngineeringTrainingSession[] }[] =
      [];
    const indexByDate = new Map<string, number>();
    for (const session of filteredSessions) {
      const key = session.date ?? "";
      const existing = indexByDate.get(key);
      if (existing === undefined) {
        indexByDate.set(key, groups.length);
        groups.push({ date: key, sessions: [session] });
      } else {
        groups[existing].sessions.push(session);
      }
    }
    return groups;
  }, [filteredSessions]);

  const typeLabel =
    TYPE_OPTIONS.find((o) => o.value === typeValue)?.label ?? "All";
  const monthLabel =
    MONTH_OPTIONS.find((o) => o.value === monthValue)?.label ?? "All";

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
                  title={`${trainingTypeFilter.label}: ${typeLabel}`}
                >
                  {`${trainingTypeFilter.label}: ${typeLabel}`}
                </span>
              )}
            >
              {TYPE_OPTIONS.map((option) => (
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
                  title={`${monthFilter.label}: ${monthLabel}`}
                >
                  {`${monthFilter.label}: ${monthLabel}`}
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

        <ul
          className="support_service_training_detail_schedule__list"
          data-slug="currDtlMgmt-data"
          data-slug-repeat="true"
        >
          {groupedSessions.map((group) =>
            group.sessions.map((session, indexInGroup) => (
              <TrainingDetailSession
                key={session.id}
                courseId={detail.courseId}
                session={session}
                hrefPrefix={hrefPrefix}
                showDate={indexInGroup === 0}
              />
            )),
          )}
        </ul>
      </div>
    </section>
  );
}
