"use client";

import { FormControl, MenuItem } from "@mui/material";
import { useMemo, useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import type { EngineeringTrainingDetail } from "@/data/services/engineeringTrainingDetailContent";
import TrainingDetailSession from "./TrainingDetailSession";

// Training 코스 상세 - 스케줄 섹션 (ls-publish EngineeringTrainingDetailSchedule 이관)
// 1:N 모델: 카드 = 교육회차 행. 필터 2종을 실동작(AND)으로 구현.
// - Training Type: 선택 코드가 행 typeCodes(CSV split)에 포함되면 통과. 빈값(All)=전체.
//   · 원본 퍼블리싱 툴바가 GuideSelect(.guide_field) 드롭다운 2단이라 그 마크업을 그대로 사용(신규 마크업/CSS 없음).
// - Month: 고정 옵션 Jun~Oct(데이터 도출 아님). 행 training_date_from(isoDate)의 월과 일치하면 통과. 빈값=전체.

// Training Type 고정 옵션(코드값 = TRAININGTYPE: 001=In-Person / 002=Virtual)
const TYPE_OPTIONS = [
  { value: "", label: "All" },
  { value: "001", label: "In-Person" },
  { value: "002", label: "Virtual" },
];

// Month 고정 옵션(값 = 월 2자리 "MM"). 데이터에서 도출하지 않는 고정 5개월.
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

  // 선택값("" = 전체). 두 필터 AND 적용.
  const [typeValue, setTypeValue] = useState("");
  const [monthValue, setMonthValue] = useState("");

  const filteredSessions = useMemo(
    () =>
      sessions.filter((s) => {
        // Training Type: 선택 코드가 행 typeCodes 에 포함되면 통과(빈값=전체)
        if (typeValue && !(s.typeCodes ?? []).includes(typeValue)) return false;
        // Month: 행 시작일(isoDate)의 월(MM)이 선택월과 일치하면 통과(빈값=전체)
        if (monthValue && (s.isoDate ?? "").slice(5, 7) !== monthValue) {
          return false;
        }
        return true;
      }),
    [sessions, typeValue, monthValue],
  );

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
          {/* Training Type 필터(단일 선택) — 행 training_type(CSV) 교집합 필터 */}
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

          {/* Month 필터(단일 선택) — 고정 Jun~Oct, 행 시작월 일치 필터 */}
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

        {/* data-slug: currDtlMgmt-data 다건(교육회차 N행). 각 회차 행 = 이 스케줄 카드 1건.
            1:N 모델에서 코스상세 스케줄 리스트가 곧 회차 목록이라 리스트 <ul> 이 반복 컨테이너. */}
        <ul
          className="support_service_training_detail_schedule__list"
          data-slug="currDtlMgmt-data"
          data-slug-repeat="true"
        >
          {filteredSessions.map((session) => (
            <TrainingDetailSession
              key={session.id}
              courseId={detail.courseId}
              session={session}
              hrefPrefix={hrefPrefix}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
