import EngineeringTrainingCurriculum from "./components/EngineeringTrainingCurriculum";
import EngineeringTrainingIntro from "./components/EngineeringTrainingIntro";
import EngineeringTrainingTitle from "./components/EngineeringTrainingTitle";
import "@/assets/css/company.css";
import "@/assets/css/training.css";

export default function EngineeringTrainingPage() {
  return (
    <main
      className="support-page support-page--engineering-training"
      id="P-FO-SERV-030000P"
    >
      <EngineeringTrainingTitle />
      <EngineeringTrainingIntro />
      <EngineeringTrainingCurriculum />
    </main>
  );
}
