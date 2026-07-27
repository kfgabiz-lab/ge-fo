import RequestForTrainingStep2 from "../components/RequestForTrainingStep2";
import RequestForTrainingTitle from "../components/RequestForTrainingTitle";
import { siteTodayStr } from "@/lib/siteTime";
import "@/assets/css/company.css";
import "@/assets/css/training.css";

export default function RequestForTrainingStep2Page() {
  const todayStr = siteTodayStr();

  return (
    <main
      className="support-page support-page--request-for-training"
      id="P-FO-SERV-040000T_step_02"
    >
      <RequestForTrainingTitle />
      <RequestForTrainingStep2 todayStr={todayStr} />
    </main>
  );
}
