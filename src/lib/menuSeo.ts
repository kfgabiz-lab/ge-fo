import type { Metadata, ResolvingMetadata } from "next";
import { fetchApi } from "@/lib/api";
import { mergeSeoMetadata } from "@/lib/pageDataSeo";

interface FoMenuMetaResponse {
  metaTitle: string;
  metaDescription: string;
}

export async function buildMenuSeoMetadata(
  url: string,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [meta, previous] = await Promise.all([
    fetchApi<FoMenuMetaResponse>(
      `/api/v1/fo/menus/meta?url=${encodeURIComponent(url)}`,
    ).catch(() => ({ metaTitle: "", metaDescription: "" })),
    parent,
  ]);

  return mergeSeoMetadata(previous, meta.metaTitle ?? "", meta.metaDescription ?? "");
}
