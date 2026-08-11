import type { Metadata, ResolvingMetadata } from "next";
import CompanyCareersPage from "@/app/company/components/CompanyCareersPage";
import { fetchCareersJobs } from "@/app/company/data/careersContent";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, buildPageGraph, crumbsFromBreadcrumbConfig, pageUrl } from "@/lib/structuredData/builders";
import { ORG_ID, WEBSITE_ID } from "@/lib/structuredData/siteConfig";
import "@/assets/css/company.css";

const PATHNAME = "/company/careers";
const CAREERS_LINKEDIN_JOBS_URL = "https://www.linkedin.com/company/lselectricamerica/jobs/";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function CompanyCareersRoutePage() {
  const [meta, jobs] = await Promise.all([fetchMenuMeta(PATHNAME), fetchCareersJobs()]);
  const currentUrl = pageUrl(PATHNAME);
  const graph = buildPageGraph([
    {
      "@type": "WebPage",
      "@id": `${currentUrl}#webpage`,
      url: currentUrl,
      name: meta.metaTitle,
      description: meta.metaDescription,
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
      ...(jobs.length
        ? {
            mainEntity: {
              "@type": "ItemList",
              "@id": `${currentUrl}#joblist`,
              name: "Job Description",
              itemListElement: jobs.map((job) => ({
                "@type": "JobPosting",
                title: job.title,
                description: job.description,
                hiringOrganization: { "@id": ORG_ID },
                sameAs: CAREERS_LINKEDIN_JOBS_URL,
              })),
            },
          }
        : {}),
    },
    breadcrumbList(currentUrl, crumbsFromBreadcrumbConfig(PATHNAME, currentUrl)),
  ]);

  return (
    <>
      <JsonLd data={graph} />
      <CompanyCareersPage />
    </>
  );
}
