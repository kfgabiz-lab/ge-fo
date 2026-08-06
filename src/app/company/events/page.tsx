import type { Metadata, ResolvingMetadata } from "next";
import CompanyEventsPage from "@/app/company/components/CompanyEventsPage";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/company/events", parent);
}

export default function CompanyEventsListPage() {
  return <CompanyEventsPage />;
}
