import SupportPageTitle from "@/app/support/components/SupportPageTitle";
import { techHubPage } from "@/data/support/techHubContent";

export default function TechHubTitle() {
  return (
    <SupportPageTitle
      id="support-tech-hub-title"
      rootClass="support_tech_hub_title"
      title={techHubPage.title}
      description={techHubPage.description}
    />
  );
}
