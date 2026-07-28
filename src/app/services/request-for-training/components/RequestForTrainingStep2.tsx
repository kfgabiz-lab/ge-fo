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
    const nextErrors: RequestForTrainingStep2Errors = {
      sessionCount: step2.sessionCount.trim() === "",
      sessionDays: step2.sessionDays.trim() === "",
      scheduleStart: step2.scheduleStart.trim() === "",
      scheduleEnd: step2.scheduleEnd.trim() === "",
      studentCount: step2.studentCount.trim() === "",
    };
    setErrors(nextErrors);

    if (!isStep2Complete(step2)) {
      alert("Please complete all required fields.");
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
