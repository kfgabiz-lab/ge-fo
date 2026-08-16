import type { Metadata, ResolvingMetadata } from "next";
import CompanyArticlesPage from "@/app/company/components/CompanyArticlesPage";
import {
  ARTICLES_LIST_SIZE,
  ARTICLES_STATUS_WHERE,
  articlesDetailHref,
  toArticlesCard,
} from "@/app/company/data/articlesData";
import { fetchData } from "@/lib/pageDataApi";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import JsonLd from "@/components/seo/JsonLd";
import { buildContentListGraph } from "@/lib/structuredData/contentGraph";

const PATHNAME = "/company/articles";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function CompanyArticlesListPage() {
  const [meta, res] = await Promise.all([
    fetchMenuMeta(PATHNAME),
    fetchData({
      slug: "articles-data",
      page: 0,
      size: ARTICLES_LIST_SIZE,
      where: ARTICLES_STATUS_WHERE,
      sort: "createdAt,desc",
      리턴함수: (rows) => rows.map(toArticlesCard),
    }),
  ]);
  const graph = buildContentListGraph({
    itemType: "Article",
    pathname: PATHNAME,
    meta,
    items: res.content.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      rawDate: item.rawDate,
      href: articlesDetailHref(item.id, item.slug),
    })),
  });
  return (
    <>
      <JsonLd data={graph} />
      <CompanyArticlesPage />
    </>
  );
}
