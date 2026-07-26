"use client";

import RequestForTrainingProductSelector from "./RequestForTrainingProductSelector";
import { useRequestForTrainingForm } from "./RequestForTrainingProvider";
import RequestForTrainingQuestionnaireIntro from "./RequestForTrainingQuestionnaireIntro";
import RequestForTrainingVfdQuestionnaire from "./RequestForTrainingVfdQuestionnaire";

// 기획서(traning_req4dc.png) item2 — Variable Frequency Drive 그룹의 제품을 하나라도 고른 경우에만
// 하단 질문 블록([2번] 영역)을 노출하고, 모두 해제하면 다시 감춘다(값은 Provider 에 그대로 유지).
const VFD_GROUP_TITLE = "Variable Frequency Drive";

// STEP4 범위: 제품 선택 + VFD 조건부 질문. 의견/약관동의/reCAPTCHA는
// 각 서브STEP 승인 후 이 파일에 이어서 추가한다(기획서 traning_req4dc.png item 3~5).
export default function RequestForTrainingStep4Form() {
  const { step4 } = useRequestForTrainingForm();
  const hasVfdProduct = step4.selectedProducts.some(
    (product) => product.type === "A" && product.groupTitle === VFD_GROUP_TITLE,
  );

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
            {hasVfdProduct ? <RequestForTrainingVfdQuestionnaire /> : null}
          </div>
        </form>
      </div>
    </div>
  );
}
