import { formatDisplayDate } from "@/lib/formatDate";
import { flattenPageDataItem, pickField, type PageDataItem } from "@/lib/pageData";
import { LIST_DESCRIPTION_MAX_LENGTH, stripHtmlText } from "@/lib/stripHtmlText";

export const PRESS_LIST_SIZE = 9;

export const pressImageSrc = (mediaId: number) => `/api/v1/fo/page-files/${mediaId}`;

export const pressDetailHref = (id: number, slug?: string | null) =>
  `/company/press/${slug || id}`;

export type PressRow = PageDataItem;

export interface PressCardItem {
  id: number;
  slug: string | null;
  title: string;
  description: string;
  date: string;
  rawDate: string;
  imageSrc: string | null;
}

export function toPressCard(item: PressRow): PressCardItem {
  const row = flattenPageDataItem(item);
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const publishDttm = (pickField(row, "publish_dttm", "publishDttm") as string) ?? "";
  return {
    id: item.id,
    slug: (row["seo.slug"] as string) || null,
    title: (row.title as string) ?? "",
    description: stripHtmlText(row.content as string | undefined, LIST_DESCRIPTION_MAX_LENGTH),
    date: formatDisplayDate(publishDttm),
    rawDate: publishDttm,
    imageSrc: mediaId != null ? pressImageSrc(mediaId) : null,
  };
}

/** 게시상태는 bo-api가 press-data에 대해 서버측에서 항상 강제한다 — 클라이언트가 조건을 보낼 필요 없음 */
export const PRESS_STATUS_WHERE: Record<string, string> = {};
