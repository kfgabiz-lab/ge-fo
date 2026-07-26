"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { requestForTrainingRoutes } from "@/data/services/requestForTrainingContent";
import RequestForTraining from "./RequestForTraining";
import { useRequestForTrainingForm } from "./RequestForTrainingProvider";
import RequestForTrainingStep3Form from "./RequestForTrainingStep3Form";

// Next 클릭 시 필수값 검증이 필요해 셸(RequestForTraining)에 콜백을 넘겨야 하고,
// 서버 컴포넌트인 page.tsx 에서는 함수를 내려줄 수 없어 이 클라이언트 래퍼가 셸+폼을 조립한다.
// (Step1·Step2와 동일 패턴)

export type RequestForTrainingStep3Errors = {
  locationName?: boolean;
  contactDetails?: boolean;
};

export default function RequestForTrainingStep3() {
  const router = useRouter();
  const { step3 } = useRequestForTrainingForm();
  const [errors, setErrors] = useState<RequestForTrainingStep3Errors>({});

  function clearError(key: keyof RequestForTrainingStep3Errors) {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  // Next — 기획서(traning_req3dc.png)상 Virtual 선택 시 [1a] 영역(장소명~연락처)이 화면에서
  // 사라지므로, 그 안의 필수값(locationName/contactDetails)은 In-Person일 때만 검증 대상이다.
  function handleNext() {
    const isInPerson = step3.trainingFormat === "In-Person";
    const nextErrors: RequestForTrainingStep3Errors = {
      locationName: isInPerson && step3.locationName.trim() === "",
      contactDetails: isInPerson && step3.contactDetails.trim() === "",
    };
    setErrors(nextErrors);

    const requiredFilled = !Object.values(nextErrors).some(Boolean);
    if (!requiredFilled) {
      alert("Please complete all required fields.");
      return;
    }

    // 입력값은 이미 Provider(Context + sessionStorage)에 저장되어 있어 Step4 에서 그대로 이어받는다.
    router.push(requestForTrainingRoutes.step4);
  }

  return (
    <RequestForTraining
      currentStep={3}
      previousHref={requestForTrainingRoutes.step2}
      onNextClick={handleNext}
    >
      <RequestForTrainingStep3Form errors={errors} onClearError={clearError} />
    </RequestForTraining>
  );
}
