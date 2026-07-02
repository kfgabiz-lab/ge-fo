import DownloadCenterContents from "../components/DownloadCenterContents";
import DownloadCenterSearch from "../components/DownloadCenterSearch";
import DownloadCenterTitle from "../components/DownloadCenterTitle";
import "@/assets/css/devices-product-detail.css";
import "@/assets/css/support.css";

export default function DownloadCenterNoDataPage() {
  return (
    <main
      className="support-page support-page--download-center"
      id="Page_support_download_center_no_data"
    >
      <DownloadCenterTitle />
      <DownloadCenterSearch />
      <DownloadCenterContents empty />
    </main>
  );
}
