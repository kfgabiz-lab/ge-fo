import type { Metadata, ResolvingMetadata } from "next";
import CompanyAmericaPage from "@/app/company/components/CompanyAmericaPage";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, buildPageGraph, crumbsFromBreadcrumbConfig, pageUrl } from "@/lib/structuredData/builders";
import { ORG_ID, WEBSITE_ID } from "@/lib/structuredData/siteConfig";
import "@/assets/css/company.css";

const PATHNAME = "/company/ls-electric-america";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function CompanyLsElectricAmericaPage() {
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
        mainEntity: { "@id": ORG_ID },
      },
      breadcrumbList(currentUrl, crumbsFromBreadcrumbConfig(PATHNAME, currentUrl)),
    ],
    { orgFull: true },
  );

  return (
    <>
      <JsonLd data={graph} />
      <CompanyAmericaPage />
    </>
  );
}
