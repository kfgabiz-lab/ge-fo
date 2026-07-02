import { techHubPage } from "@/data/support/techHubContent";

export default function TechHubTitle() {
  return (
    <section className="support_tech_hub_title" id="support-tech-hub-title">
      <div className="inner">
        <h1 className="support_tech_hub_title__heading">{techHubPage.title}</h1>
        <p className="support_tech_hub_title__desc">{techHubPage.description}</p>
      </div>
    </section>
  );
}
