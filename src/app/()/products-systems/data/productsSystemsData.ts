import { fetchApi } from "@/lib/api";
import { fetchData } from "@/lib/pageDataApi";
import { flattenPageDataItem } from "@/lib/pageData";
import type { CommonFaqEntry } from "@/components/faq/CommonFaq";
import {
  fetchDevicesTreeRows,
  type DevicesTreeRow,
} from "@/data/gnb/devicesTree";
import { withCategoryContext } from "@/lib/navigation/categoryContext";
import { contentDetailPath } from "@/lib/contentDetailPath";
import type { ProductOtherItem } from "./productDetailContent";
import type { DevicesProductItem } from "./motorControlContent";
import type { DevicesCategoryProduct } from "./vfdContent";

export const PRODUCTS_SYSTEMS_PLACEHOLDER = "/img/main/product_01.webp";

export function resolveFirstImageUrl(value: unknown): string | null {
  if (Array.isArray(value) && value.length > 0) {
    const id = value[0];
    if (id !== null && id !== undefined && id !== "") {
      return `/api/v1/fo/page-files/${id}`;
    }
  }
  return null;
}

export function resolveImageUrlFromJsonText(value: string | null): string | null {
  if (!value) return null;
  try {
    return resolveFirstImageUrl(JSON.parse(value));
  } catch {
    return null;
  }
}

export interface CategoryRow {
  id: number;
  code: string;
  title: string;
  description: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  image: number[];
}

function toCategoryRow(row: Record<string, unknown>, slug: string): CategoryRow {
  return {
    id: Number(row._id),
    code: String(row["category.code"] ?? ""),
    title: (row["category.title"] as string) ?? "",
    description: (row["device_systems.description"] as string) ?? "",
    slug: (row["seo.slug"] as string) ?? slug,
    metaTitle: (row["seo.meta_title"] as string) ?? "",
    metaDescription: (row["seo.meta_description"] as string) ?? "",
    image: Array.isArray(row["device_systems.image"])
        ? (row["device_systems.image"] as number[])
        : [],
  };
}

async function fetchCategoryById(
  categoryId: number,
): Promise<Record<string, unknown> | null> {
  try {
    return await fetchData<Record<string, unknown>>({
      slug: "category-data",
      id: categoryId,
      리턴함수: (raw) => flattenPageDataItem(raw),
    });
  } catch {
    return null;
  }
}

export async function fetchCategoryBySlug(
  slug: string,
  opts?: { depth?: number; categoryId?: number },
): Promise<CategoryRow | null> {
  try {
    if (opts?.categoryId !== undefined) {
      const row = await fetchCategoryById(opts.categoryId);
      const slugMatched = row?.["seo.slug"] === slug;
      const depthMatched =
        opts.depth === undefined ||
        row?.["category.depth"] === String(opts.depth);
      if (row && slugMatched && depthMatched) return toCategoryRow(row, slug);
    }

    const where: Record<string, string> = { "eq_seo.slug": slug };
    if (opts?.depth !== undefined) where["eq_category.depth"] = String(opts.depth);
    const res = await fetchData<Record<string, unknown>>({
      slug: "category-data",
      where,
      size: 1,
      리턴함수: (rows) => rows.map((item) => flattenPageDataItem(item)),
    });
    const row = res.content[0] ?? null;
    if (!row) return null;
    return toCategoryRow(row, slug);
  } catch {
    return null;
  }
}

export interface CategoryChild {
  id: number;
  code: string;
  title: string;
  image: string | null;
  slug: string;
}

export async function fetchCategoryChildren(
  parentId: number,
): Promise<CategoryChild[]> {
  try {
    const res = await fetchData<Record<string, unknown>>({
      slug: "category-data",
      where: { "eq_category.parentId": String(parentId) },
      unpaged: true,
      리턴함수: (rows) => rows.map((item) => flattenPageDataItem(item)),
    });
    const mapped = res.content.map((row) => ({
      id: Number(row._id),
      code: String(row["category.code"] ?? ""),
      title: (row["category.title"] as string) ?? "",
      image: resolveFirstImageUrl(row["device_systems.image"]),
      slug: (row["seo.slug"] as string) ?? "",
      sortOrder: Number(row["sortOrder"] ?? 0),
    }));
    mapped.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
    return mapped.map(({ sortOrder: _sortOrder, ...rest }) => rest);
  } catch {
    return [];
  }
}

