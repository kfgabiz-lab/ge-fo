import type { Metadata, ResolvingMetadata } from "next";
import { fetchApi } from "@/lib/api";
import { mergeSeoMetadata } from "@/lib/pageDataSeo";

interface FoMenuMetaResponse {
  metaTitle: string;
  metaDescription: string;
}

export async function fetchMenuMeta(url: string): Promise<FoMenuMetaResponse> {
  return fetchApi<FoMenuMetaResponse>(
    `/api/v1/fo/menus/meta?url=${encodeURIComponent(url)}`,
  ).catch(() => ({ metaTitle: "", metaDescription: "" }));
}

export async function buildMenuSeoMetadata(
  url: string,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [meta, previous] = await Promise.all([
    fetchMenuMeta(url),
    parent,
  ]);

  return mergeSeoMetadata(previous, meta.metaTitle ?? "", meta.metaDescription ?? "");
}
