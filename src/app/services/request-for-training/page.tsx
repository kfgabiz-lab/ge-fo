import RequestForTrainingStep1 from "./components/RequestForTrainingStep1";
import RequestForTrainingTitle from "./components/RequestForTrainingTitle";
import "@/assets/css/company.css";
import "@/assets/css/training.css";

export default function RequestForTrainingPage() {
  return (
    <main
      className="support-page support-page--request-for-training"
      id="P-FO-SERV-040000T_step_01"
    >
      <RequestForTrainingTitle />
      <RequestForTrainingStep1 />
    </main>
  );
}
