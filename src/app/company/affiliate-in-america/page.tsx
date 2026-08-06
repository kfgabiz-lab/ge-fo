import type { Metadata, ResolvingMetadata } from "next";
import CompanyAffiliateAmericaPage from "@/app/company/components/CompanyAffiliateAmericaPage";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";
import "@/assets/css/company.css";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/company/affiliate-in-america", parent);
}

export default function CompanyAffiliateInAmericaPage() {
  return <CompanyAffiliateAmericaPage />;
}
