import TechHubPageShell from "./components/TechHubPageShell";

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
