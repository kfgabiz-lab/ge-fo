import { requestForTrainingQuestionnaireCopy } from "@/data/services/requestForTrainingContent";

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
