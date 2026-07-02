import RequestForTraining from "../components/RequestForTraining";
import RequestForTrainingStep2Form from "../components/RequestForTrainingStep2Form";
import RequestForTrainingTitle from "../components/RequestForTrainingTitle";
import { requestForTrainingRoutes } from "@/data/services/requestForTrainingContent";
import "@/assets/css/company.css";
import "@/assets/css/training.css";

export default function RequestForTrainingStep2Page() {
  return (
    <main
      className="support-page support-page--request-for-training"
      id="P-FO-SERV-040000T_step_02"
    >
      <RequestForTrainingTitle />
      <RequestForTraining currentStep={2} previousHref={requestForTrainingRoutes.step1} nextHref={requestForTrainingRoutes.step3}>
        <RequestForTrainingStep2Form />
      </RequestForTraining>
    </main>
  );
}
