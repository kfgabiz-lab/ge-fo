"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { requestForTrainingRoutes } from "@/data/services/requestForTrainingContent";
import RequestForTraining from "./RequestForTraining";
import { useRequestForTrainingForm } from "./RequestForTrainingProvider";
import RequestForTrainingStep1Form from "./RequestForTrainingStep1Form";

// Next 클릭 시 필수값 검증이 필요해 셸(RequestForTraining)에 콜백을 넘겨야 하고,
// 서버 컴포넌트인 page.tsx 에서는 함수를 내려줄 수 없어 이 클라이언트 래퍼가 셸+폼을 조립한다.
// (마크업/클래스는 셸·폼 원본 그대로, 여기서는 상태 연결만 담당)

// Next 클릭 시 빈 값인 필수 텍스트 필드에 에러 표시용 맵
// (Training Track 은 라디오라 기본값이 항상 선택되어 있어 대상 아님 — ContactUsForm 과 동일 기준)
export type RequestForTrainingStep1Errors = {
  firstName?: boolean;
  company?: boolean;
  streetAddress?: boolean;
  city?: boolean;
  state?: boolean;
  zip?: boolean;
  phone?: boolean;
  email?: boolean;
};

export default function RequestForTrainingStep1() {
  const router = useRouter();
  const { step1 } = useRequestForTrainingForm();
  const [errors, setErrors] = useState<RequestForTrainingStep1Errors>({});

  // 입력이 들어오면 해당 필드 에러 해제
  function clearError(key: keyof RequestForTrainingStep1Errors) {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  // Next — 필수값 모두 입력 시 Step2 로 이동, 미충족 시 alert
  function handleNext() {
    const nextErrors: RequestForTrainingStep1Errors = {
      firstName: step1.firstName.trim() === "",
      company: step1.company.trim() === "",
      streetAddress: step1.streetAddress.trim() === "",
      city: step1.city.trim() === "",
      state: step1.state.trim() === "",
      zip: step1.zip.trim() === "",
      phone: step1.phone.trim() === "",
      email: step1.email.trim() === "",
    };
    setErrors(nextErrors);

    const requiredFilled =
      step1.trainingTrack.trim() !== "" &&
      !Object.values(nextErrors).some(Boolean);
    if (!requiredFilled) {
      alert("Please complete all required fields.");
      return;
    }

    // 입력값은 이미 Provider(Context + sessionStorage)에 저장되어 있어 Step2 에서 그대로 이어받는다.
    router.push(requestForTrainingRoutes.step2);
  }

  return (
    <RequestForTraining currentStep={1} onNextClick={handleNext}>
      <RequestForTrainingStep1Form errors={errors} onClearError={clearError} />
    </RequestForTraining>
  );
}
