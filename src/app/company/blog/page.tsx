import type { Metadata, ResolvingMetadata } from "next";
import CompanyBlogPage from "@/app/company/components/CompanyBlogPage";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/company/blog", parent);
}

export default function CompanyBlogListPage() {
  return <CompanyBlogPage />;
}
