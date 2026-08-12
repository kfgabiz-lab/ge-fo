import WhereToBuyBanner from "./components/WhereToBuyBanner";
import WhereToBuyContents from "./components/WhereToBuyContents";
import WhereToBuyTitle from "./components/WhereToBuyTitle";
import "@/assets/css/support.css";
import type { Metadata, ResolvingMetadata } from "next";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import { fetchWhereToBuyLocations } from "@/data/support/whereToBuyContent";
import JsonLd from "@/components/seo/JsonLd";
import { buildSimpleWebPageGraph, pageUrl } from "@/lib/structuredData/builders";

const PATHNAME = "/support/where-to-buy";

/**
 * "625 Heathrow Dr, Lincolnshire, IL 60069" 형태(Street, City, ST ZIP)일 때만
 * 분해하고, 그 외 형식은 전부 streetAddress에 그대로 담아 원문을 보존한다.
 */
function parseUsAddress(address: string): {
  streetAddress: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
} {
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 3) {
    const stateZip = parts[2].match(/^([A-Za-z]{2})\s+(\S+)$/);
    if (stateZip) {
      return {
        streetAddress: parts[0],
        addressLocality: parts[1],
        addressRegion: stateZip[1],
        postalCode: stateZip[2],
      };
    }
  }
  return { streetAddress: address };
}

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
        "@id": `${pageUrl(PATHNAME)}#distributor-${loc.id}`,
        name: loc.name,
        telephone: loc.phone,
        address: {
          "@type": "PostalAddress",
          ...parseUsAddress(loc.address),
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
