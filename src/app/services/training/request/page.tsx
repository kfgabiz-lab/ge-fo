import RequestForTrainingStep1 from "./components/RequestForTrainingStep1";
import RequestForTrainingTitle from "./components/RequestForTrainingTitle";
import "@/assets/css/company.css";
import "@/assets/css/training.css";
import type { Metadata, ResolvingMetadata } from "next";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import JsonLd from "@/components/seo/JsonLd";
import { buildSimpleWebPageGraph, pageUrl } from "@/lib/structuredData/builders";

const PATHNAME = "/services/training/request";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function RequestForTrainingPage() {
  const meta = await fetchMenuMeta(PATHNAME);
  const graph = buildSimpleWebPageGraph(PATHNAME, meta, {
    extra: {
      potentialAction: [
        {
          "@type": "RegisterAction",
          name: "Submit Training Request Form",
          target: pageUrl(PATHNAME),
        },
      ],
    },
  });
  return (
    <main
      className="support-page support-page--request-for-training"
      id="P-FO-SERV-040000T_step_01"
    >
      <JsonLd data={graph} />
      <RequestForTrainingTitle />
      <RequestForTrainingStep1 />
    </main>
  );
}
