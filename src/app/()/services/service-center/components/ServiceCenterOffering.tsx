"use client";

import { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import SwiperBarControls from "@/components/swiper/SwiperBarControls";
import { serviceCenterPage } from "@/data/services/serviceCenterContent";
import "swiper/css";
import "swiper/css/effect-fade";

const { offering } = serviceCenterPage;
const SLIDE_COUNT = offering.slides.length;
const PREVIEW_SLIDES_PER_VIEW = 2;
const PREVIEW_SPACE_BETWEEN = 24;
const OFFERING_SLIDE_SPEED = 400;

type SyncSource = "main" | "preview" | null;

export default function ServiceCenterOffering() {
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const previewSwiperRef = useRef<SwiperType | null>(null);
  const syncSourceRef = useRef<SyncSource>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = offering.slides[activeIndex];

  const syncPreviewFromMain = useCallback((mainIndex: number) => {
    const preview = previewSwiperRef.current;
    if (!preview) return;

    syncSourceRef.current = "main";
    preview.slideToLoop((mainIndex + 1) % SLIDE_COUNT, OFFERING_SLIDE_SPEED);
  }, []);

  const handlePreviewTransitionEnd = useCallback(() => {
    if (syncSourceRef.current === "main") {
      syncSourceRef.current = null;
    }
  }, []);

  const syncMainFromPreview = useCallback((previewIndex: number) => {
    const main = mainSwiperRef.current;
    if (!main || main.realIndex === previewIndex) return;

    syncSourceRef.current = "preview";
    main.slideToLoop(previewIndex);
  }, []);

  const tryInitialPreviewSync = useCallback(() => {
    const main = mainSwiperRef.current;
    const preview = previewSwiperRef.current;
    if (!main || !preview) return;

    syncSourceRef.current = "main";
    preview.slideToLoop((main.realIndex + 1) % SLIDE_COUNT, 0);
  }, []);

  const scheduleInitialPreviewSync = useCallback(() => {
    queueMicrotask(() => {
      tryInitialPreviewSync();
    });
  }, [tryInitialPreviewSync]);

  const handleMainSwiper = useCallback(
    (swiper: SwiperType) => {
      mainSwiperRef.current = swiper;
      scheduleInitialPreviewSync();
    },
    [scheduleInitialPreviewSync],
  );

  const handlePreviewSwiper = useCallback(
    (swiper: SwiperType) => {
      previewSwiperRef.current = swiper;
      scheduleInitialPreviewSync();
    },
    [scheduleInitialPreviewSync],
  );

  const handleMainSlideChange = useCallback(
    (swiper: SwiperType) => {
      const index = swiper.realIndex;

      queueMicrotask(() => {
        setActiveIndex(index);

        if (syncSourceRef.current === "preview") {
          syncSourceRef.current = null;
          return;
        }

        syncPreviewFromMain(index);
      });
    },
    [syncPreviewFromMain],
  );

  const handlePreviewSlideChange = useCallback(
    (swiper: SwiperType) => {
      if (syncSourceRef.current === "main") {
        return;
      }

      const index = swiper.realIndex;

      queueMicrotask(() => {
        setActiveIndex(index);
        syncMainFromPreview(index);
      });
    },
    [syncMainFromPreview],
  );

  const handleSelect = useCallback((index: number) => {
    mainSwiperRef.current?.slideToLoop(index);
  }, []);

  const handlePrev = useCallback(() => {
    mainSwiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    mainSwiperRef.current?.slideNext();
  }, []);

  return (
    <section className="support_service_offering" id="service-center-offering">
      <div className="inner">
        <div className="support_service_offering__head">
          <h2 className="section_tit">{offering.title}</h2>
          <p className="section_desc">{offering.description}</p>
        </div>

        <div className="support_service_offering__body">
          <div className="support_service_offering__carousel">
            <Swiper
              className="support_service_offering__main-swiper"
              modules={[A11y, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              slidesPerView={1}
              speed={OFFERING_SLIDE_SPEED}
              loop={SLIDE_COUNT > 1}
              watchSlidesProgress
              onSwiper={handleMainSwiper}
              onSlideChange={handleMainSlideChange}
            >
              {offering.slides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <div className="support_service_offering__slide">
                    <img
                      src={slide.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="support_service_offering__panel">
            <div
              key={activeSlide.id}
              className="support_service_offering__panel-content"
            >
              <span className="support_service_offering__num" aria-hidden="true">
                {activeSlide.number}
              </span>
              <div className="support_service_offering__panel-copy">
                <h3 className="support_service_offering__slide-tit">
                  {activeSlide.titleLines.map((line) => (
                    <span key={line} className="support_service_offering__slide-tit-line">
                      {line}
                    </span>
                  ))}
                </h3>
                <p className="support_service_offering__slide-desc">
                  {activeSlide.description}
                </p>
              </div>
            </div>
            <SwiperBarControls
              variant="swiper_type_01"
              count={SLIDE_COUNT}
              activeIndex={activeIndex}
              isPrevDisabled={false}
              isNextDisabled={false}
              onSelect={handleSelect}
              onPrev={handlePrev}
              onNext={handleNext}
              ariaLabel="Our Offering slides"
            />
          </div>

          <div className="support_service_offering__preview">
            <Swiper
              className="support_service_offering__preview-swiper"
              modules={[A11y]}
              slidesPerView="auto"
              spaceBetween={PREVIEW_SPACE_BETWEEN}
              speed={OFFERING_SLIDE_SPEED}
              loop={SLIDE_COUNT > PREVIEW_SLIDES_PER_VIEW}
              watchSlidesProgress
              slideToClickedSlide
              allowTouchMove={false}
              onSwiper={handlePreviewSwiper}
              onSlideChange={handlePreviewSlideChange}
              onSlideChangeTransitionEnd={handlePreviewTransitionEnd}
            >
              {offering.slides.map((slide) => (
                <SwiperSlide key={`${slide.id}-preview`}>
                  <div className="support_service_offering__preview-slide">
                    <img
                      src={slide.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
