import TechHubPageShell from "./components/TechHubPageShell";

// 제품상세 Tech Hub 배너(CommonBanner03)에서 넘어온 카테고리 프리필터(?categories=L01-12,L02-01)를
// 초기 체크 상태로 반영한다. Next 15 App Router 에서 searchParams 는 Promise 이므로 await 후 CSV 를 분해한다.
// 파라미터가 없으면 codes = [] → 기존 동작(전체 목록)과 완전히 동일하다.
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
