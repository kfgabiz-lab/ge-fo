import RequestForTraining from "../components/RequestForTraining";
import RequestForTrainingStep4Form from "../components/RequestForTrainingStep4Form";
import RequestForTrainingTitle from "../components/RequestForTrainingTitle";
import { requestForTrainingNavCopy, requestForTrainingRoutes } from "@/data/services/requestForTrainingContent";
import "@/assets/css/company.css";
import "@/assets/css/training.css";

export default function RequestForTrainingStep4Page() {
  return (
    <main
      className="support-page support-page--request-for-training"
      id="P-FO-SERV-040000T_step_04"
    >
      <RequestForTrainingTitle />
      <RequestForTraining
        currentStep={4}
        previousHref={requestForTrainingRoutes.step3}
        submitLabel={requestForTrainingNavCopy.submitLabel}
      >
        <RequestForTrainingStep4Form variant="power" />
      </RequestForTraining>
    </main>
  );
}
