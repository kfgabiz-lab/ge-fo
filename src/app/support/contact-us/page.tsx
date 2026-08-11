import ContactUsForm from "./components/ContactUsForm";
import ContactUsTitle from "./components/ContactUsTitle";
import "@/assets/css/support.css";
import type { Metadata, ResolvingMetadata } from "next";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import JsonLd from "@/components/seo/JsonLd";
import { buildSimpleWebPageGraph, pageUrl } from "@/lib/structuredData/builders";

const PATHNAME = "/support/contact-us";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function ContactUsPage() {
  const meta = await fetchMenuMeta(PATHNAME);
  const graph = buildSimpleWebPageGraph(PATHNAME, meta, {
    extra: {
      potentialAction: [
        {
          "@type": "RegisterAction",
          name: "Submit Contact Us Form",
          target: pageUrl(PATHNAME),
        },
      ],
    },
  });
  return (
    <main
      className="support-page support-page--contact-us"
      id="Page_support_contact_us"
    >
      <JsonLd data={graph} />
      <ContactUsTitle />
      <ContactUsForm />
    </main>
  );
}
