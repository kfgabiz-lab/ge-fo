"use client";

import {
  requestForTrainingNavCopy,
  requestForTrainingRoutes,
} from "@/data/services/requestForTrainingContent";
import RequestForTraining from "./RequestForTraining";
import RequestForTrainingStep4Form from "./RequestForTrainingStep4Form";

// Step4 는 마지막 스텝 — dc(traning_req4dc.png item7)상 Send Message CTA는 Step1~4 전체 필수값을
// 검증해 DB 저장/이메일 발송까지 수행해야 하는데, 그 로직(STEP4-2~4-4)이 아직 없어 이번 STEP4-1은
// 라벨만 노출하고 클릭 동작은 연결하지 않는다(사용자 확정: #진행).
export default function RequestForTrainingStep4() {
  return (
    <RequestForTraining
      currentStep={4}
      previousHref={requestForTrainingRoutes.step3}
      submitLabel={requestForTrainingNavCopy.submitLabel}
    >
      <RequestForTrainingStep4Form />
    </RequestForTraining>
  );
}
