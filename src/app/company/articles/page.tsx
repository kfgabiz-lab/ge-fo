import type { Metadata, ResolvingMetadata } from "next";
import CompanyArticlesPage from "@/app/company/components/CompanyArticlesPage";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/company/articles", parent);
}

export default function CompanyArticlesListPage() {
  return <CompanyArticlesPage />;
}
