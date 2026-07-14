"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import SwiperBarControls from "@/components/swiper/SwiperBarControls";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import TabButton from "@/components/ui/TabButton";
import ProductAwardBadge from "@/components/product/ProductAwardBadge";
import type {
  FoProductGroupItem,
  FoProductGroupResponse,
} from "./mainProductsData";
import "swiper/css";

// 이미지 미입력(null) 시 폴백 플레이스홀더 — 완전히 깨진 이미지 방지
const PRODUCT_IMAGE_FALLBACK = "/img/main/product_01.jpg";

// 화면 렌더링에 사용하는 정규화된 제품 카드 데이터
type ProductItem = {
  id: string;
  // slug 있으면 `/product/{slug}`, 없으면 "" (링크 비활성)
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  // awards 코드값 존재 여부 → ProductAwardBadge 노출 판단
  hasBadge: boolean;
};

// BE 응답(ms 1건)을 화면용 ProductItem 으로 정규화
function toProductItem(item: FoProductGroupItem): ProductItem {
  return {
    id: String(item.id),
    // slug null → 빈 문자열(링크 비활성). 존재 시 `/product/{slug}` 합성
    href: item.slug ? `/product/${item.slug}` : "",
    // image null → 플레이스홀더 폴백
    image: item.image ?? PRODUCT_IMAGE_FALLBACK,
    imageAlt: item.productNm,
    title: item.productNm,
    description: item.prdSubDesc,
    // awards 코드값이 비어있지 않으면 배지 노출(코드 존재 자체로 판단)
    hasBadge: item.awards.trim() !== "",
  };
}

const PRODUCTS_DESKTOP_MQ = "(min-width: 781px)";
const PRODUCTS_DESKTOP_SLIDES_PER_VIEW = 4;
const PRODUCTS_MOBILE_SPACE_BETWEEN = 14;
/** 335px content + gap / (315px slide + gap) — pagination·loop 추정용 */
const PRODUCTS_MOBILE_SLIDES_PER_VIEW_ESTIMATE = 1.06;

function getSlidesPerView(swiper: SwiperType): number {
  const value = swiper.params.slidesPerView;
  if (value === "auto") {
    const space =
      typeof swiper.params.spaceBetween === "number"
        ? swiper.params.spaceBetween
        : 0;
    const slideWidth = swiper.slides[swiper.activeIndex]?.offsetWidth ?? 0;
    if (!slideWidth || !swiper.width) return 1;
    return (swiper.width + space) / (slideWidth + space);
  }
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number.parseFloat(value) || 1;
  return 1;
}

function getPageCount(slideCount: number, slidesPerView: number) {
  return Math.max(1, Math.ceil(slideCount - slidesPerView + 1));
}

function canEnableProductLoop(slideCount: number, slidesPerView: number) {
  return slideCount > 1 && slideCount > slidesPerView * 2;
}

function getActivePageIndex(
  swiper: SwiperType,
  slideCount: number,
  loopEnabled: boolean,
) {
  const perView = getSlidesPerView(swiper);
  const pageCount = getPageCount(slideCount, perView);

  if (loopEnabled) {
    return Math.min(swiper.realIndex, pageCount - 1);
  }

  return Math.min(swiper.snapIndex, pageCount - 1);
}

type ProductsSwiperPer4Props = {
  products: ProductItem[];
};

