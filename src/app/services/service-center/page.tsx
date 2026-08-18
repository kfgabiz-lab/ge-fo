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
  GICS_KNOWLEDGE_BASE_URL,
} from "@/data/services/serviceCenterContent";
import "@/assets/css/services.css";
import type { Metadata, ResolvingMetadata } from "next";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import JsonLd from "@/components/seo/JsonLd";
import { buildSimpleWebPageGraph, pageUrl } from "@/lib/structuredData/builders";
import { GICS_SUPPORT_URL } from "@/lib/structuredData/siteConfig";

const ACTION_PLATFORMS = [
  "http://schema.org/DesktopWebPlatform",
  "http://schema.org/MobileWebPlatform",
];

const PATHNAME = "/services/service-center";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function ServiceCenterPage() {
  const meta = await fetchMenuMeta(PATHNAME);
  const graph = buildSimpleWebPageGraph(PATHNAME, meta, {
    extra: {
      about: [
        {
          "@type": "FAQPage",
          mainEntity: serviceCenterFaqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        },
      ],
      potentialAction: [
        {
          "@type": "CommunicateAction",
          name: "Request for Service",
          target: {
            "@type": "EntryPoint",
            urlTemplate: GICS_SUPPORT_URL,
            actionPlatform: ACTION_PLATFORMS,
          },
        },
        {
          "@type": "CommunicateAction",
          name: "Contact us",
          target: {
            "@type": "EntryPoint",
            urlTemplate: pageUrl("/support/contact-us"),
            actionPlatform: ACTION_PLATFORMS,
          },
        },
        {
          "@type": "CommunicateAction",
          name: "Training Request",
          target: pageUrl("/services/training/request"),
        },
        {
          "@type": "CommunicateAction",
          name: "Download Center",
          target: pageUrl("/support/download-center"),
        },
        {
          "@type": "CommunicateAction",
          name: "Knowledge Base for Power Products",
          target: {
            "@type": "EntryPoint",
            urlTemplate: GICS_KNOWLEDGE_BASE_URL,
            actionPlatform: ACTION_PLATFORMS,
          },
        },
        {
          "@type": "CommunicateAction",
          name: "Knowledge Base for Automation Products",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://sol.ls-electric.com/us/en/community/blog",
            actionPlatform: ACTION_PLATFORMS,
          },
        },
        {
          "@type": "CommunicateAction",
          name: "Tech Hub",
          target: pageUrl("/support/tech-hub"),
        },
        {
          "@type": "CommunicateAction",
          name: "Warranty Policy",
          target: pageUrl("/services/warranty-policy"),
        },
      ],
    },
  });
  return (
    <main
      className="support-page support-page--service-center"
      id="P-FO-SERV-010000P"
    >
      <JsonLd data={graph} />
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