export interface CategoryByCode {
  id: number;
  code: string;
  slug: string;
}

export async function fetchCategoriesByCode(
  codes: string[],
): Promise<Map<string, CategoryByCode>> {
  const map = new Map<string, CategoryByCode>();
  const uniqueCodes = [...new Set(codes)];
  if (uniqueCodes.length === 0) return map;

  try {
    const res = await fetchData<Record<string, unknown>>({
      slug: "category-data",
      where: { "in_category.code": uniqueCodes.join(",") },
      unpaged: true,
      리턴함수: (rows) => rows.map((item) => flattenPageDataItem(item)),
    });
    for (const row of res.content) {
      const code = row["category.code"] as string | undefined;
      const slug = (row["seo.slug"] as string) ?? "";
      const id = Number(row._id);
      if (code && slug && Number.isFinite(id)) {
        map.set(code, { id, code, slug });
      }
    }
  } catch {
    return map;
  }
  return map;
}

interface CategoryLv2Row {
  id: number;
  title: string;
  slug: string;
  image: string | null;
}

export async function fetchVisibleLv2Categories(
  categoryId: number,
): Promise<DevicesProductItem[]> {
  try {
    const rows = await fetchApi<CategoryLv2Row[]>(
      `/api/v1/fo/categories/${categoryId}/lv2`,
    );
    return rows.map((row) => ({
      id: String(row.id),
      href: withCategoryContext(
        row.slug ? contentDetailPath("/product-range", row.id, row.slug) : "",
        row.id,
      ),
      image: resolveImageUrlFromJsonText(row.image),
      title: row.title ?? "",
    }));
  } catch {
    return [];
  }
}

interface CategoryProductRow {
  id: number;
  productName: string | null;
  image: string | null;
  infoDescription: string | null;
  slug: string | null;
  awards: string | null;
}

export async function fetchCategoryLv2Products(
  categoryId: number,
): Promise<DevicesCategoryProduct[]> {
  try {
    const rows = await fetchApi<CategoryProductRow[]>(
      `/api/v1/fo/categories/${categoryId}/products`,
    );
    return rows.map((row) => ({
      id: String(row.id),
      href: withCategoryContext(
        row.slug ? contentDetailPath("/product", row.id, row.slug) : "",
        categoryId,
      ),
      image: resolveImageUrlFromJsonText(row.image),
      title: row.productName ?? "",
      description: row.infoDescription ?? "",
      badges: row.awards === "01" ? (2 as const) : undefined,
    }));
  } catch {
    return [];
  }
}

export interface TopCategory {
  id: number;
  code: string;
  title: string;
  slug: string;
}

export async function fetchTopCategories(): Promise<TopCategory[]> {
  try {
    const res = await fetchData<Record<string, unknown>>({
      slug: "category-data",
      where: { "eq_category.depth": "1" },
      unpaged: true,
      리턴함수: (rows) => rows.map((item) => flattenPageDataItem(item)),
    });
    const mapped = res.content.map((row) => ({
      id: Number(row._id),
      code: String(row["category.code"] ?? ""),
      title: (row["category.title"] as string) ?? "",
      slug: (row["seo.slug"] as string) ?? "",
      sortOrder: Number(row["sortOrder"] ?? 0),
    }));
    mapped.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
    return mapped.map(({ sortOrder: _sortOrder, ...rest }) => rest);
  } catch {
    return [];
  }
}

export interface TopCategoriesWithChildren {
  tops: TopCategory[];
  childrenByParentId: Map<number, CategoryChild[]>;
}

