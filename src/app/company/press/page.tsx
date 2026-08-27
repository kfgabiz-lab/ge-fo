import { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import CompanyPressPage from "@/app/company/components/CompanyPressPage";
import {
  PRESS_LIST_SIZE,
  PRESS_STATUS_WHERE,
  pressDetailHref,
  toPressCard,
} from "@/app/company/data/pressData";
import { fetchData } from "@/lib/pageDataApi";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import JsonLd from "@/components/seo/JsonLd";
import { buildContentListGraph } from "@/lib/structuredData/contentGraph";

const PATHNAME = "/company/press";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function CompanyPressListPage() {
  const [meta, res] = await Promise.all([
    fetchMenuMeta(PATHNAME),
    fetchData({
      slug: "press-data",
      page: 0,
      size: PRESS_LIST_SIZE,
      where: PRESS_STATUS_WHERE,
      sort: "press.publish_dttm,desc",
      리턴함수: (rows) => rows,
    }),
  ]);
  const cards = res.content.map(toPressCard);
  const graph = buildContentListGraph({
    itemType: "NewsArticle",
    pathname: PATHNAME,
    meta,
    items: cards.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      rawDate: item.rawDate,
      href: pressDetailHref(item.id, item.slug),
    })),
  });
  return (
    <>
      <JsonLd data={graph} />
      <Suspense fallback={null}>
        <CompanyPressPage
          initialRows={res.content}
          initialTotalPages={res.totalPages}
        />
      </Suspense>
    </>
  );
}
