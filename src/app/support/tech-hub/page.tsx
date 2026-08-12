import type { Metadata, ResolvingMetadata } from "next";
import TechHubPageShell from "./components/TechHubPageShell";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import { fetchTechHubContents } from "@/data/support/techHubData";
import { fetchDevicesTreeRows } from "@/data/gnb/devicesTree";
import { getYoutubeIdFromUrl, getYoutubePosterSrc } from "@/lib/youtubeEmbed";
import JsonLd from "@/components/seo/JsonLd";
import { buildSimpleWebPageGraph, pageUrl } from "@/lib/structuredData/builders";
import { ORG_ID } from "@/lib/structuredData/siteConfig";

async function fetchLv2SlugMap(): Promise<Map<string, string>> {
  const rows = await fetchDevicesTreeRows();
  const map = new Map<string, string>();
  for (const r of rows) {
    if (r.depth === "2" && r.rowId != null && r.categorySlug) {
      map.set(String(r.rowId), r.categorySlug);
    }
  }
  return map;
}

const PATHNAME = "/support/tech-hub";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
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

  const [meta, contents, lv2SlugMap] = await Promise.all([
    fetchMenuMeta(PATHNAME),
    fetchTechHubContents({ size: 12 }),
    fetchLv2SlugMap(),
  ]);
  const graph = buildSimpleWebPageGraph(PATHNAME, meta, {
    type: "CollectionPage",
    extra: {
      hasPart: contents.content.map((card) => {
        const videoId = card.videoUrl ? getYoutubeIdFromUrl(card.videoUrl) : "";
        const lv2Slug = card.categoryL2Id ? lv2SlugMap.get(card.categoryL2Id) : undefined;
        return {
          "@type": "VideoObject",
          name: card.title,
          thumbnailUrl: videoId ? getYoutubePosterSrc(videoId) : undefined,
          uploadDate: card.sourceUpdatedAt ?? "",
          embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : "",
          publisher: { "@id": ORG_ID },
          ...(lv2Slug
            ? { about: { "@id": `${pageUrl(`/product-range/${lv2Slug}`)}#productgroup` } }
            : {}),
        };
      }),
    },
  });

  return (
    <>
      <JsonLd data={graph} />
      <TechHubPageShell
        pageId="Page_support_tech_hub"
        initialCategories={codes}
      />
    </>
  );
}