export async function fetchTopCategoriesWithChildren(): Promise<TopCategoriesWithChildren> {
  try {
    const res = await fetchData<Record<string, unknown>>({
      slug: "category-data",
      where: { "in_category.depth": "1,2" },
      unpaged: true,
      리턴함수: (rows) => rows.map((item) => flattenPageDataItem(item)),
    });

    const mappedTops = res.content
      .filter((row) => row["category.depth"] === "1")
      .map((row) => ({
        id: Number(row._id),
        code: String(row["category.code"] ?? ""),
        title: (row["category.title"] as string) ?? "",
        slug: (row["seo.slug"] as string) ?? "",
        sortOrder: Number(row["sortOrder"] ?? 0),
      }));
    mappedTops.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
    const tops = mappedTops.map(({ sortOrder: _sortOrder, ...rest }) => rest);

    const topIds = new Set(tops.map((top) => top.id));
    const grouped = new Map<number, CategoryChild[]>();
    for (const id of topIds) grouped.set(id, []);

    const buckets = new Map<number, Array<CategoryChild & { sortOrder: number }>>();
    for (const row of res.content) {
      if (row["category.depth"] !== "2") continue;
      const parentId = Number(row["category.parentId"]);
      if (!topIds.has(parentId)) continue;
      const bucket = buckets.get(parentId) ?? [];
      bucket.push({
        id: Number(row._id),
        code: String(row["category.code"] ?? ""),
        title: (row["category.title"] as string) ?? "",
        image: resolveFirstImageUrl(row["device_systems.image"]),
        slug: (row["seo.slug"] as string) ?? "",
        sortOrder: Number(row["sortOrder"] ?? 0),
      });
      buckets.set(parentId, bucket);
    }

    for (const [parentId, bucket] of buckets) {
      bucket.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
      grouped.set(
        parentId,
        bucket.map(({ sortOrder: _sortOrder, ...rest }) => rest),
      );
    }

    return { tops, childrenByParentId: grouped };
  } catch {
    return { tops: [], childrenByParentId: new Map() };
  }
}

export interface CategoryProductCard {
  id: number;
  title: string;
  description: string;
  image: string | null;
  slug: string;
}

interface CategoryProductCardWithCode extends CategoryProductCard {
  code: string;
}

export async function fetchAllVisibleProducts(): Promise<
  CategoryProductCardWithCode[]
> {
  try {
    const res = await fetchData<Record<string, unknown>>({
      slug: "product-data",
      where: { "eq_product.is_visible": "001" },
      unpaged: true,
      리턴함수: (rows) => rows.map((item) => flattenPageDataItem(item)),
    });
    const products = res.content.map((row) => ({
      id: Number(row._id),
      code: String(row["product.product_code"] ?? ""),
      title: (row["product.product_name"] as string) ?? "",
      description: (row["product_info.info_description"] as string) ?? "",
      image: resolveFirstImageUrl(row["product_info.image"]),
      slug: (row["seo.slug"] as string) ?? "",
    }));
    products.sort((a, b) => a.code.localeCompare(b.code));
    return products;
  } catch {
    return [];
  }
}

export function filterProductsByCodePrefix(
  products: CategoryProductCardWithCode[],
  prefix: string,
): CategoryProductCard[] {
  return products
    .filter((p) => p.code.startsWith(prefix))
    .map(({ code: _code, ...rest }) => rest);
}

export async function fetchProductsByCodePrefix(
  prefix: string,
): Promise<CategoryProductCard[]> {
  const all = await fetchAllVisibleProducts();
  return filterProductsByCodePrefix(all, prefix);
}

export const SW_PRODUCT_SLUGS = [
  "scada",
  "xems",
  "micro-grid",
  "smart-factory",
] as const;

export async function fetchProductDetailById(
  productId: number,
): Promise<Record<string, unknown> | null> {
  try {
    return await fetchData<Record<string, unknown>>({
      slug: "product-data",
      id: productId,
      리턴함수: (raw) => flattenPageDataItem(raw),
    });
  } catch {
    return null;
  }
}

export interface ProductSeoRow {
  metaTitle: string;
  metaDescription: string;
}

