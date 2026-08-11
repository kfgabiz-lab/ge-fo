import ConnectPortalDetail from "./components/ConnectPortalDetail";
import ConnectPortalFeatures from "./components/ConnectPortalFeatures";
import ConnectPortalTitle from "./components/ConnectPortalTitle";
import ConnectPortalVideo from "./components/ConnectPortalVideo";
import { connectPortalPage } from "@/data/support/connectPortalContent";
import "@/assets/css/support.css";
import type { Metadata, ResolvingMetadata } from "next";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import JsonLd from "@/components/seo/JsonLd";
import { buildSimpleWebPageGraph } from "@/lib/structuredData/builders";
import { CONNECT_PORTAL_EXTERNAL_URL, ORG_ID } from "@/lib/structuredData/siteConfig";

const PATHNAME = "/support/connect-portal";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function ConnectPortalPage() {
  const meta = await fetchMenuMeta(PATHNAME);
  const graph = buildSimpleWebPageGraph(PATHNAME, meta, {
    extra: {
      about: [
        {
          "@type": "Service",
          name: "LS ELECTRIC Connect Portal",
          description: connectPortalPage.detailSections[0]?.description ?? "",
          url: CONNECT_PORTAL_EXTERNAL_URL,
          provider: { "@id": ORG_ID },
        },
      ],
      potentialAction: [
        {
          "@type": "Action",
          name: "Go to Connect Portal",
          target: CONNECT_PORTAL_EXTERNAL_URL,
        },
      ],
    },
  });
  return (
    <main
      className="support-page support-page--connect-portal"
      id="Page_support_connect_portal"
    >
      <JsonLd data={graph} />
      <ConnectPortalTitle />
      <ConnectPortalVideo />
      <ConnectPortalFeatures />
      {connectPortalPage.detailSections.map((section) => (
        <ConnectPortalDetail
          key={section.id}
          title={"title" in section ? section.title : undefined}
          titleLines={"titleLines" in section ? section.titleLines : undefined}
          description={section.description}
          bullets={section.bullets}
          image={section.image}
          imageAlt={section.imageAlt}
          reverse={section.reverse}
        />
      ))}
    </main>
  );
}
