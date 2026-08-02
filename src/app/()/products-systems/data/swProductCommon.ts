import type { ProductNavItem } from "../components/product/DevicesProductNav";

export const SW_PRODUCT_OTHER_PRODUCTS_TITLE = "Relevant Products";

export const SW_PRODUCT_NAV_ITEMS: readonly ProductNavItem[] = [
  { id: "product-overview", label: "Overview" },
  { id: "product-benefits", label: "Key Features" },
  { id: "product-applications", label: "Applications" },
  { id: "product-why", label: "Why" },
  { id: "product-downloads", label: "Downloads" },
  { id: "product-other", label: SW_PRODUCT_OTHER_PRODUCTS_TITLE },
  { id: "product-markets", label: "Markets" },
  { id: "product-help", label: "Help" },
];
