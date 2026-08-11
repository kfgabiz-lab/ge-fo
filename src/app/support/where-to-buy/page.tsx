import WhereToBuyBanner from "./components/WhereToBuyBanner";
import WhereToBuyContents from "./components/WhereToBuyContents";
import WhereToBuyTitle from "./components/WhereToBuyTitle";
import "@/assets/css/support.css";
import type { Metadata, ResolvingMetadata } from "next";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import { fetchWhereToBuyLocations } from "@/data/support/whereToBuyContent";
import JsonLd from "@/components/seo/JsonLd";
import { buildSimpleWebPageGraph } from "@/lib/structuredData/builders";

const PATHNAME = "/support/where-to-buy";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function WhereToBuyPage() {
  const [meta, locations] = await Promise.all([
    fetchMenuMeta(PATHNAME),
    fetchWhereToBuyLocations(),
  ]);
  const graph = buildSimpleWebPageGraph(PATHNAME, meta, {
    type: "CollectionPage",
    extra: {
      hasPart: locations.slice(0, 50).map((loc) => ({
        "@type": "LocalBusiness",
        "@id": `${PATHNAME}#distributor-${loc.id}`,
        name: loc.name,
        telephone: loc.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: loc.address,
          addressCountry: "US",
        },
        ...(Number.isFinite(loc.lat) && Number.isFinite(loc.lng)
          ? { geo: { "@type": "GeoCoordinates", latitude: loc.lat, longitude: loc.lng } }
          : {}),
      })),
    },
  });
  return (
    <main
      className="support-page support-page--where-to-buy"
      id="P-FO-SUPP-040000P"
    >
      <JsonLd data={graph} />
      <WhereToBuyTitle />
      <WhereToBuyContents />
      <WhereToBuyBanner />
    </main>
  );
}
