import ConnectPortalDetail from "./components/ConnectPortalDetail";
import ConnectPortalFeatures from "./components/ConnectPortalFeatures";
import ConnectPortalTitle from "./components/ConnectPortalTitle";
import ConnectPortalVideo from "./components/ConnectPortalVideo";
import { connectPortalPage } from "@/data/support/connectPortalContent";
import "@/assets/css/support.css";

export default function ConnectPortalPage() {
  return (
    <main
      className="support-page support-page--connect-portal"
      id="Page_support_connect_portal"
    >
      <ConnectPortalTitle />
      <ConnectPortalVideo />
      <ConnectPortalFeatures />
      {connectPortalPage.detailSections.map((section) => (
        <ConnectPortalDetail
          key={section.id}
          title={"title" in section ? section.title : undefined}
          titleLines={"titleLines" in section ? section.titleLines : undefined}
          description={section.description}
          bullets={section.bullets}
          image={section.image}
          imageAlt={section.imageAlt}
          reverse={section.reverse}
        />
      ))}
    </main>
  );
}