function toProductSeoRow(row: Record<string, unknown>): ProductSeoRow {
  return {
    metaTitle: (row["seo.meta_title"] as string) ?? "",
    metaDescription: (row["seo.meta_description"] as string) ?? "",
  };
}

export async function fetchProductSeoById(
  id: number,
): Promise<ProductSeoRow | null> {
  const row = await fetchProductDetailById(id);
  return row ? toProductSeoRow(row) : null;
}

function lv2IdOfProductIdInRows(
  rows: DevicesTreeRow[],
  productId: number,
): number | null {
  const matched = rows.find(
    (r) => r.depth === "3" && r.productId === productId && r.parentId,
  );
  const parentId = Number(matched?.parentId);
  return Number.isInteger(parentId) && parentId > 0 ? parentId : null;
}

async function resolveLv2IdOfProductId(productId: number): Promise<number | null> {
  return lv2IdOfProductIdInRows(await fetchDevicesTreeRows(), productId);
}

export async function resolveFallbackCategoryId(
  pathname: string,
): Promise<number | null> {
  try {
    const rangeMatch = pathname.match(/^\/product-range\/(\d+)\/([^/]+)$/);
    if (rangeMatch) {
      const id = Number(rangeMatch[1]);
      const slug = decodeURIComponent(rangeMatch[2]);
      const category = await fetchCategoryBySlug(slug, {
        depth: 2,
        categoryId: id,
      });
      if (category && category.id === id) return category.id;
      return await resolveLv2IdOfProductId(id);
    }

    const productMatch = pathname.match(/^\/product\/(\d+)\/[^/]+$/);
    if (productMatch) {
      return await resolveLv2IdOfProductId(Number(productMatch[1]));
    }

    return null;
  } catch {
    return null;
  }
}

export interface HwProductData {
  name: string;
  description: string;
  image: string | null;
  specs: { title: string; content: string }[];
  keyFeatures: { title: string; content: string }[];
  video: string;
  connectPortal: string;
  lineUp: string;
  awards: string;
}

export function mapHwProductData(row: Record<string, unknown>): HwProductData {
  const str = (key: string) => (row[key] as string) ?? "";
  const specs = [1, 2, 3, 4]
    .map((n) => ({
      title: str(`product_spec${n}.spec${n}_title`),
      content: str(`product_spec${n}.spec${n}_content`),
    }))
    .filter((s) => s.title || s.content);
  const keyFeatures = [1, 2, 3, 4]
    .map((n) => ({
      title: str(`key_feature${n}.key${n}_title`),
      content: str(`key_feature${n}.key${n}_content`),
    }))
    .filter((f) => f.title || f.content);
  return {
    name: str("product.product_name"),
    description: str("product.product_description"),
    image: resolveFirstImageUrl(row["product_info.image"]),
    specs,
    keyFeatures,
    video: str("product_etc.video"),
    connectPortal: str("product_etc.connect_portal"),
    lineUp: str("product_etc.line_up"),
    awards: str("product.awards"),
  };
}

export async function fetchProductFaqItems(
  productId: number,
): Promise<CommonFaqEntry[]> {
  try {
    const res = await fetchData<CommonFaqEntry>({
      slug: "faq-data",
      where: {
        eq_main_category: "001",
        eq_product: String(productId),
        eq_is_visible: "001",
      },
      sort: "id,asc",
      size: 100,
      리턴함수: (rows) =>
        rows.map((item) => {
          const row = flattenPageDataItem(item);
          return {
            question: (row.question as string) ?? "",
            answer: (row.answer as string) ?? "",
          };
        }),
    });
    return res.content;
  } catch {
    return [];
  }
}

export async function fetchProductManagerEmail(productId: number): Promise<string> {
  try {
    const res = await fetchApi<{ email: string | null }>(
      `/api/v1/fo/products/${productId}/manager-email`,
    );
    return res.email ?? "";
  } catch {
    return "";
  }
}

