import { requestForTrainingQuestionnaireCopy } from "@/data/services/requestForTrainingContent";

// Training Questionnaire 인트로(제목 + 안내문). ls-publish 원본 마크업 그대로 이관.
export default function RequestForTrainingQuestionnaireIntro({
  headingId = "request-for-training-heading",
}: {
  headingId?: string;
}) {
  const { heading, description } = requestForTrainingQuestionnaireCopy;

  return (
    <header className="support_service_training_request__intro">
      <h2 className="support_service_training_request__heading" id={headingId}>
        {heading}
      </h2>
      <p className="support_service_training_request__desc">{description}</p>
    </header>
  );
}
