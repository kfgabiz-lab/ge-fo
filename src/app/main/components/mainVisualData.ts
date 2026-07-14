// 메인 히어로 영역(VideoSwiper / BannerSwiper) 데이터 조회 헬퍼
// - 서버 컴포넌트(MainVisual)에서 호출하여 결과를 각 클라이언트 컴포넌트에 props 로 전달
// - 설계 문서: fo/docs/dev/main/video-swiper.md, fo/docs/dev/main/banner-swiper.md
import { fetchApi } from "@/lib/api";
import { flattenPageDataItem, type PageDataItem } from "@/lib/pageData";

// bo-api page-data 응답(Spring Data Page) 공통 형태
interface PageDataResponse {
  content: PageDataItem[];
}

// ---------------- hero-data (VideoSwiper) ----------------

// 화면 바인딩에 실제 사용하는 히어로 항목(텍스트/링크 + 대표 미디어ID)
export interface HeroItem {
  id: number;
  sub: string;
  titleText: string;
  btnUrl: string;
  btnText: string;
  orderNo: string;
  // content 배열의 첫 요소(대표 미디어ID). 없으면 null → 정적 목업 유지
  mediaId: number | null;
}

// orderNo 오름차순 정렬용 캐스팅: 빈 문자열/비숫자는 맨 뒤(Infinity)
function orderNoValue(orderNo: string): number {
  if (orderNo === "") return Number.POSITIVE_INFINITY;
  const n = Number(orderNo);
  return Number.isNaN(n) ? Number.POSITIVE_INFINITY : n;
}

export async function fetchHeroItems(): Promise<HeroItem[]> {
  const res = await fetchApi<PageDataResponse>(
    "/api/v1/fo/page-data/hero-data?drs_postDate=in_range&sort=heroForm.orderNo,asc&size=100",
  );

  const items: HeroItem[] = (res.content ?? []).map((item) => {
    // flattenPageDataItem: heroForm 섹션 1개(중복 없음) → sub/titleText/btnUrl/btnText/orderNo/content가 root로 flat 병합됨
    const row = flattenPageDataItem(item);
    const contentArr = row.content;
    // content 배열의 첫 요소를 대표 미디어ID로 사용(비어있으면 null)
    const mediaId =
      Array.isArray(contentArr) && contentArr.length > 0
        ? (contentArr[0] as number)
        : null;
    return {
      id: item.id,
      sub: (row.sub as string) ?? "",
      titleText: (row.titleText as string) ?? "",
      btnUrl: (row.btnUrl as string) ?? "",
      btnText: (row.btnText as string) ?? "",
      orderNo: (row.orderNo as string) ?? "",
      mediaId,
    };
  });

  // FE 후처리(BE 문자열 정렬 "10"<"2" 오정렬·빈값 처리 보정):
  //  1) orderNo 숫자 오름차순, 빈 값/비숫자는 맨 뒤
  //  2) tie-breaker: orderNo 동일 시 id ASC
  items.sort((a, b) => {
    const av = orderNoValue(a.orderNo);
    const bv = orderNoValue(b.orderNo);
    if (av !== bv) return av - bv;
    return a.id - b.id;
  });

  return items;
}

// ---------------- banner-data (BannerSwiper) ----------------

// 화면 바인딩에 실제 사용하는 배너 항목(텍스트/링크 + 대표 미디어ID)
export interface BannerItem {
  id: number;
  url: string;
  mainTitle: string;
  subTitle: string;
  sortOrder: string;
  // image 배열의 첫 요소(대표 미디어ID). 없으면 null → 정적 목업 유지
  mediaId: number | null;
}

function sortOrderValue(sortOrder: string): number {
  if (sortOrder === "") return Number.POSITIVE_INFINITY;
  const n = Number(sortOrder);
  return Number.isNaN(n) ? Number.POSITIVE_INFINITY : n;
}

