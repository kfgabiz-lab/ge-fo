"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import SwiperBarControls from "@/components/swiper/SwiperBarControls";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { ProductOtherItem } from "../../data/productDetailContent";
import "swiper/css";

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

function getLinearPageCount(slideCount: number, slidesPerView: number) {
  return Math.max(1, Math.ceil(slideCount - slidesPerView + 1));
}

function canEnableProductLoop(slideCount: number, slidesPerView: number) {
  return slideCount > 1 && slideCount > Math.ceil(slidesPerView);
}

function getPageCount(
  slideCount: number,
  slidesPerView: number,
  loopEnabled: boolean,
) {
  if (loopEnabled) return Math.max(1, slideCount);
  return getLinearPageCount(slideCount, slidesPerView);
}

function getActivePageIndex(
  swiper: SwiperType,
  slideCount: number,
  loopEnabled: boolean,
) {
  if (loopEnabled) {
    return swiper.realIndex;
  }

  const perView = getSlidesPerView(swiper);
  const pageCount = getLinearPageCount(slideCount, perView);
  return Math.min(swiper.snapIndex, pageCount - 1);
}

export default function DevicesProductOtherProducts({
  items,
  title = "Other Products",
}: DevicesProductOtherProductsProps) {
  const isDesktop = useMediaQuery(DESKTOP_MQ);
  const layoutSlidesPerView = isDesktop ? DESKTOP_SLIDES_PER_VIEW : 1;
  const loopEnabled = canEnableProductLoop(items.length, layoutSlidesPerView);
  const pageCount = getPageCount(
    items.length,
    layoutSlidesPerView,
    loopEnabled,
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

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

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
          <div className="devices_product_other__swiper-wrap">
            <Swiper
              key={`devices-other-${loopEnabled ? "loop" : "slide"}-${isDesktop ? "desktop" : "mobile"}`}
              className="devices_product_other__swiper"
              modules={[A11y]}
              slidesPerView={DESKTOP_SLIDES_PER_VIEW}
              spaceBetween={24}
              speed={400}
              loop={loopEnabled}
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
                return (
                  <SwiperSlide key={item.id} className="devices_product_other__slide">
                    <Link
                      href={item.href}
                      className="devices_product_other__card"
                    >
                      <div className="devices_product_other__img-wrap">
                        <div className="devices_product_other__img-area">
                          <img loading="lazy" decoding="async" src={item.image || undefined} alt={item.title} />
                        </div>
                      </div>
                      <div className="devices_product_other__text">
                        <h3 className="devices_product_other__tit">
                          {item.title}
                        </h3>
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
              isPrevDisabled={!loopEnabled && activeIndex <= 0}
              isNextDisabled={!loopEnabled && activeIndex >= pageCount - 1}
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
