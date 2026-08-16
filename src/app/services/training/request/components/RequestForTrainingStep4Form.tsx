"use client";

import RequestForTrainingConsentSection, {
  type RequestForTrainingConsentErrors,
} from "./RequestForTrainingConsentSection";
import RequestForTrainingProductSelector from "./RequestForTrainingProductSelector";
import { useRequestForTrainingForm } from "./RequestForTrainingProvider";
import RequestForTrainingQuestionnaireIntro from "./RequestForTrainingQuestionnaireIntro";
import RequestForTrainingVfdQuestionnaire, {
  type RequestForTrainingVfdErrors,
} from "./RequestForTrainingVfdQuestionnaire";

const VFD_GROUP_TITLE = "Variable Frequency Drive";

export type RequestForTrainingStep4Errors = {
  products?: boolean;
} & RequestForTrainingVfdErrors &
  RequestForTrainingConsentErrors;

export default function RequestForTrainingStep4Form({
  errors = {},
  onClearError,
}: {
  errors?: RequestForTrainingStep4Errors;
  onClearError?: (key: keyof RequestForTrainingStep4Errors) => void;
} = {}) {
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
            <RequestForTrainingProductSelector
              error={errors.products}
              onClearError={() => onClearError?.("products")}
            />
            {hasVfdProduct ? (
              <RequestForTrainingVfdQuestionnaire
                errors={errors}
                onClearError={onClearError}
              />
            ) : null}
            <RequestForTrainingConsentSection
              errors={errors}
              onClearError={onClearError}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