export async function fetchBannerItems(): Promise<BannerItem[]> {
  const res = await fetchApi<PageDataResponse>(
    "/api/v1/fo/page-data/banner-data?eq_bannerPosition=HERO&eq_isVisible=001&sort=bannerForm.sortOrder,asc&size=100",
  );

  const items: BannerItem[] = (res.content ?? []).map((item) => {
    // flattenPageDataItem: bannerForm 섹션 1개(중복 없음) → url/mainTitle/subTitle/sortOrder/image가 root로 flat 병합됨
    const row = flattenPageDataItem(item);
    const imageArr = row.image;
    // image 배열의 첫 요소를 대표 미디어ID로 사용(비어있으면 null)
    const mediaId =
      Array.isArray(imageArr) && imageArr.length > 0
        ? (imageArr[0] as number)
        : null;
    return {
      id: item.id,
      url: (row.url as string) ?? "",
      mainTitle: (row.mainTitle as string) ?? "",
      subTitle: (row.subTitle as string) ?? "",
      sortOrder: (row.sortOrder as string) ?? "",
      mediaId,
    };
  });

  // 설계 문서(banner-swiper.md 4절): sortOrder ASC, tie-breaker id ASC
  //  현재 실데이터가 둘 다 sortOrder=1 로 tie 이므로 id ASC 보정이 실제로 필요
  items.sort((a, b) => {
    const av = sortOrderValue(a.sortOrder);
    const bv = sortOrderValue(b.sortOrder);
    if (av !== bv) return av - bv;
    return a.id - b.id;
  });

  return items;
}

// ---------------- banner-data (Main Notic 공지) ----------------
// 설계 문서: fo/docs/dev/main/banner-data-information.md
// - HERO 배너와 동일 slug(banner-data), where 조건으로 INFORMATION 위치만 구분
// - 다건 조회이나 size=1 + updatedAt DESC 로 최신 1건만 노출(단건 구조)

// 코드그룹 조회 응답 항목(GET /api/v1/fo/codes/BANNER_PREFIX)
interface CodeItem {
  code: string;
  name: string;
}

// 화면 바인딩에 사용하는 공지 항목(prefix 코드→라벨 변환 완료 상태)
export interface NoticeItem {
  // BANNER_PREFIX 코드→라벨 변환 결과(예: "001" → "뉴스레터")
  prefixLabel: string;
  bottomText: string;
  url: string;
}

export async function fetchNoticeItem(): Promise<NoticeItem | null> {
  // 공지 배너(최신 1건) + prefix 코드목록을 병렬 조회
  const [bannerRes, codes] = await Promise.all([
    fetchApi<PageDataResponse>(
      "/api/v1/fo/page-data/banner-data?eq_bannerPosition=INFORMATION&eq_isVisible=001&sort=updatedAt,desc&size=1",
    ),
    fetchApi<CodeItem[]>("/api/v1/fo/codes/BANNER_PREFIX"),
  ]);

  // 조건 매칭 0건이면 null → 호출부(MainVisual)에서 정적 목업으로 폴백
  const item = bannerRes.content?.[0];
  if (!item) return null;

  // flattenPageDataItem: bannerForm 섹션 1개(중복 없음) → url/prefix/bottomText가 root로 flat 병합됨
  const row = flattenPageDataItem(item);
  const prefixCode = (row.prefix as string) ?? "";

  // 코드→라벨 맵 구성(code → name)
  const codeMap = new Map<string, string>(
    (codes ?? []).map((c) => [c.code, c.name]),
  );
  // 코드 매칭 실패 시 원본 코드값을 그대로 사용(빈 값보다 정보 손실이 적음).
  //  → 설계 문서 6.비고 2)의 "prefix가 '1'로 저장돼 '001'과 불일치" 케이스가 해당.
  const prefixLabel = codeMap.get(prefixCode) ?? prefixCode;

  return {
    prefixLabel,
    bottomText: (row.bottomText as string) ?? "",
    url: (row.url as string) ?? "",
  };
}
