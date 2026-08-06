import type { Metadata, ResolvingMetadata } from "next";
import { flattenPageDataItem } from "@/lib/pageData";
import { fetchData } from "@/lib/pageDataApi";

export async function buildPageDataSeoMetadata(
  params: {
    slug: string;
    id: string | number;
    where?: Record<string, string>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug, id, where } = params;

  const [detail, previous] = await Promise.all([
    fetchData({
      slug,
      id,
      where,
      리턴함수: (x) => x,
    }),
    parent,
  ]);

  const row: Record<string, unknown> = detail ? flattenPageDataItem(detail) : {};
  const title = (row["seo.meta_title"] as string) ?? "";
  const description = (row["seo.meta_description"] as string) ?? "";

  return {
    title,
    description,
    openGraph: { ...previous.openGraph, title, description },
    twitter: { ...previous.twitter, title, description },
  };
}
