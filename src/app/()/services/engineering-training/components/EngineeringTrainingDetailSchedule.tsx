"use client";

import { FormControl, MenuItem } from "@mui/material";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import type {
  EngineeringTrainingDetail,
  EngineeringTrainingScheduleFilter,
} from "@/data/services/engineeringTrainingDetailContent";
import EngineeringTrainingDetailSession from "./EngineeringTrainingDetailSession";

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

export default function EngineeringTrainingDetailSchedule({
  detail,
}: {
  detail: EngineeringTrainingDetail;
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

        <ul className="support_service_training_detail_schedule__list">
          {sessions.map((session) => (
            <EngineeringTrainingDetailSession
              key={session.id}
              courseId={detail.courseId}
              session={session}
              title={detail.title}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
