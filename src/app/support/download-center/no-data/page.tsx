import SupportFilterNoDataPage from "@/app/support/components/SupportFilterNoDataPage";
import { downloadCenterNoDataPageConfig } from "@/data/support/supportFilterNoDataConfig";

export default function DownloadCenterNoDataPage() {
  return <SupportFilterNoDataPage config={downloadCenterNoDataPageConfig} />;
}
