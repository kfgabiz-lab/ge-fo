export type DevicesCategoryProduct = {
  id: string;
  href: string;
  /** 실이미지 없으면 null — 렌더 쪽에서 이미지 영역 자체를 생략한다(플레이스홀더 미사용) */
  image: string | null;
  title: string;
  description: string;
  /**
   * Design Awards 배지 레벨 (기획서 product-lv2.png 9번). 1: type1(가로형 lg) · 2: type2(정사각 sm)
   * ProductOtherItem(productDetailContent.ts)과 동일한 퍼블리싱 컨벤션 — 데이터 계층에서 product.awards를
   * 이 값으로 변환하고, 카드는 공용 getProductBadgeType()으로 판정한다. 정적 템플릿은 미설정(undefined = 배지 없음).
   */
  badges?: 1 | 2;
};

export const vfdIntro = {
  parentLabel: "LV Automation",
  parentHref: "/product-range/variable-frequency-drive",
  title: "Variable Frequency Drive",
  description:
    "EMPR is an electronic motor protection relay used to protect low voltage motors by replacing thermal overload relays, also known a electronic overcurrent relays. EMPR is highly reliable by its accuracy and real-time data processing. LEDs on EMPR indicate status of a system, and there are models which provide display of load current, saving cause of failure, and communication functions.",
};

const productDescription =
  "UL Smart MCCB is a UL-certified molded case circuit breaker that provides reliable power protection along with real-time monitoring and...";

export const vfdProducts: DevicesCategoryProduct[] = [
  {
    id: "vfd-1",
    href: "/product/metasol-ms",
    image: "/img/main/product_01.jpg",
    title: "H100 Plus",
    description: productDescription,
  },
  {
    id: "vfd-2",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "SP100",
    description: productDescription,
  },
  {
    id: "vfd-3",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "G100",
    description: productDescription,
  },
  {
    id: "vfd-4",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "M100",
    description: productDescription,
  },
  {
    id: "vfd-5",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "S100",
    description: productDescription,
  },
  {
    id: "vfd-6",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "iS7",
    description: productDescription,
  },
];
