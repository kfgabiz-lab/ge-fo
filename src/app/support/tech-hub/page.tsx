import type { Metadata, ResolvingMetadata } from "next";
import TechHubPageShell from "./components/TechHubPageShell";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import { fetchTechHubContents } from "@/data/support/techHubData";
import { fetchCategoriesByCode } from "@/app/()/products-systems/data/productsSystemsData";
import { contentDetailPath } from "@/lib/contentDetailPath";
import { getYoutubeIdFromUrl, getYoutubePosterSrc } from "@/lib/youtubeEmbed";
import JsonLd from "@/components/seo/JsonLd";
import { buildSimpleWebPageGraph, pageUrl } from "@/lib/structuredData/builders";
import { ORG_ID } from "@/lib/structuredData/siteConfig";

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

  const [meta, contents] = await Promise.all([
    fetchMenuMeta(PATHNAME),
    fetchTechHubContents({ size: 12 }),
  ]);
  const lv2Codes = contents.content
    .map((card) => card.categoryL2Id)
    .filter((code): code is string => Boolean(code));
  const lv2CategoryMap = await fetchCategoriesByCode(lv2Codes);

  const graph = buildSimpleWebPageGraph(PATHNAME, meta, {
    type: "CollectionPage",
    extra: {
      hasPart: contents.content.map((card) => {
        const videoId = card.videoUrl ? getYoutubeIdFromUrl(card.videoUrl) : "";
        const lv2Category = card.categoryL2Id
          ? lv2CategoryMap.get(card.categoryL2Id)
          : undefined;
        return {
          "@type": "VideoObject",
          name: card.title,
          thumbnailUrl: videoId ? getYoutubePosterSrc(videoId) : undefined,
          uploadDate: card.sourceUpdatedAt ?? "",
          embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : "",
          publisher: { "@id": ORG_ID },
          ...(lv2Category
            ? {
                about: {
                  "@id": `${pageUrl(
                    contentDetailPath(
                      "/product-range",
                      lv2Category.id,
                      lv2Category.slug,
                    ),
                  )}#productgroup`,
                },
              }
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
