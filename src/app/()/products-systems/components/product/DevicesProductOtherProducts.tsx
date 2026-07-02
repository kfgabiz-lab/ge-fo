"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import SwiperBarControls from "@/components/swiper/SwiperBarControls";
import ProductAwardBadge from "@/components/product/ProductAwardBadge";
import { useMediaQuery } from "@/components/layout/shared/useMediaQuery";
import { getProductBadgeType } from "@/lib/productBadge";
import type { ProductOtherItem } from "../../data/productDetailContent";
import "swiper/css";

type DevicesProductOtherProductsProps = {
  items: ProductOtherItem[];
  title?: string;
};

const DESKTOP_MQ = "(min-width: 781px)";
const DESKTOP_SLIDES_PER_VIEW = 4;
const MOBILE_SLIDES_PER_VIEW = 1.15;
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
  const slidesPerView = isDesktop
    ? DESKTOP_SLIDES_PER_VIEW
    : MOBILE_SLIDES_PER_VIEW;
  const loopEnabled = canEnableProductLoop(items.length, slidesPerView);
  const pageCount = getPageCount(items.length, slidesPerView);

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

  const showControls = items.length > DESKTOP_SLIDES_PER_VIEW;

  return (
    <section className="devices_product_other" id="product-other">
      <div className="inner">
        <h2 className="section_tit">{title}</h2>
        <div className="devices_product_other__body">
          <div className="devices_product_other__swiper-wrap">
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
                  slidesPerView: MOBILE_SLIDES_PER_VIEW,
                  spaceBetween: 12,
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
                  <SwiperSlide key={item.id} className="devices_product_other__slide">
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
                          <img loading="lazy" decoding="async" src={item.image} alt={item.title} />
                        </div>
                      </div>
                      <div className="devices_product_other__text">
                        <h3 className="devices_product_other__tit">
                          {item.title}
                        </h3>
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
