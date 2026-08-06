import WhereToBuyBanner from "./components/WhereToBuyBanner";
import WhereToBuyContents from "./components/WhereToBuyContents";
import WhereToBuyTitle from "./components/WhereToBuyTitle";
import "@/assets/css/support.css";
import type { Metadata, ResolvingMetadata } from "next";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/support/where-to-buy", parent);
}

export default function WhereToBuyPage() {
  return (
    <main
      className="support-page support-page--where-to-buy"
      id="P-FO-SUPP-040000P"
    >
      <WhereToBuyTitle />
      <WhereToBuyContents />
      <WhereToBuyBanner />
    </main>
  );
}
