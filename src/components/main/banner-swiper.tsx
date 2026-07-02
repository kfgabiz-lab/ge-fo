"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import BannerNavButtons from "@/components/swiper/BannerNavButtons";
import SwiperDotPagination from "@/components/swiper/SwiperDotPagination";
import "swiper/css";
import "swiper/css/effect-fade";

const AUTOPLAY_DELAY_MS = 4000;

const bannerSlides = [
  {
    id: "banner-1",
    href: "",
    img: "/img/main/img_main_banner_01.png",
    alt: "banner_1",
    tit: "Triple iF Design 2026",
    txt: "3 Wins in Smart Device & Energy Platform...",
  },
  {
    id: "banner-2",
    href: "",
    img: "/img/main/img_main_banner_02.png",
    alt: "banner_2",
    tit: "Smart Energy Innovation",
    txt: "Leading the future of power and automation solutions",
  },{
    id: "banner-3",
    href: "",
    img: "/img/main/img_main_banner_01.png",
    alt: "banner_1",
    tit: "Triple iF Design 2026",
    txt: "3 Wins in Smart Device & Energy Platform...",
  },
];

export default function BannerSwiper() {
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
          <SwiperSlide key={slide.id}>
            <div className="sl">
              <Link href={slide.href} className="link">
                <div className="img_area">
                  <Image
                    src={slide.img}
                    alt={slide.alt}
                    className="sl_img"
                    fill
                    sizes="120px"
                    priority={index === 0}
                  />
                </div>
                <div className="txt_area">
                  <div className="txt_area__copy">
                    <p className="tit">{slide.tit}</p>
                    <p className="txt">{slide.txt}</p>
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
