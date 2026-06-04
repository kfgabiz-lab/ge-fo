"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import SwiperBarControls from "@/components/swiper/SwiperBarControls";
import "swiper/css";
import "swiper/css/effect-fade";

const AUTOPLAY_DELAY_MS = 4000;

const whatWeDoSlides = [
  {
    id: "automation",
    href: "",
    img: "/img/main/whit_we_do_1.jpg",
    alt: "Automation",
    tit: "Automation",
    txt: "LS ELECTRIC offers various automation solutions from unit devices to process control in order to effectively operate in industrial environments. Its major products include, among others, PLC that effectively controls devices, an AC drive that converts motor speed, servo that meticulously controls the devices, and HMI that provide real-time monitoring of devices.",
  },
  {
    id: "energy",
    href: "",
    img: "/img/main/whit_we_do_1.jpg",
    alt: "Energy Solutions",
    tit: "Energy Solutions",
    txt: "We deliver reliable power infrastructure and smart grid technologies that support sustainable energy transitions across global markets.",
  },
  {
    id: "mobility",
    href: "",
    img: "/img/main/whit_we_do_1.jpg",
    alt: "Mobility & EV",
    tit: "Mobility & EV",
    txt: "Advanced charging and power components for electric mobility, enabling efficient and safe energy use in next-generation transportation.",
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
      <h2 className="tit_area">What We Do</h2>

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
          autoplay={{ delay: AUTOPLAY_DELAY_MS, disableOnInteraction: false }}
          onSwiper={handleSwiper}
          onSlideChange={handleSlideChange}
        >
          {whatWeDoSlides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <Link href={slide.href} className="sl">
                <div className="btn-text-30 link_more">
                  Explore
                  <span className="btn-text-30__icon">
                    <span className="icon_arrow-14" aria-hidden="true" />
                  </span>
                </div>
                <div className="img_area">
                  <img loading="lazy" decoding="async"
                    src={slide.img}
                    alt={slide.alt}
                    className="sl_img"              
                  />
                </div>
                <div className="txt_area">
                  <h3 className="tit">{slide.tit}</h3>
                  <p className="txt">{slide.txt}</p>
                </div>
              </Link>
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