function ProductsSwiperPer4({ products }: ProductsSwiperPer4Props) {
  const isDesktop = useMediaQuery(PRODUCTS_DESKTOP_MQ);
  const layoutSlidesPerView = isDesktop
    ? PRODUCTS_DESKTOP_SLIDES_PER_VIEW
    : PRODUCTS_MOBILE_SLIDES_PER_VIEW_ESTIMATE;
  const loopEnabled = canEnableProductLoop(products.length, layoutSlidesPerView);
  const pageCount = getPageCount(products.length, layoutSlidesPerView);

  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const syncPagination = useCallback(
    (swiper: SwiperType) => {
      setActiveIndex(getActivePageIndex(swiper, products.length, loopEnabled));
    },
    [loopEnabled, products.length],
  );

  const handleSwiper = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      syncPagination(swiper);
    },
    [syncPagination],
  );

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      syncPagination(swiper);
    },
    [syncPagination],
  );

  const getLastPageIndex = useCallback(
    (swiper: SwiperType) =>
      getPageCount(products.length, getSlidesPerView(swiper)) - 1,
    [products.length],
  );

  const handlePrev = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const lastPage = getLastPageIndex(swiper);
    const isAtFirst = loopEnabled
      ? swiper.realIndex === 0
      : swiper.isBeginning;

    if (isAtFirst) {
      if (loopEnabled) {
        swiper.slideToLoop(lastPage);
      } else {
        swiper.slideTo(lastPage);
      }
      return;
    }

    swiper.slidePrev();
  }, [getLastPageIndex, loopEnabled]);

  const handleNext = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const lastPage = getLastPageIndex(swiper);
    const isAtLast = loopEnabled
      ? swiper.realIndex >= lastPage
      : swiper.isEnd;

    if (isAtLast) {
      if (loopEnabled) {
        swiper.slideToLoop(0);
      } else {
        swiper.slideTo(0);
      }
      return;
    }

    swiper.slideNext();
  }, [getLastPageIndex, loopEnabled]);

  const handlePaginationClick = (index: number) => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    if (loopEnabled) {
      swiper.slideToLoop(index);
      return;
    }

    swiper.slideTo(index);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="products_swipers per4">
      <div className="products_swipers_area">
        <Swiper
          key={`products-swiper-${loopEnabled ? "loop" : "slide"}-${isDesktop ? "desktop" : "mobile"}`}
          className="products_swiper"
          data-slug="ms"
          data-slug-repeat="true"
          modules={[A11y]}
          slidesPerView={4}
          spaceBetween={24}
          speed={400}
          loop={loopEnabled}
          rewind={!loopEnabled && products.length > 1}
          watchOverflow
          breakpoints={{
            0: {
              slidesPerView: "auto",
              spaceBetween: PRODUCTS_MOBILE_SPACE_BETWEEN,
            },
            781: {
              slidesPerView: PRODUCTS_DESKTOP_SLIDES_PER_VIEW,
              spaceBetween: 24,
            },
          }}
          onSwiper={handleSwiper}
          onSlideChange={handleSlideChange}
          onSlideChangeTransitionEnd={handleSlideChange}
          onBreakpoint={handleSlideChange}
          onResize={handleSlideChange}
        >
          {/* 제품(다건) 중첩 반복 — prdGrp-data 그룹 1건 내부의 ms 배열.
              정렬/필터는 BE 응답 그대로 사용(추가 가공 없음). */}
          {products.map((product) => {
            // slug 없으면 링크 비활성(클릭 무효, 포커스 제외)
            const isLinkable = product.href !== "";

            return (
              // data-slug-item: 제품 1건(중첩 반복 아이템)
              <SwiperSlide key={product.id} data-slug-item>
                {/* href: `/product/{seo.slug}` 합성값. slug null 이면 "" + 클릭 비활성 */}
                <Link
                  href={product.href}
                  className={product.hasBadge ? "sl type2" : "sl"}
                  data-slugKey="seo.slug"
                  data-slugKey-attr="href"
                  aria-disabled={!isLinkable}
                  tabIndex={isLinkable ? undefined : -1}
                  onClick={isLinkable ? undefined : (e) => e.preventDefault()}
                >
                  <div className="img_area">
                    {/* awards 코드값 존재 시에만 배지 노출 */}
                    {product.hasBadge ? <ProductAwardBadge /> : null}
                    <img
                      loading="lazy"
                      decoding="async"
                      src={product.image}
                      alt={product.imageAlt}
                      data-slugKey="info.image"
                      data-slugKey-attr="src"
                    />
                  </div>
                  <div className="txt_area">
                    <h3
                      className="tit_product"
                      data-slugKey="productDataForm.productNm"
                    >
                      {product.title}
                    </h3>
                    <p className="txt" data-slugKey="productDataForm.prdSubDesc">
                      {product.description}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <SwiperBarControls
          variant="products_swipers"
          count={pageCount}
          activeIndex={activeIndex}
          isPrevDisabled={false}
          isNextDisabled={false}
          onSelect={handlePaginationClick}
          onPrev={handlePrev}
          onNext={handleNext}
          ariaLabel="제품 슬라이드 컨트롤"
          paginationAriaLabel="제품 슬라이드 페이지네이션"
          prevLabel="이전 제품"
          nextLabel="다음 제품"
        />
      </div>
    </div>
  );
}

type MainProductsClientProps = {
  // 서버 컴포넌트(MainProducts)에서 1회 fetch 후 전달받은 그룹 목록.
  // tab_area(라벨)와 products_panels(정본)가 동일 배열을 공유(fetch 중복 없음).
  groups: FoProductGroupResponse[];
};

export default function MainProductsClient({ groups }: MainProductsClientProps) {
  // 활성 탭 = 그룹 id. 초기값은 첫 번째 그룹(이미 prdGrpOrd ASC 정렬 상태).
  const [activeGroupId, setActiveGroupId] = useState<number>(groups[0].id);

  return (
    <section className="main_products">
      <div className="inner">
        <h2 className="section_tit">Discover Our Products</h2>

        {/* 그룹(prdGrp-data) 다건 — 탭 라벨 영역. 각 TabButton = 그룹 1건, 라벨 = prdGrpNm.
            tab_area(라벨)와 아래 products_panels(정본)는 동일 groups 배열을 공유(fetch 1회). */}
        <div
          className="tab_area"
          role="tablist"
          aria-label="제품 카테고리"
          data-slug="prdGrp-data"
          data-slug-repeat="true"
        >
          {groups.map((group) => (
            // data-slug-item: 그룹 1건, data-slugKey="prdGrpNm": 라벨 텍스트=그룹명
            <TabButton
              key={group.id}
              id={`main-products-tab-${group.id}`}
              label={group.prdGrpNm}
              isActive={activeGroupId === group.id}
              controls={`main-products-panel-${group.id}`}
              onSelect={() => setActiveGroupId(group.id)}
              data-slug-item
              data-slugKey="prdGrpNm"
            />
          ))}
        </div>

        {/* 그룹(prdGrp-data) 다건 — 패널 영역(정본). 각 패널 div = 그룹 1건.
            그룹 내부에 제품(ms 다건)이 중첩 반복됨 → ProductsSwiperPer4 참조. */}
        <div
          className="products_panels"
          data-slug="prdGrp-data"
          data-slug-repeat="true"
        >
          {groups.map((group) => {
            const isActive = activeGroupId === group.id;

            return (
              <div
                key={group.id}
                data-slug-item
                id={`main-products-panel-${group.id}`}
                role="tabpanel"
                aria-labelledby={`main-products-tab-${group.id}`}
                hidden={!isActive}
                className={
                  isActive ? "products_panel is-active" : "products_panel"
                }
              >
                {/* 활성 탭만 실제 렌더링(비활성 그룹의 Swiper 인스턴스 생성 방지) */}
                {isActive && (
                  <ProductsSwiperPer4 products={group.ms.map(toProductItem)} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
