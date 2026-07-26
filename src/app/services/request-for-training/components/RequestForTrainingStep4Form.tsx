"use client";

import RequestForTrainingProductSelector from "./RequestForTrainingProductSelector";
import RequestForTrainingQuestionnaireIntro from "./RequestForTrainingQuestionnaireIntro";

// STEP4-1 범위: 제품 선택 필드만 구성. VFD 조건부 블록/의견/약관동의/reCAPTCHA는
// 각 서브STEP 승인 후 이 파일에 이어서 추가한다(기획서 traning_req4dc.png item 2~5).
export default function RequestForTrainingStep4Form() {
  return (
    <div className="support_service_training_request__panel">
      <div className="support_service_training_request__panel-inner">
        <RequestForTrainingQuestionnaireIntro />

        <form
          className="support_service_training_request__form"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="support_service_training_request__form-grid">
            <RequestForTrainingProductSelector />
          </div>
        </form>
      </div>
    </div>
  );
}
