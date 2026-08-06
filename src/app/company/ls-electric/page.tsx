import type { Metadata, ResolvingMetadata } from "next";
import CompanyLsElectricPage from "@/app/company/components/CompanyLsElectricPage";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";
import "@/assets/css/company.css";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/company/ls-electric", parent);
}

export default function CompanyLsElectricRoutePage() {
  return <CompanyLsElectricPage />;
}
