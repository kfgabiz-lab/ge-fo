import { formatDisplayDate } from "@/lib/formatDate";
import { flattenPageDataItem, pickField, type PageDataItem } from "@/lib/pageData";
import { LIST_DESCRIPTION_MAX_LENGTH, stripHtmlText } from "@/lib/stripHtmlText";

export const ARTICLES_LIST_SIZE = 10;

export const articlesImageSrc = (mediaId: number) => `/api/v1/fo/page-files/${mediaId}`;

export const articlesDetailHref = (id: number) => `/company/articles/detail/${id}`;

export type ArticlesRow = PageDataItem;

export interface ArticlesCardItem {
  id: number;
  title: string;
  description: string;
  date: string;
  rawDate: string;
  imageSrc: string | null;
}

export function toArticlesCard(item: ArticlesRow): ArticlesCardItem {
  const row = flattenPageDataItem(item);
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const publishDttm = (pickField(row, "publish_dttm", "publishDttm") as string) ?? "";
  return {
    id: item.id,
    title: (row.title as string) ?? "",
    description: stripHtmlText(row.content as string | undefined, LIST_DESCRIPTION_MAX_LENGTH),
    date: formatDisplayDate(publishDttm),
    rawDate: publishDttm,
    imageSrc: mediaId != null ? articlesImageSrc(mediaId) : null,
  };
}

export const ARTICLES_STATUS_WHERE: Record<string, string> = {
  condexpr_status: "is_visible=001,publish_dttm<=now()?'게시':'미게시'",
  condval_status: "게시",
};
