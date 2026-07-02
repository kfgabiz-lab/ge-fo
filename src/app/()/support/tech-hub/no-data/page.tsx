import TechHubContents from "../components/TechHubContents";
import TechHubSearch from "../components/TechHubSearch";
import TechHubTitle from "../components/TechHubTitle";
import { techHubNoDataSearchQuery } from "@/data/support/techHubContent";
import "@/assets/css/devices-product-detail.css";
import "@/assets/css/support.css";

export default function TechHubNoDataPage() {
  return (
    <main
      className="support-page support-page--tech-hub"
      id="Page_support_tech_hub_no_data"
    >
      <TechHubTitle />
      <TechHubSearch initialQuery={techHubNoDataSearchQuery} />
      <TechHubContents empty />
    </main>
  );
}
