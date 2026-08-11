import type { Metadata, ResolvingMetadata } from "next";
import CompanyAffiliateAmericaPage from "@/app/company/components/CompanyAffiliateAmericaPage";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, buildPageGraph, crumbsFromBreadcrumbConfig, pageUrl } from "@/lib/structuredData/builders";
import { ORG_ID, SITE_URL, WEBSITE_ID } from "@/lib/structuredData/siteConfig";
import "@/assets/css/company.css";

const PATHNAME = "/company/affiliate-in-america";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function CompanyAffiliateInAmericaPage() {
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
      mainEntity: {
        "@type": "ItemList",
        "@id": `${currentUrl}#affiliate-list`,
        name: "Affiliates in North America",
        itemListElement: [
          {
            "@type": "Organization",
            "@id": `${SITE_URL}#org-lses`,
            name: "LS Energy Solutions",
            description: "Energy storage (ESS), power infrastructure, smart energy",
            url: "https://www.ls-es.com/",
            parentOrganization: { "@id": ORG_ID },
          },
          {
            "@type": "Organization",
            "@id": `${SITE_URL}#org-lseu`,
            name: "LS ELECTRIC Utah Inc.",
            url: "https://www.lselectricutah.com/",
            parentOrganization: { "@id": ORG_ID },
          },
          {
            "@type": "Organization",
            "@id": "#org-ls-ems",
            name: "LS e-Mobility Solutions",
            description: "EV components, electrical systems, battery-related solutions",
            url: "https://www.lsems.com/en/",
            parentOrganization: {
              "@type": "Organization",
              "@id": "https://www.ls-electric.com/#organization",
              name: "LS ELECTRIC",
              url: "https://www.ls-electric.com/",
            },
          },
          {
            "@type": "Organization",
            "@id": "#org-ls-cable",
            name: "LS Cable&System USA Inc",
            description: "Power cables, submarine cables, communication cables",
            url: "https://lscsusa.com/",
            parentOrganization: {
              "@type": "Organization",
              "@id": "https://www.lsholdings.com/#organization",
              name: "LS Corp",
              url: "https://www.lsholdings.com/en",
            },
          },
          {
            "@type": "Organization",
            "@id": "#org-ls-mtron",
            name: "LS Mtron",
            description: "Tractors, injection molding machines, industrial equipment",
            url: "https://www.lsmtron.com/us/en/",
            parentOrganization: { "@id": "https://www.lsholdings.com/#organization" },
          },
          {
            "@type": "Organization",
            "@id": "#org-ls-mnm",
            name: "LS MnM",
            description: "Copper smelting, precious metals, battery materials",
            url: "https://www.lsmnm.com/en/main",
            parentOrganization: { "@id": "https://www.lsholdings.com/#organization" },
          },
        ],
      },
    },
    breadcrumbList(currentUrl, crumbsFromBreadcrumbConfig(PATHNAME, currentUrl)),
  ]);

  return (
    <>
      <JsonLd data={graph} />
      <CompanyAffiliateAmericaPage />
    </>
  );
}
