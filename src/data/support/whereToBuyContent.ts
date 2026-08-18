import { emptyStateIconSrc } from "@/data/commonAssets";
import { formatPhoneDisplay } from "@/lib/formatPhone";
import { haversineMiles, type GeoCoord } from "@/lib/geo/distance";
import { fetchData } from "@/lib/pageDataApi";
import { flattenPageDataItem, type PageDataItem } from "@/lib/pageData";

export const MILES_TO_METERS = 1609.344;

export const whereToBuyHq = {
  name: "LS ELECTRIC America Inc.",
  address: "625 Heathrow Dr, Lincolnshire, IL 60069",
  lat: 42.1880235,
  lng: -87.9439671,
} as const;

export const whereToBuyHqPin = {
  width: 34,
  height: 48,
  zIndex: 5,
} as const;

export const whereToBuyRadiusCircle = {
  strokeColor: "#1a73e8",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#1a73e8",
  fillOpacity: 0.25,
} as const;

export const whereToBuyPage = {
  title: "Where to Buy",
  description: "LS ELECTRIC America Sales Team and Distributors Around the U.S",
  searchPlaceholder: "Enter city, state, or ZIP code",
  useMyLocationLabel: "use my location",
  viewListLabel: "View List",
  viewMapLabel: "View Map",
  totalResults: 2658,
  mapPinImage: "/img/support/where-to-buy/pin.svg",
  mapBrandPinImage: "/img/support/where-to-buy/pin-brand.webp",
  mapDefaultCenter: { lat: whereToBuyHq.lat, lng: whereToBuyHq.lng },
  mapDefaultZoom: 9,
} as const;

export const whereToBuyDistanceOptions = [
  { value: "5mi", label: "5mi" },
  { value: "10mi", label: "10mi" },
  { value: "25mi", label: "25mi" },
  { value: "50mi", label: "50mi" },
  { value: "100mi", label: "100mi" },
  { value: "250mi", label: "250mi" },
  { value: "500mi", label: "500mi" },
] as const;

export const whereToBuyDefaultDistance = "500mi";

export const whereToBuyFilterLabels = {
  distance: "Distance",
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
  phoneHref: string;
  lat: number;
  lng: number;
};


function toPhoneHref(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return digits ? `tel:+${digits}` : "";
}

export function hasValidCoords(location: WhereToBuyLocation): boolean {
  return (
    Number.isFinite(location.lat) &&
    Number.isFinite(location.lng) &&
    location.lat !== 0 &&
    location.lng !== 0
  );
}

export function toWhereToBuyLocation(item: PageDataItem): WhereToBuyLocation {
  const row = flattenPageDataItem(item);
  const address = (row.address as string) ?? "";
  const phone = (row.office_number as string) ?? "";
  const homepage = (row.homepage as string) ?? "";
  return {
    id: String(item.id),
    badges: [],
    name: (row.agency_name as string) ?? "",
    address,
    phone: formatPhoneDisplay(phone),
    website: homepage,
    websiteLabel: homepage,
    phoneHref: toPhoneHref(phone),
    lat: Number(row.address_lat),
    lng: Number(row.address_lng),
  };
}

/** 노출여부(is_visible)는 bo-api가 wheretobuy-agency-data에 대해 서버측에서 항상 강제한다 — 클라이언트가 조건을 보낼 필요 없음 */
export async function fetchWhereToBuyLocations(): Promise<WhereToBuyLocation[]> {
  const res = await fetchData<WhereToBuyLocation>({
    slug: "wheretobuy-agency-data",
    size: 100,
    리턴함수: (rows) => rows.map(toWhereToBuyLocation),
  });
  return res.content;
}


const GOOGLE_MAPS_DIRECTIONS_BASE = "https://www.google.com/maps/dir/?api=1";

function toDirectionsPoint(
  coord: GeoCoord | null | undefined,
  fallbackAddress: string,
): string {
  if (coord && Number.isFinite(coord.lat) && Number.isFinite(coord.lng)) {
    return `${coord.lat},${coord.lng}`;
  }
  return fallbackAddress;
}

export function buildDirectionsHref(
  location: WhereToBuyLocation,
  myLocation: GeoCoord | null,
): string {
  const destination = toDirectionsPoint(
    hasValidCoords(location) ? { lat: location.lat, lng: location.lng } : null,
    location.address,
  );
  if (!destination) {
    return "";
  }
  const origin = toDirectionsPoint(myLocation, whereToBuyHq.address);
  return `${GOOGLE_MAPS_DIRECTIONS_BASE}&origin=${encodeURIComponent(
    origin,
  )}&destination=${encodeURIComponent(destination)}`;
}


export function parseDistanceMiles(value: string): number {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function filterLocationsByRadius(
  locations: WhereToBuyLocation[],
  origin: GeoCoord,
  selectedMiles: number,
): WhereToBuyLocation[] {
  return locations
    .filter(hasValidCoords)
    .map((location) => ({
      location,
      distance: haversineMiles(origin, {
        lat: location.lat,
        lng: location.lng,
      }),
    }))
    .filter((entry) => entry.distance <= selectedMiles)
    .sort((a, b) => a.distance - b.distance)
    .map((entry) => entry.location);
}


export function filterLocationsByText(
  locations: WhereToBuyLocation[],
  query: string,
): WhereToBuyLocation[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return [];
  }
  return locations.filter((location) =>
    location.address.toLowerCase().includes(needle),
  );
}

export type WhereToBuyBoundsLiteral = {
  north: number;
  south: number;
  east: number;
  west: number;
};

function boundsCenter(bounds: WhereToBuyBoundsLiteral): GeoCoord {
  return {
    lat: (bounds.north + bounds.south) / 2,
    lng: (bounds.east + bounds.west) / 2,
  };
}

export function filterLocationsByBounds(
  locations: WhereToBuyLocation[],
  bounds: WhereToBuyBoundsLiteral,
): WhereToBuyLocation[] {
  const center = boundsCenter(bounds);
  return locations
    .filter(
      (location) =>
        hasValidCoords(location) &&
        location.lat <= bounds.north &&
        location.lat >= bounds.south &&
        location.lng <= bounds.east &&
        location.lng >= bounds.west,
    )
    .map((location) => ({
      location,
      distance: haversineMiles(center, {
        lat: location.lat,
        lng: location.lng,
      }),
    }))
    .sort((a, b) => a.distance - b.distance)
    .map((entry) => entry.location);
}

export const whereToBuyEmptyContent = {
  title: "No results found",
  desc: "Try adjusting your filters or location.",
  viewAllLabel: "View All",
  iconSrc: emptyStateIconSrc,
} as const;

export const whereToBuyBanner = {
  backgroundImage: "/img/support/where-to-buy/banner.webp",
  backgroundImageMobile: "/img/support/where-to-buy/banner-mo.webp",
  title: "Finding the Right Place to Purchase?",
  description:
    "Our experts are ready to guide you to the right distribution channel.",
  ctaLabel: "Talk to an Expert",
  ctaHref: "/support/contact-us",
} as const;
