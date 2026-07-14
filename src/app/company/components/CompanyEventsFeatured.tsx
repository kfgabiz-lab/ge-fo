"use client";



import Link from "next/link";

import { useCallback, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import type { Swiper as SwiperType } from "swiper";

import SwiperBarControls from "@/components/swiper/SwiperBarControls";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import type { EventsFeaturedItem } from "@/app/company/data/eventsListContent";

import "swiper/css";



type CompanyEventsFeaturedProps = {

  items: EventsFeaturedItem[];

};



const DESKTOP_MQ = "(min-width: 781px)";

const DESKTOP_SLIDES_PER_VIEW = 2;

const DESKTOP_SLIDES_PER_GROUP = 2;

const MOBILE_SLIDES_PER_VIEW = 1;
const MOBILE_SLIDES_PER_GROUP = 1;



function getSlidesPerGroup(swiper: SwiperType): number {

  const group = swiper.params.slidesPerGroup;

  return typeof group === "number" && group > 0 ? group : 1;

}



function getPageCount(itemCount: number, slidesPerGroup: number) {

  return Math.max(1, Math.ceil(itemCount / slidesPerGroup));

}



function FeaturedCard({ item }: { item: EventsFeaturedItem }) {

  const content = (

    <>

      <div className="company-events-featured__image">

        <img src={item.image} alt={item.title} />

      </div>

      <div className="company-events-featured__panel">

        <div className="company-events-featured__panel-text">

          <p className="company-events-featured__date">{item.dateRange}</p>

          <h2 className="company-events-featured__title">{item.title}</h2>

        </div>

        <p className="company-events-featured__venue">

          <span className="company-events-featured__venue-label">Venue</span>

          <span className="company-events-featured__venue-sep" aria-hidden="true" />

          <span className="company-events-featured__venue-value">{item.venue}</span>

        </p>

      </div>

    </>

  );



  if (item.href) {

    return (

      <Link href={item.href} className="company-events-featured__card">

        {content}

      </Link>

    );

  }



  return <article className="company-events-featured__card">{content}</article>;

}



export default function CompanyEventsFeatured({ items }: CompanyEventsFeaturedProps) {

  const isDesktop = useMediaQuery(DESKTOP_MQ);

  const slidesPerGroup = isDesktop ? DESKTOP_SLIDES_PER_GROUP : MOBILE_SLIDES_PER_GROUP;

  const pageCount = getPageCount(items.length, slidesPerGroup);



  const swiperRef = useRef<SwiperType | null>(null);

  const [activePage, setActivePage] = useState(0);



  const syncPagination = useCallback(

    (swiper: SwiperType) => {

      const pages = getPageCount(items.length, getSlidesPerGroup(swiper));

      setActivePage(Math.min(swiper.snapIndex, pages - 1));

    },

    [items.length],

  );



  const handlePrev = useCallback(() => {

    swiperRef.current?.slidePrev();

  }, []);



  const handleNext = useCallback(() => {

    swiperRef.current?.slideNext();

  }, []);



  const handleSelect = useCallback((pageIndex: number) => {

    const swiper = swiperRef.current;

    if (!swiper) return;

    swiper.slideTo(pageIndex * getSlidesPerGroup(swiper));

  }, []);



  if (items.length === 0) {

    return null;

  }



  return (

    <section className="company-events-featured">

      <div className="inner">

        <div className="company-events-featured__swiper-area">

          <Swiper
            key={`company-events-featured-${isDesktop ? "desktop" : "mobile"}`}
            className="company-events-featured__swiper"
            direction="horizontal"
            slidesPerView={isDesktop ? DESKTOP_SLIDES_PER_VIEW : MOBILE_SLIDES_PER_VIEW}
            slidesPerGroup={isDesktop ? DESKTOP_SLIDES_PER_GROUP : MOBILE_SLIDES_PER_GROUP}
            spaceBetween={isDesktop ? 24 : 14}

            speed={500}

            watchOverflow

            onSwiper={(swiper) => {

              swiperRef.current = swiper;

              syncPagination(swiper);

            }}

            onSlideChange={syncPagination}

            onBreakpoint={syncPagination}

            onResize={syncPagination}

          >

            {items.map((item) => (

              <SwiperSlide key={item.id} className="company-events-featured__slide">

                <FeaturedCard item={item} />

              </SwiperSlide>

            ))}

          </Swiper>



          <SwiperBarControls

            variant="swiper_type_01"

            count={pageCount}

            activeIndex={activePage}

            isPrevDisabled={activePage <= 0}

            isNextDisabled={activePage >= pageCount - 1}

            onSelect={handleSelect}

            onPrev={handlePrev}

            onNext={handleNext}

            ariaLabel="Featured events slides"

            paginationAriaLabel="Featured events pagination"

            prevLabel="Previous featured events"

            nextLabel="Next featured events"

          />

        </div>

      </div>

    </section>

  );

}

