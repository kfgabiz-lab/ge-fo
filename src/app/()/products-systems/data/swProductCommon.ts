import type { ProductNavItem } from "../components/product/DevicesProductNav";
import {
  metasolMsOtherProductsSubtitle,
  type ProductOtherItem,
} from "./productDetailContent";

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

const SW_PRODUCT_OTHER_PRODUCT_SUBTITLE = metasolMsOtherProductsSubtitle;

export const SW_PRODUCT_OTHER_PRODUCTS: ProductOtherItem[] = [
  {
    id: "sw-op-1",
    href: "/product/metasol-ms",
    image: "/img/devices-systems/products/other/product_other_metasol_ms.png",
    title: "Metasol MS",
    subtitle: SW_PRODUCT_OTHER_PRODUCT_SUBTITLE,
  },
  {
    id: "sw-op-2",
    href: "/product/susol-ul-smart-mccb",
    image: "/img/devices-systems/products/other/product_other_mcb.png",
    title: "Miniature circuit breaker",
    subtitle: SW_PRODUCT_OTHER_PRODUCT_SUBTITLE,
  },
  {
    id: "sw-op-3",
    href: "",
    image: "/img/devices-systems/products/other/product_other_metasol_mms.png",
    title: "Metasol MMS",
    subtitle: SW_PRODUCT_OTHER_PRODUCT_SUBTITLE,
    badges: 2,
  },
  {
    id: "sw-op-4",
    href: "/product/susol-ul-smart-mccb",
    image: "/img/devices-systems/products/other/product_other_susol_ul_mccb.png",
    title: "Susol UL MCCB",
    subtitle: SW_PRODUCT_OTHER_PRODUCT_SUBTITLE,
  },
  {
    id: "sw-op-5",
    href: "",
    image: "/img/devices-systems/products/other/product_other_metasol_ms.png",
    title: "Magnetic Contactor",
    subtitle: SW_PRODUCT_OTHER_PRODUCT_SUBTITLE,
  },
  {
    id: "sw-op-6",
    href: "",
    image: "/img/devices-systems/products/other/product_other_metasol_ms.png",
    title: "Overload Relay",
    subtitle: SW_PRODUCT_OTHER_PRODUCT_SUBTITLE,
  },
];
