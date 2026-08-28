import type { Metadata, ResolvedMetadata, ResolvingMetadata } from "next";
import { flattenPageDataItem } from "@/lib/pageData";
import { fetchData } from "@/lib/pageDataApi";

const TITLE_SUFFIX = " | LS ELECTRIC America";

export function mergeSeoMetadata(
  previous: ResolvedMetadata,
  title: string,
  description: string,
  image?: string,
): Metadata {
  const socialTitle = `${title}${TITLE_SUFFIX}`;

  return {
    title,
    description,
    openGraph: {
      ...previous.openGraph,
      title: socialTitle,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      ...previous.twitter,
      title: socialTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export async function buildPageDataSeoMetadata(
  params: {
    slug: string;
    id: string | number;
    where?: Record<string, string>;
    imageResolver?: (row: Record<string, unknown>) => string | undefined;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug, id, where, imageResolver } = params;

  const [detail, previous] = await Promise.all([
    fetchData({
      slug,
      id,
      where,
      리턴함수: (x) => x,
    }),
    parent,
  ]);

  const row: Record<string, unknown> = detail
      ? flattenPageDataItem(detail)
      : {};

  const title = (row["seo.meta_title"] as string) ?? "";
  const description = (row["seo.meta_description"] as string) ?? "";

  const image = imageResolver?.(row);

  return mergeSeoMetadata(
      previous,
      title,
      description,
      image,
  );
}
