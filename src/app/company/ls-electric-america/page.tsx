import type { Metadata, ResolvingMetadata } from "next";
import CompanyAmericaPage from "@/app/company/components/CompanyAmericaPage";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";
import "@/assets/css/company.css";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/company/ls-electric-america", parent);
}

export default function CompanyLsElectricAmericaPage() {
  return <CompanyAmericaPage />;
}
