import CommonFaq from "@/components/faq/CommonFaq";
import ServiceCenterBanner from "./components/ServiceCenterBanner";
import ServiceCenterCards from "./components/ServiceCenterCards";
import ServiceCenterFlow from "./components/ServiceCenterFlow";
import ServiceCenterGics from "./components/ServiceCenterGics";
import ServiceCenterOffering from "./components/ServiceCenterOffering";
import ServiceCenterTitle from "./components/ServiceCenterTitle";
import {
  serviceCenterFaqDescriptionLines,
  serviceCenterFaqItems,
} from "@/data/services/serviceCenterContent";
import "@/assets/css/services.css";

export default function ServiceCenterPage() {
  return (
    <main
      className="support-page support-page--service-center"
      id="P-FO-SERV-010000P"
    >
      <ServiceCenterTitle />
      <ServiceCenterCards />
      <ServiceCenterBanner />
      <ServiceCenterOffering />
      <ServiceCenterFlow />
      <ServiceCenterGics />
      <CommonFaq
        sectionId="service-center-faq"
        description={
          <>
            {serviceCenterFaqDescriptionLines[0]}
            <br />
            {serviceCenterFaqDescriptionLines[1]}
          </>
        }
        items={serviceCenterFaqItems}
        defaultOpenIndex={-1}
      />
    </main>
  );
}
