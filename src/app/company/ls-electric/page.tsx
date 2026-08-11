import type { Metadata, ResolvingMetadata } from "next";
import CompanyLsElectricPage from "@/app/company/components/CompanyLsElectricPage";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, buildPageGraph, crumbsFromBreadcrumbConfig, pageUrl } from "@/lib/structuredData/builders";
import { ORG_ID, WEBSITE_ID } from "@/lib/structuredData/siteConfig";
import "@/assets/css/company.css";

const PATHNAME = "/company/ls-electric";
const LS_ELECTRIC_GLOBAL_ID = "https://www.ls-electric.com/#organization";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function CompanyLsElectricRoutePage() {
  const meta = await fetchMenuMeta(PATHNAME);
  const currentUrl = pageUrl(PATHNAME);
  const graph = buildPageGraph([
    {
      "@type": "AboutPage",
      "@id": `${currentUrl}#webpage`,
      url: currentUrl,
      name: meta.metaTitle,
      description: meta.metaDescription,
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
      mainEntity: { "@id": LS_ELECTRIC_GLOBAL_ID },
    },
    {
      "@type": "Organization",
      "@id": LS_ELECTRIC_GLOBAL_ID,
      name: "LS ELECTRIC",
      legalName: "LS ELECTRIC Co., Ltd.",
      url: "https://www.ls-electric.com/",
      description:
        "LS ELECTRIC is a global energy and automation company delivering integrated power and digital solutions. By combining advanced electrical engineering with digital technologies, we enable industries and infrastructure to operate with greater efficiency, reliability, and sustainability.",
      foundingDate: "1974-06-13",
      subOrganization: { "@id": ORG_ID },
      parentOrganization: {
        "@type": "Organization",
        "@id": "https://www.lsholdings.com/#organization",
        name: "LS Corp",
        url: "https://www.lsholdings.com/en",
      },
    },
    breadcrumbList(currentUrl, crumbsFromBreadcrumbConfig(PATHNAME, currentUrl)),
  ]);

  return (
    <>
      <JsonLd data={graph} />
      <CompanyLsElectricPage />
    </>
  );
}
