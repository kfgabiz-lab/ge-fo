import { emptyStateIconSrc } from "@/data/commonAssets";

/** Figma 5752:47179 — Where to Buy */
export const whereToBuyPage = {
  title: "Where to Buy",
  description: "LS ELECTRIC America Sales Team and Distributors Around the U.S",
  searchPlaceholder: "Enter city, state, or ZIP code",
  useMyLocationLabel: "use my location",
  totalResults: 2658,
  mapPinImage: "/img/support/where-to-buy/pin.png",
  mapBrandPinImage: "/img/support/where-to-buy/pin-brand.png",
  mapDefaultCenter: { lat: 41.95, lng: -88.15 },
  mapDefaultZoom: 9,
  mapActiveZoom: 12,
} as const;

export const whereToBuyDistanceOptions = [
  { value: "500mi", label: "500mi" },
  { value: "250mi", label: "250mi" },
  { value: "100mi", label: "100mi" },
  { value: "50mi", label: "50mi" },
] as const;

export const whereToBuyCategoryOptions = [
  { value: "all", label: "All" },
  { value: "distributor", label: "Distributor" },
  { value: "rep", label: "Rep" },
  { value: "sales", label: "Sales" },
] as const;

export const whereToBuyFilterLabels = {
  distance: "Distance",
  category: "Type of Business",
} as const;

export type WhereToBuyBadge = "Distributor" | "Rep" | "Sales";

export type WhereToBuyLocation = {
  id: string;
  badges: WhereToBuyBadge[];
  name: string;
  address: string;
  phone: string;
  website: string;
  websiteLabel: string;
  directionsHref: string;
  phoneHref: string;
  lat: number;
  lng: number;
  brandPin?: boolean;
};

export const whereToBuyLocations: WhereToBuyLocation[] = [
  {
    id: "marshall-wolf",
    badges: ["Distributor"],
    name: "MARSHALL WOLF AUTOMATION",
    address: "923 South Main Street 60102 Algonquin US",
    phone: "847-641-2324",
    website: "https://www.wolfautomation.com",
    websiteLabel: "https://www.wolfautomation.com",
    directionsHref: "https://maps.google.com/?q=923+South+Main+Street+Algonquin+US",
    phoneHref: "tel:+18476412324",
    lat: 42.1657,
    lng: -88.2947,
    brandPin: true,
  },
  {
    id: "goding-electric",
    badges: ["Rep"],
    name: "GODING ELECTRIC COMPANY",
    address: "686 E Fullerton Ave 60139 Glendale Heights US",
    phone: "630-858-7700",
    website: "http://www.goding.com",
    websiteLabel: "http://www.goding.com",
    directionsHref: "https://maps.google.com/?q=686+E+Fullerton+Ave+Glendale+Heights+US",
    phoneHref: "tel:+16308587700",
    lat: 41.9178,
    lng: -88.0767,
  },
  {
    id: "x-tronics",
    badges: ["Distributor", "Sales"],
    name: "X Tronics Inc.",
    address: "400 Creditstone Rd. Unit #3 L4K 3Z3 Concord",
    phone: "(905) 660-0555",
    website: "https://xtronics.ca/contact-us/",
    websiteLabel: "https://xtronics.ca/contact-us/",
    directionsHref: "https://maps.google.com/?q=400+Creditstone+Rd+Concord",
    phoneHref: "tel:+19056600555",
    lat: 43.8054,
    lng: -79.506,
  },
];

export const whereToBuyDefaultActiveId = "marshall-wolf";

/** Figma 3670:30719 — Where to Buy / No Data */
export const whereToBuyEmptyContent = {
  title: "There are no results",
  iconSrc: emptyStateIconSrc,
  viewAllLabel: "View All",
  viewAllHref: "/support/where-to-buy",
} as const;

/** Figma 5752:47255 — ## 02_Banner */
export const whereToBuyBanner = {
  backgroundImage: "/img/support/where-to-buy/banner.jpg",
  title: "Finding the Right Place to Purchase?",
  description:
    "Our experts are ready to guide you to the right distribution channel.",
  ctaLabel: "Talk to an Expert",
  ctaHref: "/support/contact-us",
} as const;
