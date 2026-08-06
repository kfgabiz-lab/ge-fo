import type { Metadata, ResolvingMetadata } from "next";
import CompanyCareersPage from "@/app/company/components/CompanyCareersPage";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";
import "@/assets/css/company.css";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/company/careers", parent);
}

export default function CompanyCareersRoutePage() {
  return <CompanyCareersPage />;
}
