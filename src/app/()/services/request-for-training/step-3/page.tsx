import RequestForTraining from "../components/RequestForTraining";
import RequestForTrainingStep3Form from "../components/RequestForTrainingStep3Form";
import RequestForTrainingTitle from "../components/RequestForTrainingTitle";
import { requestForTrainingRoutes } from "@/data/services/requestForTrainingContent";
import "@/assets/css/company.css";
import "@/assets/css/training.css";

export default function RequestForTrainingStep3Page() {
  return (
    <main
      className="support-page support-page--request-for-training"
      id="P-FO-SERV-040000T_step_03"
    >
      <RequestForTrainingTitle />
      <RequestForTraining
        currentStep={3}
        previousHref={requestForTrainingRoutes.step2}
        nextHref={requestForTrainingRoutes.step4}
      >
        <RequestForTrainingStep3Form />
      </RequestForTraining>
    </main>
  );
}
