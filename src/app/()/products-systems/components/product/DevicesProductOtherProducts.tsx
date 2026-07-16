"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import SwiperBarControls from "@/components/swiper/SwiperBarControls";
import ProductAwardBadge from "@/components/product/ProductAwardBadge";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getProductBadgeType } from "@/lib/productBadge";
import type { ProductOtherItem } from "../../data/productDetailContent";
import "swiper/css";

// 관련제품(Other Products): product-data 의 _fetchedRel5/6 관계 shape 미확정 →
// 이번 범위에서는 정적 유지. 관계필드 확정 후 product-data 연동 예정.
type DevicesProductOtherProductsProps = {
  items: ProductOtherItem[];
  title?: string;
};

const DESKTOP_MQ = "(min-width: 781px)";
const DESKTOP_SLIDES_PER_VIEW = 4;
const MOBILE_SPACE_BETWEEN = 14;
function getSlidesPerView(swiper: SwiperType): number {
  const value = swiper.params.slidesPerView;
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

export default function DevicesProductOtherProducts({
  items,
  title = "Other Products",
}: DevicesProductOtherProductsProps) {
  const isDesktop = useMediaQuery(DESKTOP_MQ);
  const loopEnabled = canEnableProductLoop(
    items.length,
    isDesktop ? DESKTOP_SLIDES_PER_VIEW : 1,
  );
  const pageCount = getPageCount(
    items.length,
    isDesktop ? DESKTOP_SLIDES_PER_VIEW : 1,
  );

  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const syncPagination = useCallback(
    (swiper: SwiperType) => {
      setActiveIndex(getActivePageIndex(swiper, items.length, loopEnabled));
    },
    [items.length, loopEnabled],
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
      getPageCount(items.length, getSlidesPerView(swiper)) - 1,
    [items.length],
  );

  const handlePrev = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const lastPage = getLastPageIndex(swiper);
    const isAtFirst = loopEnabled ? swiper.realIndex === 0 : swiper.isBeginning;

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

  if (items.length === 0) {
    return null;
  }

  const showControls = pageCount > 1;

  return (
    <section className="devices_product_other" id="product-other">
      <div className="inner">
        <h2 className="section_tit">{title}</h2>
        <div className="devices_product_other__body">
          {/* data-slug: product-data (다건 — 관련제품). 현재 제품 row의 관계필드 _fetchedRel5 / _fetchedRel6(관련제품명 문자열)로 연결.
              ⚠️ 관계 확장 shape 미확정: 각 아이템의 title/image가 관련 제품 row의 product.product_name / product_info.image로
              펼쳐지는지, rel5·rel6 중 어느 슬롯을 목록 소스로 쓰는지는 BE/FE(관계 조회) 단계에서 확정 필요 */}
          <div className="devices_product_other__swiper-wrap" data-slug="product-data" data-slug-repeat="true">
            <Swiper
              key={`devices-other-${loopEnabled ? "loop" : "slide"}-${isDesktop ? "desktop" : "mobile"}`}
              className="devices_product_other__swiper"
              modules={[A11y]}
              slidesPerView={DESKTOP_SLIDES_PER_VIEW}
              spaceBetween={24}
              speed={400}
              loop={loopEnabled}
              rewind={!loopEnabled && items.length > 1}
              watchOverflow
              breakpoints={{
                0: {
                  slidesPerView: "auto",
                  spaceBetween: MOBILE_SPACE_BETWEEN,
                },
                781: {
                  slidesPerView: DESKTOP_SLIDES_PER_VIEW,
                  spaceBetween: 24,
                },
              }}
              onSwiper={handleSwiper}
              onSlideChange={handleSlideChange}
              onSlideChangeTransitionEnd={handleSlideChange}
              onBreakpoint={handleSlideChange}
              onResize={handleSlideChange}
            >
              {items.map((item) => {
                const badgeType = getProductBadgeType(item);

                return (
                  <SwiperSlide key={item.id} className="devices_product_other__slide" data-slug-item>
                    {/* href = 관련 제품 상세 라우트로 이동하는 정적 라우팅 → 데이터 필드 아님(정적 유지) */}
                    <Link
                      href={item.href}
                      className={
                        badgeType
                          ? `devices_product_other__card ${badgeType}`
                          : "devices_product_other__card"
                      }
                    >
                      <div className="devices_product_other__img-wrap">
                        {badgeType ? <ProductAwardBadge /> : null}
                        <div className="devices_product_other__img-area">
                          {/* 관계 확장 시 관련 제품 row의 product_info.image(파일ID 배열 → 프록시) 로 연결 예상 — 확정 필요 */}
                          <img loading="lazy" decoding="async" src={item.image} alt={item.title} data-slugKey="product_info.image" data-slugKey-attr="src" />
                        </div>
                      </div>
                      <div className="devices_product_other__text">
                        {/* 관계 확장 시 관련 제품 row의 product.product_name 으로 연결 예상 — 확정 필요 */}
                        <h3 className="devices_product_other__tit" data-slugKey="product.product_name">
                          {item.title}
                        </h3>
                        {/* subtitle = 관련제품 관계필드(문자열)에 대응 없음 → 정적 유지, 태그 없음 */}
                        {item.subtitle ? (
                          <p className="devices_product_other__sub">
                            {item.subtitle}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          {showControls ? (
            <SwiperBarControls
              variant="swiper_type_01"
              count={pageCount}
              activeIndex={activeIndex}
              isPrevDisabled={false}
              isNextDisabled={false}
              onSelect={handlePaginationClick}
              onPrev={handlePrev}
              onNext={handleNext}
              ariaLabel="Other products slide controls"
              paginationAriaLabel="Other products pagination"
              prevLabel="Previous products"
              nextLabel="Next products"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
