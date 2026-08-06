import ContactUsForm from "./components/ContactUsForm";
import ContactUsTitle from "./components/ContactUsTitle";
import "@/assets/css/support.css";
import type { Metadata, ResolvingMetadata } from "next";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/support/contact-us", parent);
}

export default function ContactUsPage() {
  return (
    <main
      className="support-page support-page--contact-us"
      id="Page_support_contact_us"
    >
      <ContactUsTitle />
      <ContactUsForm />
    </main>
  );
}
