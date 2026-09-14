import { fetchApiText } from "@/lib/api";

// 실제 sitemap은 bo-api가 이미 생성해서 서빙 중(/api/v1/fo/sitemap.xml) — 여기서는 그대로 프록시만 한다.
export async function GET() {
  const xml = await fetchApiText("/api/v1/fo/sitemap.xml");
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
