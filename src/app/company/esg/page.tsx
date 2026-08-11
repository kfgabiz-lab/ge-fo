import type { Metadata, ResolvingMetadata } from "next";
import CompanyEsgPage from "@/app/company/components/CompanyEsgPage";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, buildPageGraph, crumbsFromBreadcrumbConfig, pageUrl } from "@/lib/structuredData/builders";
import { WEBSITE_ID } from "@/lib/structuredData/siteConfig";
import "@/assets/css/company.css";

const PATHNAME = "/company/esg";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function CompanyEsgRoutePage() {
  const meta = await fetchMenuMeta(PATHNAME);
  const currentUrl = pageUrl(PATHNAME);
  const graph = buildPageGraph(
    [
      {
        "@type": "AboutPage",
        "@id": `${currentUrl}#webpage`,
        url: currentUrl,
        name: meta.metaTitle,
        description: meta.metaDescription,
        isPartOf: { "@id": WEBSITE_ID },
        breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
        relatedLink: "https://www.ls-electric.com/esg",
        mainEntity: {
          "@type": "ItemList",
          "@id": "#roadmap",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Phase 1 (2022–2025)",
              description:
                "LS ELECTRIC's carbon neutrality declaration (October 2022), framework establishment, RE100 participation, and energy saving activities.",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Phase 2 (2026–2035)",
              description:
                "Implement decarbonization strategies, expand renewable energy sourcing, and sign PPAs.",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Phase 3 (2036–2040)",
              description: "Achieve RE100 and full carbon neutrality.",
            },
          ],
        },
      },
      breadcrumbList(currentUrl, crumbsFromBreadcrumbConfig(PATHNAME, currentUrl)),
    ],
    { orgFull: true },
  );

  return (
    <>
      <JsonLd data={graph} />
      <CompanyEsgPage />
    </>
  );
}
