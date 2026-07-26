"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { requestForTrainingRoutes } from "@/data/services/requestForTrainingContent";
import RequestForTraining from "./RequestForTraining";
import { useRequestForTrainingForm } from "./RequestForTrainingProvider";
import RequestForTrainingStep2Form from "./RequestForTrainingStep2Form";

// Next 클릭 시 필수값 검증이 필요해 셸(RequestForTraining)에 콜백을 넘겨야 하고,
// 서버 컴포넌트인 page.tsx 에서는 함수를 내려줄 수 없어 이 클라이언트 래퍼가 셸+폼을 조립한다.
// (Step1의 RequestForTrainingStep1.tsx 와 동일 패턴)

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

  // Next — 필수값 모두 입력 시 Step3 로 이동, 미충족 시 alert(Step1과 동일 문구)
  function handleNext() {
    const nextErrors: RequestForTrainingStep2Errors = {
      sessionCount: step2.sessionCount.trim() === "",
      sessionDays: step2.sessionDays.trim() === "",
      scheduleStart: step2.scheduleStart.trim() === "",
      scheduleEnd: step2.scheduleEnd.trim() === "",
      studentCount: step2.studentCount.trim() === "",
    };
    setErrors(nextErrors);

    const requiredFilled = !Object.values(nextErrors).some(Boolean);
    if (!requiredFilled) {
      alert("Please complete all required fields.");
      return;
    }

    // 입력값은 이미 Provider(Context + sessionStorage)에 저장되어 있어 Step3 에서 그대로 이어받는다.
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
