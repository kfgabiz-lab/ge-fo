import DownloadCenterContents from "./components/DownloadCenterContents";
import DownloadCenterSearch from "./components/DownloadCenterSearch";
import DownloadCenterTitle from "./components/DownloadCenterTitle";
import "@/assets/css/devices-product-detail.css";
import "@/assets/css/support.css";

export default function DownloadCenterPage() {
  return (
    <main
      className="support-page support-page--download-center"
      id="Page_support_download_center"
    >
      <DownloadCenterTitle />
      <DownloadCenterSearch />
      <DownloadCenterContents />
    </main>
  );
}
