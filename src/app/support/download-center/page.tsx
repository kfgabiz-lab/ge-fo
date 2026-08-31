import type { Metadata, ResolvingMetadata } from "next";
import DownloadCenterPageShell from "./components/DownloadCenterPageShell";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import { fetchDownloadCenterContents } from "@/data/support/downloadCenterData";
import JsonLd from "@/components/seo/JsonLd";
import { buildSimpleWebPageGraph } from "@/lib/structuredData/builders";

const PATHNAME = "/support/download-center";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function DownloadCenterPage() {
  const [meta, contents] = await Promise.all([
    fetchMenuMeta(PATHNAME),
    fetchDownloadCenterContents({
      sort: "newest",
      includeFileContent: true,
      page: 0,
      size: 10,
    }),
  ]);
  const graph = buildSimpleWebPageGraph(PATHNAME, meta, {
    type: "CollectionPage",
    extra: {
      hasPart: contents.content.flatMap((item) =>
        item.versions.map((v) => ({
          "@type": "DigitalDocument",
          name: item.title ?? "",
          uploadDate: item.date ?? "",
          version: v.versionName ?? "",
          hasPart: v.files.map((f) => ({
            "@type": "DataDownload",
            name: f.fileName ?? "",
            encodingFormat: f.fileExt ?? "",
          })),
        })),
      ),
    },
  });
  return (
    <>
      <JsonLd data={graph} />
      <DownloadCenterPageShell
        pageId="Page_support_download_center"
        downloadCenterInitialContents={contents}
      />
    </>
  );
}
