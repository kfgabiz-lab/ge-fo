import WarrantyPolicyBanner from "./components/WarrantyPolicyBanner";
import WarrantyPolicyCoverage from "./components/WarrantyPolicyCoverage";
import WarrantyPolicyTitle from "./components/WarrantyPolicyTitle";
import "@/assets/css/services.css";
import type { Metadata, ResolvingMetadata } from "next";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import JsonLd from "@/components/seo/JsonLd";
import { buildSimpleWebPageGraph } from "@/lib/structuredData/builders";

const PATHNAME = "/services/warranty-policy";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function WarrantyPolicyPage() {
  const meta = await fetchMenuMeta(PATHNAME);
  const graph = buildSimpleWebPageGraph(PATHNAME, meta, {
    extra: {
      mainEntity: {
        "@type": "WarrantyPromise",
        name: "Warranty Policy",
        description:
          "Check the warranty period for each LS ELECTRIC product by date of purchase or manufacture.",
        warrantyScope: "https://schema.org/ManufacturerWarranty",
      },
      potentialAction: [
        {
          "@type": "CommunicateAction",
          name: "Request Warranty Service",
          target: "https://gics.ls-electric.com/public/index.do",
        },
      ],
    },
  });
  return (
    <main
      className="support-page support-page--warranty-policy"
      id="P-FO-SERV-020000P"
    >
      <JsonLd data={graph} />
      <WarrantyPolicyTitle />
      <WarrantyPolicyCoverage />
      <WarrantyPolicyBanner />
    </main>
  );
}
