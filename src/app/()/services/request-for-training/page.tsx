import RequestForTraining from "./components/RequestForTraining";
import RequestForTrainingStep1Form from "./components/RequestForTrainingStep1Form";
import RequestForTrainingTitle from "./components/RequestForTrainingTitle";
import { requestForTrainingRoutes } from "@/data/services/requestForTrainingContent";
import "@/assets/css/company.css";
import "@/assets/css/training.css";

export default function RequestForTrainingPage() {
  return (
    <main
      className="support-page support-page--request-for-training"
      id="P-FO-SERV-040000T_step_01"
    >
      <RequestForTrainingTitle />
      <RequestForTraining currentStep={1} nextHref={requestForTrainingRoutes.step2}>
        <RequestForTrainingStep1Form />
      </RequestForTraining>
    </main>
  );
}
