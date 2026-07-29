import { flattenPageDataItem, type PageDataItem } from "@/lib/pageData";
import { fetchData } from "@/lib/pageDataApi";

const IMG = "/img/company/careers";

export const careersPageTitle = {
  title: "Careers at LS ELECTRIC America",
  description:
    "We're looking for exceptional talent to grow and dream together with LS ELECTRIC.",
} as const;

export const careersLinkedInCta = {
  label: "Go to LinkedIn",
  href: "https://www.linkedin.com/company/lselectricamerica/jobs/",
} as const;

export const careersJobsSection = {
  title: "Job Description",
  backgroundImage: `${IMG}/jobs-bg.png`,
} as const;

export type CareersJob = {
  id: string;
  title: string;
  description: string;
  sort: string;
  isVisible: string;
  updatedAt: string;
};

function toCareersJob(item: PageDataItem): CareersJob {
  const row = flattenPageDataItem(item);
  return {
    id: String(item.id),
    title: (row.title as string) ?? "",
    description: (row.description as string) ?? "",
    sort: (row.sort_order as string) ?? "",
    isVisible: (row.is_visible as string) ?? "",
    updatedAt: (row.updatedAt as string) ?? "",
  };
}

function sortCareersJobs(jobs: CareersJob[]): CareersJob[] {
  return [...jobs].sort((a, b) => {
    const na = Number(a.sort);
    const nb = Number(b.sort);
    const sa = Number.isFinite(na) ? na : Number.MAX_SAFE_INTEGER;
    const sb = Number.isFinite(nb) ? nb : Number.MAX_SAFE_INTEGER;
    if (sa !== sb) return sa - sb;
    return (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "");
  });
}

export async function fetchCareersJobs(): Promise<CareersJob[]> {
  const res = await fetchData<CareersJob>({
    slug: "careers-data",
    size: 100,
    where: { "eq_careers.is_visible": "001" },
    리턴함수: (rows: PageDataItem[]): CareersJob[] =>
      sortCareersJobs(rows.map(toCareersJob)),
  });
  return res.content;
}

export const careersLinkedInBanner = {
  backgroundImage: `${IMG}/linkedin-banner.jpg`,
  backgroundImageMo: `${IMG}/linkedin-banner-mo.jpg`,
  title: "Explore Open Positions on LinkedIn",
  titleMo: ["Explore Open Positions ", "on LinkedIn"] as const,
  description: [
    "Discover your next career opportunity with LS ELECTRIC America.",
    "Visit our official LinkedIn page to view all current job openings, explore our company culture, and apply to join our team of industry innovators.",
  ],
  descriptionMo:
    "Discover your next career opportunity with LS ELECTRIC America. Visit our official LinkedIn page to view all current job openings, explore our company culture, and apply to join our team of industry innovators.",
  cta: careersLinkedInCta,
} as const;
