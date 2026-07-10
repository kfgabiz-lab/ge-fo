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

// 업로드 미디어 스트리밍 엔드포인트(fo 오리진 상대경로 → next.config rewrites 로 bo-api:8080 프록시)
const PAGE_FILE_SRC = (mediaId: number) => `/api/v1/fo/page-files/${mediaId}`;

// 기존 정적 목업 — 이미지(image) 실데이터 URL 변환 로직이 이번 범위 밖이라
// 이미지는 이 목업을 index 순환으로 유지하고, 조회 0건 시 전체 폴백으로도 사용한다.
const MOCK_BANNER_SLIDES = [
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
  },
  {
    id: "banner-3",
    href: "",
    img: "/img/main/img_main_banner_01.png",
    alt: "banner_1",
    tit: "Triple iF Design 2026",
    txt: "3 Wins in Smart Device & Energy Platform...",
  },
];

interface BannerSwiperProps {
  bannerItems: BannerItem[];
}

export default function BannerSwiper({ bannerItems }: BannerSwiperProps) {
  // 실데이터(banner-data) 기반 슬라이드 구성.
  //  - item.mediaId 가 있으면: 업로드 미디어 스트리밍 엔드포인트(/api/v1/fo/page-files/{mediaId})를 이미지 src 로 사용.
  //  - item.mediaId 가 없으면(null): 기존 정적 목업 이미지를 index 순환으로 유지.
  //  - 링크/텍스트(url/mainTitle/subTitle)는 항상 실데이터로 교체.
  const bannerSlides = useMemo(() => {
    if (bannerItems.length === 0) return MOCK_BANNER_SLIDES; // 조회 0건 시 목업 폴백
    return bannerItems.map((item, index) => {
      const mock = MOCK_BANNER_SLIDES[index % MOCK_BANNER_SLIDES.length];
      return {
        id: `banner-${item.id}`,
        href: item.url || mock.href,
        img: item.mediaId != null ? PAGE_FILE_SRC(item.mediaId) : mock.img,
        alt: item.mainTitle || mock.alt,
        tit: item.mainTitle || mock.tit,
        txt: item.subTitle || mock.txt,
      };
    });
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
                data-slugKey="url"
                data-slugKey-attr="href"
              >
                <div className="img_area">
                  <Image
                    src={slide.img}
                    alt={slide.alt}
                    className="sl_img"
                    fill
                    sizes="120px"
                    priority={index === 0}
                    data-slugKey="image"
                    data-slugKey-attr="src"
                  />
                </div>
                <div className="txt_area">
                  <div className="txt_area__copy">
                    <p className="tit" data-slugKey="mainTitle">{slide.tit}</p>
                    <p className="txt" data-slugKey="subTitle">{slide.txt}</p>
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
