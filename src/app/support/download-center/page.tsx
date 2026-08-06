import type { Metadata, ResolvingMetadata } from "next";
import DownloadCenterPageShell from "./components/DownloadCenterPageShell";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/support/download-center", parent);
}

export default function DownloadCenterPage() {
  return <DownloadCenterPageShell pageId="Page_support_download_center" />;
}
