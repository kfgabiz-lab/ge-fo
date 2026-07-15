export type DevicesCategoryProduct = {
  id: string;
  href: string;
  image: string;
  title: string;
  description: string;
};

export const vfdIntro = {
  parentLabel: "LV Automation",
  parentHref: "/products-systems/lv-automation",
  title: "Variable Frequency Drive",
  description:
    "EMPR is an electronic motor protection relay used to protect low voltage motors by replacing thermal overload relays, also known a electronic overcurrent relays. EMPR is highly reliable by its accuracy and real-time data processing. LEDs on EMPR indicate status of a system, and there are models which provide display of load current, saving cause of failure, and communication functions.",
};

const productDescription =
  "UL Smart MCCB is a UL-certified molded case circuit breaker that provides reliable power protection along with real-time monitoring and...";

export const vfdProducts: DevicesCategoryProduct[] = [
  {
    id: "vfd-1",
    href: "/products-systems/motor-control/metasol-ms",
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
