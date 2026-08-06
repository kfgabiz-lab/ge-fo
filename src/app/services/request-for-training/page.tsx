import RequestForTrainingStep1 from "./components/RequestForTrainingStep1";
import RequestForTrainingTitle from "./components/RequestForTrainingTitle";
import "@/assets/css/company.css";
import "@/assets/css/training.css";
import type { Metadata, ResolvingMetadata } from "next";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/services/request-for-training", parent);
}

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
