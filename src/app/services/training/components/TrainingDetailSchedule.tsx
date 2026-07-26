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

  // 날짜 그룹핑: 필터 통과 세션들을 표시 날짜(session.date = formatSessionDateRange 결과)로 묶는다.
  // - 같은 날짜(여러 날 범위 포함)의 세션이 2건 이상이면 날짜 헤더를 1회만 노출하고 그 아래 카드를 묶어 렌더.
  // - session.date 는 from/to 를 연/월/일까지 반영한 문자열이라 "같은 문자열 ⇔ 같은 날짜(범위)"가 성립.
  // - 상위 정렬(TRAINING_DETAIL_SORT, training_date_from asc)이 유지되므로 첫 등장 순서 = 날짜 오름차순.
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
            마크업/CSS 는 퍼블리싱 원본(EngineeringTrainingDetailSchedule) 구조 그대로:
            리스트 <ul>(__list) 이 반복 컨테이너이고, 각 회차는 <li>(__item) = [날짜(__date) | 카드(__session)] 이다.
            날짜 그룹핑 "로직"(groupedSessions)은 유지하되, 원본 마크업을 벗어나는 그룹 래퍼는 두지 않는다.
            대신 같은 날짜 묶음에서 날짜 헤더가 1회만 보이도록 그룹 첫 세션에만 __date 텍스트를 노출한다
            (뒤 세션은 __date 를 빈 값으로 렌더 → PC 250px 날짜 컬럼 정렬 유지, 날짜 중복 노출 방지). */}
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
