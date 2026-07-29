import { emptyStateIconSrc } from "@/data/commonAssets";
import { formatPhoneDisplay } from "@/lib/formatPhone";
import { haversineMiles, type GeoCoord } from "@/lib/geo/distance";
import { fetchData } from "@/lib/pageDataApi";
import { flattenPageDataItem, type PageDataItem } from "@/lib/pageData";

/** 1 mile → meter 환산 상수(반경 Circle 오버레이 radius 계산용) */
export const MILES_TO_METERS = 1609.344;

/**
 * LS ELECTRIC America 본사(HQ) 고정 정보.
 * - 기획서(docs/dev/wheretobuy.png) 항목1·3: 지도 초기 중심이자, 검색 주소와 상관없이 항상 표기되는 고정 핀
 * - 좌표는 PageData 레코드(id 1837)의 실지오코딩 값. 본사는 대리점 데이터와 달리 DB 등록 여부에
 *   의존하면 안 되는 고정 정보라 FE 상수로 둔다(현재 DB에 본사 레코드 없음)
 * - **지도 전용** — 카드 목록/Total 카운트에는 포함하지 않는다
 */
export const whereToBuyHq = {
  name: "LS ELECTRIC America Inc.",
  address: "625 Heathrow Dr, Lincolnshire, IL 60069",
  lat: 42.1880235,
  lng: -87.9439671,
} as const;

/** 본사 핀 렌더 스펙 — 기존 pin-brand.svg 자산 재활용(기존 브랜드 마커와 동일 34x48) */
export const whereToBuyHqPin = {
  width: 34,
  height: 48,
  /** 대리점 마커(일반 1 / 활성 3)보다 항상 위에 오도록 */
  zIndex: 5,
} as const;

/**
 * 반경 Circle 오버레이 스타일(기획서 항목1·2·7의 반투명 파란 원).
 * 기획서 이미지 픽셀 실측 결과 채움색은 #1a73e8 계열(알파 약 0.3), 테두리는 같은 색 계열의 얇은 선.
 */
export const whereToBuyRadiusCircle = {
  strokeColor: "#1a73e8",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#1a73e8",
  fillOpacity: 0.25,
} as const;

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
  // 기획서 항목1: 지도 초기 로드 시 중심은 LSEA 본사. 반경필터 원점(검색 전) 기본값도 이 좌표를 공유한다.
  mapDefaultCenter: { lat: whereToBuyHq.lat, lng: whereToBuyHq.lng },
  mapDefaultZoom: 9,
  mapActiveZoom: 12,
} as const;

// 기획서 항목7: 검색 반경 필터 옵션 7종.
// ⚠️ [0]은 반드시 최대값(500mi) — 기본값·isFiltered 판정·영역검색 리셋·새로고침 초기화가 모두 [0]을 참조한다.
export const whereToBuyDistanceOptions = [
  { value: "500mi", label: "500mi" },
  { value: "250mi", label: "250mi" },
  { value: "100mi", label: "100mi" },
  { value: "50mi", label: "50mi" },
  { value: "25mi", label: "25mi" },
  { value: "10mi", label: "10mi" },
  { value: "5mi", label: "5mi" },
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
  phoneHref: string;
  lat: number;
  lng: number;
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
// agency 단일 섹션이라 flattenPageDataItem 후 필드가 root로 병합됨(agency_name/address/...)
export function toWhereToBuyLocation(item: PageDataItem): WhereToBuyLocation {
  const row = flattenPageDataItem(item);
  const address = (row.address as string) ?? "";
  const phone = (row.office_number as string) ?? "";
  const homepage = (row.homepage as string) ?? "";
  return {
    id: String(item.id),
    // badges는 소스에 없는 필드 — 신규 추가 금지. 빈 배열 고정(CSS display:none이라 화면 영향 없음)
    badges: [],
    name: (row.agency_name as string) ?? "",
    address,
    // 표시용 전화번호는 공통 함수로 미국식 3-3-4 정규화(입력 형식 혼재 방어). href 는 원본 숫자 기준 유지.
    phone: formatPhoneDisplay(phone),
    website: homepage,
    websiteLabel: homepage,
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
    where: { "eq_agency.is_visible": "001" },
    리턴함수: (rows) => rows.map(toWhereToBuyLocation),
  });
  return res.content;
}

