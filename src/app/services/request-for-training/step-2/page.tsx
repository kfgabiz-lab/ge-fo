import RequestForTrainingStep2 from "../components/RequestForTrainingStep2";
import RequestForTrainingTitle from "../components/RequestForTrainingTitle";
import { siteTodayStr } from "@/lib/siteTime";
import "@/assets/css/company.css";
import "@/assets/css/training.css";

export default function RequestForTrainingStep2Page() {
  // 기획서(traning_req2dc.png) 요구 — 캘린더 호출 시 오늘 이전 날짜 선택 불가.
  // "오늘" 기준은 사이트 타임존(siteTime.ts)으로 통일(서버 컴포넌트에서 계산해 클라이언트로 내려줌).
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
