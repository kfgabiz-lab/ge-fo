import { emptyStateIconSrc } from "@/data/commonAssets";
import { haversineMiles, type GeoCoord } from "@/lib/geo/distance";
import { fetchData } from "@/lib/pageDataApi";
import { flattenPageDataItem, type PageDataItem } from "@/lib/pageData";

/** Figma 5752:47179 — Where to Buy */
export const whereToBuyPage = {
  title: "Where to Buy",
  description: "LS ELECTRIC America Sales Team and Distributors Around the U.S",
  searchPlaceholder: "Enter city, state, or ZIP code",
  useMyLocationLabel: "use my location",
  viewListLabel: "View List",
  viewMapLabel: "View Map",
  totalResults: 2658,
  mapPinImage: "/img/support/where-to-buy/pin.svg",
  mapBrandPinImage: "/img/support/where-to-buy/pin-brand.svg",
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
  directionsHref: string;
  phoneHref: string;
  lat: number;
  lng: number;
  brandPin?: boolean;
};

// ---------------- PageData(slug: wheretobuy-agency-data) 실데이터 연동 ----------------
// 설계: STEP4 확정(신규 API 없음). 기존 FoPageDataController + PageDataService.search() 재사용
// 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// 조회는 공통계층 fetchData(@/lib/pageDataApi)의 목록 브랜치를 사용한다.
// - slug/where/size만 넘기면 URL 직렬화·fetchApi 경유·Page 응답 파싱을 공통계층이 처리
// - flatten/화면가공은 리턴함수(rows→toWhereToBuyLocation.map)로 위임(company 섹션과 동일 패턴)

// office_number → tel: 링크. 숫자만 남기고 앞에 + 를 붙인 형식(목데이터 형식 "tel:+18476412324" 참고)
function toPhoneHref(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return digits ? `tel:+${digits}` : "";
}

// 지도 렌더 전용 좌표 유효성 가드(STEP4 지적) — 0/빈값/NaN 좌표는 지도 마커·bounds 생성에서 제외
// (카드 목록에는 좌표 없어도 표시하므로 이 가드는 지도에서만 사용)
export function hasValidCoords(location: WhereToBuyLocation): boolean {
  return (
    Number.isFinite(location.lat) &&
    Number.isFinite(location.lng) &&
    location.lat !== 0 &&
    location.lng !== 0
  );
}

// API 원본 1건 → 화면 바인딩용 WhereToBuyLocation 가공
// agencyForm 단일 섹션이라 flattenPageDataItem 후 필드가 root로 병합됨(agency_name/address/...)
export function toWhereToBuyLocation(item: PageDataItem): WhereToBuyLocation {
  const row = flattenPageDataItem(item);
  const address = (row.address as string) ?? "";
  const phone = (row.office_number as string) ?? "";
  const homepage = (row.homepage as string) ?? "";
  return {
    id: String(item.id),
    // badges/brandPin은 소스에 없는 필드 — 신규 추가 금지. 빈 배열 고정(CSS display:none이라 화면 영향 없음)
    badges: [],
    name: (row.agency_name as string) ?? "",
    address,
    phone,
    website: homepage,
    websiteLabel: homepage,
    // 소스에 방향안내 URL 없음 — 주소 기반으로 FE 생성(기존 목데이터 패턴 유지)
    directionsHref: address
      ? `https://maps.google.com/?q=${encodeURIComponent(address)}`
      : "",
    phoneHref: toPhoneHref(phone),
    lat: Number(row.address_lat),
    lng: Number(row.address_lng),
  };
}

// 공개 대리점 목록 조회(정렬은 서버 기본값 그대로, 클라이언트 정렬 추가하지 않음)
// 공개(is_visible=001)만, size=100. 공통계층 fetchData 목록 브랜치로 조회.
export async function fetchWhereToBuyLocations(): Promise<WhereToBuyLocation[]> {
  const res = await fetchData<WhereToBuyLocation>({
    slug: "wheretobuy-agency-data",
    size: 100,
    where: { "eq_agencyForm.is_visible": "001" },
    리턴함수: (rows) => rows.map(toWhereToBuyLocation),
  });
  return res.content;
}

// ---------------- 반경필터(거리계산 + 자동확장) ----------------
// 기존 export 시그니처는 유지하고, 여기부터 신규 export 만 추가한다.

