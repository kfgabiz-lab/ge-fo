"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import BannerNavButtons from "@/components/swiper/BannerNavButtons";
import SwiperDotPagination from "@/components/swiper/SwiperDotPagination";
import type { BannerItem } from "./mainVisualData";
import "swiper/css";
import "swiper/css/effect-fade";

const AUTOPLAY_DELAY_MS = 4000;

const PAGE_FILE_SRC = (mediaId: number | null) => `/api/v1/fo/page-files/${mediaId}`;

interface BannerSwiperProps {
  bannerItems: BannerItem[];
}

export default function BannerSwiper({ bannerItems }: BannerSwiperProps) {
  const bannerSlides = useMemo(() => {
    return bannerItems.map((item) => ({
      id: `banner-${item.id}`,
      href: item.url || "",
      img: PAGE_FILE_SRC(item.mediaId),
      alt: item.mainTitle || "",
      tit: item.mainTitle || "",
      txt: item.subTitle,
    }));
  }, [bannerItems]);

  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isOnlySlide = bannerSlides.length === 1;

  const handleSwiper = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
    setActiveIndex(swiper.realIndex);
  }, []);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  const handlePaginationClick = (index: number) => {
    swiperRef.current?.slideToLoop(index);
  };

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  if (bannerSlides.length === 0) {
    return null;
  }

  return (
    <div
      className={isOnlySlide ? "banner_swiper only only" : "banner_swiper"}
    >
      <Swiper
        className="banner_swiper__inner"
        data-slug="banner-data"
        data-slug-repeat="true"
        modules={[A11y, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        speed={600}
        loop={!isOnlySlide}
        autoplay={
          isOnlySlide
            ? false
            : { delay: AUTOPLAY_DELAY_MS, disableOnInteraction: false }
        }
        onSwiper={handleSwiper}
        onSlideChange={handleSlideChange}
      >
        {bannerSlides.map((slide, index) => (
          <SwiperSlide key={slide.id} data-slug-item>
            <div className="sl">
              <Link
                href={slide.href}
                className="link"
                data-slugkey="url"
                data-slugkey-attr="href"
              >
                <div className="img_area">
                  <Image
                    src={slide.img}
                    alt={slide.alt}
                    className="sl_img"
                    fill
                    sizes="120px"
                    data-slugkey="image"
                    data-slugkey-attr="src"
                  />
                </div>
                <div className="txt_area">
                  <div className="txt_area__copy">
                    <p className="tit" data-slugkey="mainTitle">{slide.tit}</p>
                    <p className="txt" data-slugkey="subTitle">{slide.txt}</p>
                  </div>
                  <span className="txt_area__arrow" aria-hidden="true" />
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {!isOnlySlide ? (
        <BannerNavButtons
          isPrevDisabled={false}
          isNextDisabled={false}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      ) : null}

      <SwiperDotPagination
        count={bannerSlides.length}
        activeIndex={activeIndex}
        onSelect={handlePaginationClick}
      />
    </div>
  );
}
