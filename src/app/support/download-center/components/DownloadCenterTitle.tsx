import SupportPageTitle from "@/app/support/components/SupportPageTitle";
import { downloadCenterPage } from "@/data/support/downloadCenterContent";

export default function DownloadCenterTitle() {
  return (
    <SupportPageTitle
      id="support-download-title"
      rootClass="support_download_title"
      title={downloadCenterPage.title}
      description={downloadCenterPage.description}
    />
  );
}