// "500mi" → 500. 숫자 파싱 실패 시 0.
export function parseDistanceMiles(value: string): number {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

// 자동확장 사다리(오름차순 mile) — 선택 반경에 결과가 없으면 다음(더 큰) 단계로 확장
const DISTANCE_LADDER_MILES = whereToBuyDistanceOptions
  .map((option) => parseDistanceMiles(option.value))
  .sort((a, b) => a - b);

/** 반경필터 결과: 필터된 지점 목록 + 실제 적용된 반경(mile) */
export type WhereToBuyRadiusResult = {
  locations: WhereToBuyLocation[];
  appliedMiles: number;
};

/**
 * 원점(검색좌표/내위치) 기준으로 선택 반경 내 지점만 필터링.
 * - 유효 좌표(hasValidCoords) 지점만 거리 계산 대상
 * - 결과는 가까운 순 정렬(store locator 관례)
 * - 선택 반경 내 결과가 0건이면 사다리상 더 큰 반경으로 자동확장(최대 옵션까지)
 */
export function filterLocationsByRadius(
  locations: WhereToBuyLocation[],
  origin: GeoCoord,
  selectedMiles: number,
): WhereToBuyRadiusResult {
  // 유효 좌표 지점에 원점까지 거리를 부여
  const withDistance = locations
    .filter(hasValidCoords)
    .map((location) => ({
      location,
      distance: haversineMiles(origin, {
        lat: location.lat,
        lng: location.lng,
      }),
    }));

  // 선택 반경 이상 후보들(오름차순). 후보가 없으면 선택값 자체를 사용
  const candidates = DISTANCE_LADDER_MILES.filter((mi) => mi >= selectedMiles);
  const ladder = candidates.length > 0 ? candidates : [selectedMiles];

  for (const miles of ladder) {
    const within = withDistance
      .filter((entry) => entry.distance <= miles)
      .sort((a, b) => a.distance - b.distance);
    if (within.length > 0) {
      return {
        locations: within.map((entry) => entry.location),
        appliedMiles: miles,
      };
    }
  }

  // 최대 반경까지도 결과가 없으면 빈 목록(적용 반경은 사다리 최댓값)
  return { locations: [], appliedMiles: ladder[ladder.length - 1] };
}

// ---------------- 영역(bounds)필터 — "이 지역에서 검색" 전용 ----------------
// 기존 반경필터(filterLocationsByRadius)와 상호배타적으로 쓰이는 신규 필터.
// Google Maps 타입에 직접 의존하지 않도록 bounds 를 단순 객체로 받는다.

/** 지도 뷰포트 사각영역(위경도 경계). Google Maps LatLngBounds → 이 형태로 변환해 전달 */
export type WhereToBuyBoundsLiteral = {
  north: number;
  south: number;
  east: number;
  west: number;
};

/**
 * 지도 영역(bounds) 안에 좌표가 들어오는 지점만 필터링(단순 범위 비교, haversine 불필요).
 * - 유효 좌표(hasValidCoords) 지점만 대상
 * - 미국 본토 도메인 기준이라 경도 역전(antimeridian 교차)은 고려하지 않는다(east > west 가정)
 */
export function filterLocationsByBounds(
  locations: WhereToBuyLocation[],
  bounds: WhereToBuyBoundsLiteral,
): WhereToBuyLocation[] {
  return locations.filter(
    (location) =>
      hasValidCoords(location) &&
      location.lat <= bounds.north &&
      location.lat >= bounds.south &&
      location.lng <= bounds.east &&
      location.lng >= bounds.west,
  );
}

/** Figma 3670:30719 (PC) · 6561:75390 (mobile View List) */
export const whereToBuyEmptyContent = {
  title: "There are no results",
  iconSrc: emptyStateIconSrc,
  viewAllLabel: "View All",
  viewAllHref: "/support/where-to-buy",
} as const;

/** Figma 5752:47255 — ## 02_Banner · 모바일 6561:74243 */
export const whereToBuyBanner = {
  backgroundImage: "/img/support/where-to-buy/banner.jpg",
  backgroundImageMobile: "/img/support/where-to-buy/banner-mo.jpg",
  title: "Finding the Right Place to Purchase?",
  description:
    "Our experts are ready to guide you to the right distribution channel.",
  ctaLabel: "Talk to an Expert",
  ctaHref: "/support/contact-us",
} as const;
