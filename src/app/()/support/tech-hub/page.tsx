import TechHubContents from "./components/TechHubContents";
import TechHubSearch from "./components/TechHubSearch";
import TechHubTitle from "./components/TechHubTitle";
import "@/assets/css/devices-product-detail.css";
import "@/assets/css/support.css";

export default function TechHubPage() {
  return (
    <main
      className="support-page support-page--tech-hub"
      id="Page_support_tech_hub"
    >
      <TechHubTitle />
      <TechHubSearch />
      <TechHubContents />
    </main>
  );
}