function collectProductLv2Ids(
  rows: DevicesTreeRow[],
  currentProductId: number,
): Set<string> {
  return new Set(
    rows
      .filter((r) => r.depth === "3" && r.productId === currentProductId)
      .map((r) => r.parentId)
      .filter((p): p is string => p != null && p !== ""),
  );
}

interface SwRelevantProductRow {
  id: number;
  title: string | null;
  slug: string | null;
  image: string | null;
  awards: string | null;
  /** "LV2"(카테고리 자신, 대표이미지) | "LV3"(특정 제품) — attribute01 코드 세그먼트 수 기준 */
  level: "LV2" | "LV3" | null;
}

export async function fetchSwRelevantProducts(
  slug: string,
): Promise<ProductOtherItem[]> {
  try {
    const rows = await fetchApi<SwRelevantProductRow[]>(
      `/api/v1/fo/products/${slug}/relevant-products`,
    );
    return rows.map((r) => ({
      id: r.slug || `product-${r.id}`,
      href: r.slug
        ? r.level === "LV2"
          ? contentDetailPath("/product-range", r.id, r.slug)
          : contentDetailPath("/product", r.id, r.slug)
        : "",
      image: resolveImageUrlFromJsonText(r.image) ?? "",
      title: r.title ?? "",
      subtitle: "",
      badge: r.awards === "01",
    }));
  } catch {
    return [];
  }
}

export interface ProductLv2Context {
  lv2Id: number | null;
  lv2Name: string;
  lv2Slug: string;
  lv1Id: number | null;
  lv1Name: string;
  lv1Slug: string;
  otherProducts: ProductOtherItem[];
}

export async function fetchProductLv2Context(
  currentProductId: number,
  preferredLv2Id?: number,
): Promise<ProductLv2Context> {
  const empty: ProductLv2Context = {
    lv2Id: null,
    lv2Name: "",
    lv2Slug: "",
    lv1Id: null,
    lv1Name: "",
    lv1Slug: "",
    otherProducts: [],
  };
  try {
    const rows = await fetchDevicesTreeRows();
    const depth3 = rows.filter((r) => r.depth === "3");
    const myLv2 = collectProductLv2Ids(rows, currentProductId);
    if (myLv2.size === 0) return empty;

    const lv2Row =
      (preferredLv2Id != null && myLv2.has(String(preferredLv2Id))
        ? rows.find(
            (r) => r.depth === "2" && String(r.rowId) === String(preferredLv2Id),
          )
        : undefined) ??
      rows.find(
        (r) => r.depth === "2" && r.rowId != null && myLv2.has(String(r.rowId)),
      );
    const lv2Id = lv2Row?.rowId ?? null;
    const lv2Name = lv2Row?.categoryTitle ?? "";
    const lv2Slug = lv2Row?.categorySlug ?? "";
    const lv1Row = lv2Row
      ? rows.find(
          (r) =>
            r.depth === "1" &&
            r.rowId != null &&
            String(r.rowId) === lv2Row.parentId,
        )
      : undefined;
    const lv1Id = lv1Row?.rowId ?? null;
    const lv1Name = lv1Row?.categoryTitle ?? "";
    const lv1Slug = lv1Row?.categorySlug ?? "";

    const seen = new Set<number>();
    const otherProducts: ProductOtherItem[] = [];
    for (const r of depth3) {
      if (r.productId == null || r.productId === currentProductId) continue;
      if (r.parentId == null || !myLv2.has(r.parentId)) continue;
      if (seen.has(r.productId)) continue;
      seen.add(r.productId);
      otherProducts.push({
        id: r.productSlug || `product-${r.productId}`,
        href: withCategoryContext(
          r.productSlug
            ? contentDetailPath("/product", r.productId, r.productSlug)
            : "",
          r.parentId,
        ),
        image: resolveImageUrlFromJsonText(r.productImage) ?? "",
        title: r.productTitle ?? "",
        subtitle: r.productDescription ?? "",
      });
    }
    return { lv2Id, lv2Name, lv2Slug, lv1Id, lv1Name, lv1Slug, otherProducts };
  } catch {
    return empty;
  }
}
