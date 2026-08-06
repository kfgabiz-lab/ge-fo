import type { Metadata, ResolvingMetadata } from "next";
import TechHubPageShell from "./components/TechHubPageShell";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/support/tech-hub", parent);
}

export default async function TechHubPage({
  searchParams,
}: {
  searchParams: Promise<{ categories?: string }>;
}) {
  const { categories } = await searchParams;
  const codes = (categories ?? "")
    .split(",")
    .map((code) => code.trim())
    .filter((code) => code !== "");

  return (
    <TechHubPageShell
      pageId="Page_support_tech_hub"
      initialCategories={codes}
    />
  );
}
