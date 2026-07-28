"use client";

import RequestForTrainingConsentSection from "./RequestForTrainingConsentSection";
import RequestForTrainingProductSelector from "./RequestForTrainingProductSelector";
import { useRequestForTrainingForm } from "./RequestForTrainingProvider";
import RequestForTrainingQuestionnaireIntro from "./RequestForTrainingQuestionnaireIntro";
import RequestForTrainingVfdQuestionnaire from "./RequestForTrainingVfdQuestionnaire";

const VFD_GROUP_TITLE = "Variable Frequency Drive";

export default function RequestForTrainingStep4Form() {
  const { step4 } = useRequestForTrainingForm();
  const hasVfdProduct = step4.selectedProducts.some(
    (product) => product.type === "A" && product.groupTitle === VFD_GROUP_TITLE,
  );

  return (
    <div className="support_service_training_request__panel support_service_training_request__panel--bordered">
      <div className="support_service_training_request__panel-inner">
        <RequestForTrainingQuestionnaireIntro />

        <form
          className="support_service_training_request__form"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="support_service_training_request__form-grid">
            <RequestForTrainingProductSelector />
            {hasVfdProduct ? <RequestForTrainingVfdQuestionnaire /> : null}
            <RequestForTrainingConsentSection />
          </div>
        </form>
      </div>
    </div>
  );
}
