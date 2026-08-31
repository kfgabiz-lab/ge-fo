import { cache } from "react";
import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import {
  type DevicesTreeRow,
  fetchDevicesTreeRows,
} from "@/data/gnb/devicesTree";
import type {
  GnbDevicesMegaMenu,
  GnbMegaDepth2,
  GnbMegaDepth3,
  GnbMegaProduct,
} from "@/data/gnb/types";
import { resolveFirstImageUrl } from "@/app/()/products-systems/data/productsSystemsData";
import { withCategoryContext } from "@/lib/navigation/categoryContext";
import { contentDetailPath } from "@/lib/contentDetailPath";

function resolveProductImage(productImage: string | null): string | null {
  if (!productImage) return null;
  try {
    const parsed = JSON.parse(productImage);
    return resolveFirstImageUrl(parsed);
  } catch {
    return null;
  }
}

function groupByParent(rows: DevicesTreeRow[]): Map<string, DevicesTreeRow[]> {
  const map = new Map<string, DevicesTreeRow[]>();
  for (const row of rows) {
    const key = row.parentId ?? "";
    const bucket = map.get(key);
    if (bucket) {
      bucket.push(row);
    } else {
      map.set(key, [row]);
    }
  }
  return map;
}

function rowKey(row: DevicesTreeRow): string {
  return row.rowId != null ? String(row.rowId) : "";
}

function splitDescription(raw: string | null): string[] | undefined {
  return raw
    ?.split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function toMegaProduct(row: DevicesTreeRow): GnbMegaProduct {
  const fallbackId =
    row.productId != null ? `product-${row.productId}` : `product-${row.rowId ?? ""}`;
  return {
    id: row.productSlug || fallbackId,
    title: row.productTitle ?? "",
    subtitle: row.productDescription ?? "",
    image: resolveProductImage(row.productImage),
    href: withCategoryContext(
      row.productSlug && row.productId != null
        ? contentDetailPath("/product", row.productId, row.productSlug)
        : "",
      row.parentId,
    ),
  };
}

export const fetchDevicesMegaMenu = cache(async (): Promise<GnbDevicesMegaMenu> => {
  const rows = await fetchDevicesTreeRows();

  const depth1Rows = rows.filter((row) => row.depth === "1");
  const depth2ByParent = groupByParent(rows.filter((row) => row.depth === "2"));
  const depth3ByParent = groupByParent(rows.filter((row) => row.depth === "3"));

  const categories: GnbMegaDepth2[] = depth1Rows.map((top) => {
    const childRows = depth2ByParent.get(rowKey(top)) ?? [];

    const children: GnbMegaDepth3[] = childRows.map((child) => {
      const productRows = depth3ByParent.get(rowKey(child)) ?? [];
      return {
        id: child.categorySlug || rowKey(child),
        categoryId: child.rowId,
        label: child.categoryTitle ?? "",
        panelTitle: child.categoryTitle ?? "",
        description: splitDescription(child.categoryDescription),
        href: withCategoryContext(
          child.categorySlug && child.rowId != null
            ? contentDetailPath("/product-range", child.rowId, child.categorySlug)
            : "",
          child.rowId,
        ),
        product: productRows.map(toMegaProduct),
      };
    });

    return {
      id: top.categorySlug || rowKey(top),
      label: top.categoryTitle ?? "",
      href:
        top.categorySlug && top.rowId != null
          ? contentDetailPath("/product-category", top.rowId, top.categorySlug)
          : "",
      children,
    };
  });

  return {
    type: "devices",
    panelId: GNB_MEGA_PANEL_ID.devices,
    categories,
  };
});
