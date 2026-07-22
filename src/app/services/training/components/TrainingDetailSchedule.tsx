"use client";

import { FormControl, MenuItem } from "@mui/material";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import type {
  EngineeringTrainingDetail,
  EngineeringTrainingScheduleFilter,
} from "@/data/services/engineeringTrainingDetailContent";
import TrainingDetailSession from "./TrainingDetailSession";

// Training 코스 상세 - 스케줄 섹션 (ls-publish EngineeringTrainingDetailSchedule 이관)
function ScheduleFilterSelect({ filter }: { filter: EngineeringTrainingScheduleFilter }) {
  return (
    <FormControl className="guide_field guide_field--h50 guide_field--w200">
      <GuideSelect
        defaultValue={filter.defaultValue}
        IconComponent={GuideSelectIcon}
        inputProps={{ "aria-label": filter.label }}
        renderValue={(value) => (
          <span className="guide_field__select-value" title={String(value)}>
            {String(value)}
          </span>
        )}
      >
        {filter.options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </GuideSelect>
    </FormControl>
  );
}

export default function TrainingDetailSchedule({
  detail,
  hrefPrefix,
}: {
  detail: EngineeringTrainingDetail;
  hrefPrefix: string;
}) {
  const { trainingTypeFilter, monthFilter, sessions } = detail.schedule;

  return (
    <section
      className="support_service_training_detail_schedule"
      id="engineering-training-detail-schedule"
    >
      <div className="inner">
        <div className="support_service_training_detail_schedule__toolbar">
          <ScheduleFilterSelect filter={trainingTypeFilter} />
          <ScheduleFilterSelect filter={monthFilter} />
        </div>

        {/* data-slug: training_schedule 서브리스트(다건) — currDtlMgmt-data 단건 내부의 배열 필드.
            중첩 반복이므로 부모 data-slug(currDtlMgmt-data) 안에서 동일 어휘(data-slug-repeat/item)를 재사용 */}
        <ul
          className="support_service_training_detail_schedule__list"
          data-slug="training_schedule"
          data-slug-repeat="true"
        >
          {sessions.map((session) => (
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
