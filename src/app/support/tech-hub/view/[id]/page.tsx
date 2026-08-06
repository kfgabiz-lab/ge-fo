import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import TechHubView from "../../components/TechHubView";
import { fetchTechHubContentDetail } from "@/data/support/techHubData";
import { mergeSeoMetadata } from "@/lib/pageDataSeo";
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

  return (
    <main
      className="support-page support-page--tech-hub-view"
      id="Page_support_tech_hub_view"
    >
      <TechHubView detail={detail} />
    </main>
  );
}
