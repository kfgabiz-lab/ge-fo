import type { Metadata, ResolvingMetadata } from "next";
import CompanyPressPage from "@/app/company/components/CompanyPressPage";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/company/press", parent);
}

export default function CompanyPressListPage() {
  return <CompanyPressPage />;
}
