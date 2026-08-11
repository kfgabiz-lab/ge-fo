import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import TechHubView from "../../components/TechHubView";
import { fetchTechHubContentDetail } from "@/data/support/techHubData";
import { mergeSeoMetadata } from "@/lib/pageDataSeo";
import { getYoutubeIdFromUrl, getYoutubePosterSrc } from "@/lib/youtubeEmbed";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, buildPageGraph, pageUrl } from "@/lib/structuredData/builders";
import { ORG_ID, SITE_URL, WEBSITE_ID } from "@/lib/structuredData/siteConfig";
import "@/assets/css/devices-product-detail.css";
import "@/assets/css/support.css";

type TechHubViewPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: TechHubViewPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  const masterId = Number(id);
  const [detail, previous] = await Promise.all([
    Number.isFinite(masterId) ? fetchTechHubContentDetail(masterId) : Promise.resolve(null),
    parent,
  ]);
  return mergeSeoMetadata(previous, detail?.title ?? "", "");
}

export default async function TechHubViewDetailPage({
  params,
}: TechHubViewPageProps) {
  const { id } = await params;
  const masterId = Number(id);
  if (!Number.isFinite(masterId)) notFound();

  const detail = await fetchTechHubContentDetail(masterId);
  if (!detail) notFound();

  const currentUrl = pageUrl(`/support/tech-hub/view/${id}`);
  const videoUrl = detail.chapters[0]?.videoUrl ?? "";
  const videoId = videoUrl ? getYoutubeIdFromUrl(videoUrl) : "";
  const videoNode = {
    "@type": "VideoObject",
    "@id": `${currentUrl}#video`,
    name: detail.title,
    thumbnailUrl: videoId ? getYoutubePosterSrc(videoId) : undefined,
    uploadDate: detail.sourceUpdatedAt ?? "",
    embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : "",
    publisher: { "@id": ORG_ID },
  };
  const jsonLdGraph = buildPageGraph([
    {
      "@type": "ItemPage",
      "@id": `${currentUrl}#webpage`,
      url: currentUrl,
      name: detail.title,
      description: "",
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
      mainEntity: { "@id": `${currentUrl}#video` },
    },
    videoNode,
    breadcrumbList(currentUrl, [
      { name: "Support", url: `${SITE_URL}#support` },
      { name: "Tech Hub", url: pageUrl("/support/tech-hub") },
      { name: detail.title, url: currentUrl },
    ]),
  ]);

  return (
    <main
      className="support-page support-page--tech-hub-view"
      id="Page_support_tech_hub_view"
    >
      <JsonLd data={jsonLdGraph} />
      <TechHubView detail={detail} />
    </main>
  );
}
