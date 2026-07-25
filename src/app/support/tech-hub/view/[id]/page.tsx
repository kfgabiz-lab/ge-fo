import { notFound } from "next/navigation";
import TechHubView from "../../components/TechHubView";
import { fetchTechHubContentDetail } from "@/data/support/techHubData";
import "@/assets/css/devices-product-detail.css";
import "@/assets/css/support.css";

// Tech Hub 콘텐츠 상세(콘텐츠별 동적 라우트). masterId 로 상세 조회 → 미존재/미노출(BE 404)이면 notFound().
type TechHubViewPageProps = {
  params: Promise<{ id: string }>;
};

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