// ---------------- 길찾기(Get Directions) URL ----------------
// 기획서 항목9: 현 위치 → 선택한 회사까지 구글맵 길찾기. 현 위치를 가져올 수 없으면 본사 주소를 출발점으로 사용.
// 출발지가 런타임 상태(브라우저 위치 허용 여부)에 의존하므로 정적 가공값이 아니라 렌더 시점에 생성한다.

const GOOGLE_MAPS_DIRECTIONS_BASE = "https://www.google.com/maps/dir/?api=1";

// 좌표가 유효하면 "lat,lng", 아니면 대체 주소 문자열을 구글맵 파라미터 값으로 사용
function toDirectionsPoint(
  coord: GeoCoord | null | undefined,
  fallbackAddress: string,
): string {
  if (coord && Number.isFinite(coord.lat) && Number.isFinite(coord.lng)) {
    return `${coord.lat},${coord.lng}`;
  }
  return fallbackAddress;
}

/**
 * 구글맵 길찾기 URL 생성.
 * @param location 목적지(대리점). 좌표가 유효하면 좌표, 없으면 주소 문자열로 방어
 * @param myLocation 이미 확보된 "내 위치" 좌표(브라우저 위치 권한 허용 시). null 이면 본사 주소를 출발지로 사용
 *                   — 링크 클릭만으로 새 위치권한 팝업을 띄우지 않기 위해, 이미 알고 있는 좌표만 재사용한다.
 */
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

// ---------------- 반경필터(거리계산) ----------------

// "500mi" → 500. 숫자 파싱 실패 시 0.
export function parseDistanceMiles(value: string): number {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * 원점(검색좌표/내위치/본사) 기준으로 선택 반경 내 지점만 필터링.
 * - 유효 좌표(hasValidCoords) 지점만 거리 계산 대상
 * - 결과는 가까운 순 정렬(기획서 항목10)
 * - 기획서 항목2/7 기준: 선택 반경 내 결과가 0건이면 그대로 빈 배열을 반환한다(더 큰 반경으로 자동확장하지 않음).
 *   지도에 그려지는 반경 원과 목록이 항상 일치해야 하기 때문.
 */
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

// ---------------- 영역(bounds)필터 — "이 지역에서 검색" 전용 ----------------
// 기존 반경필터(filterLocationsByRadius)와 상호배타적으로 쓰이는 필터.
// Google Maps 타입에 직접 의존하지 않도록 bounds 를 단순 객체로 받는다.

/** 지도 뷰포트 사각영역(위경도 경계). Google Maps LatLngBounds → 이 형태로 변환해 전달 */
export type WhereToBuyBoundsLiteral = {
  north: number;
  south: number;
  east: number;
  west: number;
};

// 영역의 기하학적 중심. 영역검색에는 별도 검색좌표가 없으므로 이 중심을 "검색 위치"로 간주해 정렬 원점으로 쓴다.
function boundsCenter(bounds: WhereToBuyBoundsLiteral): GeoCoord {
  return {
    lat: (bounds.north + bounds.south) / 2,
    lng: (bounds.east + bounds.west) / 2,
  };
}

/**
 * 지도 영역(bounds) 안에 좌표가 들어오는 지점만 필터링(포함 여부는 단순 범위 비교).
 * - 유효 좌표(hasValidCoords) 지점만 대상
 * - 미국 본토 도메인 기준이라 경도 역전(antimeridian 교차)은 고려하지 않는다(east > west 가정)
 * - 기획서 항목10에 맞춰 영역 중심 기준 가까운 순으로 정렬한다(반경검색과 동일한 정렬 규칙)
 */
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

/** Figma 3670:30719 (PC) · 6561:75390 (mobile View List) — 문구는 기획서 항목10 기준 */
export const whereToBuyEmptyContent = {
  title: "No results found. Try adjusting your filters or location.",
  iconSrc: emptyStateIconSrc,
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
