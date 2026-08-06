import type { Metadata, ResolvingMetadata } from "next";
import CompanyEsgPage from "@/app/company/components/CompanyEsgPage";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";
import "@/assets/css/company.css";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/company/esg", parent);
}

export default function CompanyEsgRoutePage() {
  return <CompanyEsgPage />;
}
