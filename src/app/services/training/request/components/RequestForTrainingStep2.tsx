"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { requestForTrainingRoutes } from "@/data/services/requestForTrainingContent";
import RequestForTraining from "./RequestForTraining";
import {
  isStep2Complete,
  useRequestForTrainingForm,
} from "./RequestForTrainingProvider";
import RequestForTrainingStep2Form from "./RequestForTrainingStep2Form";

export type RequestForTrainingStep2Errors = {
  sessionCount?: boolean;
  sessionDays?: boolean;
  scheduleStart?: boolean;
  scheduleEnd?: boolean;
  studentCount?: boolean;
};

const PAST_DATE_ALERT =
  "Past dates cannot be selected. Please choose today or a later date.";

export default function RequestForTrainingStep2({
  todayStr,
}: {
  todayStr: string;
}) {
  const router = useRouter();
  const { step2 } = useRequestForTrainingForm();
  const [errors, setErrors] = useState<RequestForTrainingStep2Errors>({});

  function clearError(key: keyof RequestForTrainingStep2Errors) {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  function handleNext() {
    // 캘린더 선택은 minDate로 막히지만 직접 입력은 과거 날짜가 들어올 수 있어 여기서 재검증한다.
    const startIsPast =
      step2.scheduleStart.trim() !== "" && step2.scheduleStart < todayStr;
    const endIsPast =
      step2.scheduleEnd.trim() !== "" && step2.scheduleEnd < todayStr;

    const nextErrors: RequestForTrainingStep2Errors = {
      sessionCount: step2.sessionCount.trim() === "",
      sessionDays: step2.sessionDays.trim() === "",
      scheduleStart: step2.scheduleStart.trim() === "" || startIsPast,
      scheduleEnd: step2.scheduleEnd.trim() === "" || endIsPast,
      studentCount: step2.studentCount.trim() === "",
    };
    setErrors(nextErrors);

    if (startIsPast || endIsPast) {
      alert(PAST_DATE_ALERT);
      return;
    }

    if (!isStep2Complete(step2)) {
      return;
    }

    router.push(requestForTrainingRoutes.step3);
  }

  return (
    <RequestForTraining
      currentStep={2}
      previousHref={requestForTrainingRoutes.step1}
      onNextClick={handleNext}
    >
      <RequestForTrainingStep2Form
        errors={errors}
        onClearError={clearError}
        todayStr={todayStr}
      />
    </RequestForTraining>
  );
}
