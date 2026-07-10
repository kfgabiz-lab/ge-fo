"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import SwiperBarControls from "@/components/swiper/SwiperBarControls";
import "swiper/css";
import "swiper/css/effect-fade";

const AUTOPLAY_DELAY_MS = 4000;
const WHAT_WE_DO_EXPLORE_HREF = "/company/ls-electric-america";

const whatWeDoSlides = [
  {
    id: "lv-mv-power",
    img: "/img/main/what_we_do_01.jpg",
    alt: "LV & MV Power Solutions",
    tit: "LV & MV Power Solutions",
    txt: "We provide complete low and medium voltage power distribution solutions—from transformers and switchgear to switchboards, panelboards, and DC power systems. Built for mission critical applications like data centers, manufacturing, and commercial infrastructure, our solutions deliver the reliability, efficiency, and scalability North American operations demand.",
  },
  {
    id: "grid-utility",
    img: "/img/main/what_we_do_02.jpg",
    alt: "Grid & Utility Infrastructure",
    tit: "Grid & Utility Infrastructure",
    txt: "LS ELECTRIC supports utilities, renewable developers, and large industrial projects with high voltage transmission and grid infrastructure solutions. Our portfolio—from ultra high voltage disconnect switches to power transformers—is designed to strengthen grid resilience, improve efficiency, and support the transition to cleaner, more reliable energy systems across North America.",
  },
  {
    id: "automation-control",
    img: "/img/main/what_we_do_03.jpg",
    alt: "Automation & Industrial Control",
    tit: "Automation & Industrial Control",
    txt: "We deliver advanced automation and motor control solutions including VFDs, PLCs, HMIs, and integrated control systems. Designed for North American industry, our technologies help manufacturers and operators boost productivity, reduce downtime, and drive smarter, data driven decision making.",
  },
];

export default function WhatWeDoSwiper() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSwiper = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
    setActiveIndex(swiper.realIndex);
  }, []);

  const handleMouseEnter = () => {
    swiperRef.current?.autoplay?.stop();
  };

  const handleMouseLeave = () => {
    swiperRef.current?.autoplay?.start();
  };

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

  if (whatWeDoSlides.length === 0) {
    return null;
  }

  return (
    <section className="what_we_do__inner">
      <h2 className="tit_area">What we do</h2>

      <div
        className="swiper_type_01_area"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Swiper
          className="swiper_type_01"
          modules={[A11y, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          speed={300}
          loop
          observer
          observeParents
          watchSlidesProgress
          autoplay={{ delay: AUTOPLAY_DELAY_MS, disableOnInteraction: false }}
          onSwiper={handleSwiper}
          onSlideChange={handleSlideChange}
        >
          {whatWeDoSlides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <div className="sl">
                <Link href={WHAT_WE_DO_EXPLORE_HREF} className="btn-text-30 link_more">
                  Explore
                  <span className="btn-text-30__icon">
                    <span className="icon_arrow-14" aria-hidden="true" />
                  </span>
                </Link>
                <div className="img_area">
                  <img
                    src={slide.img}
                    alt={slide.alt}
                    className="sl_img"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <div className="txt_area">
                  <h3 className="tit">{slide.tit}</h3>
                  <p className="txt">{slide.txt}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <SwiperBarControls
          variant="swiper_type_01"
          count={whatWeDoSlides.length}
          activeIndex={activeIndex}
          isPrevDisabled={false}
          isNextDisabled={false}
          onSelect={handlePaginationClick}
          onPrev={handlePrev}
          onNext={handleNext}
          ariaLabel="What We Do 슬라이드 컨트롤"
        />
      </div>
    </section>
  );
}
