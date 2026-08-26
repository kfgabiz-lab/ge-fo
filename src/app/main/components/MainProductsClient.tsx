"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import SwiperBarControls from "@/components/swiper/SwiperBarControls";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import TabButton from "@/components/ui/TabButton";
import { getProductBadgeType } from "@/lib/productBadge";
import { handleHorizontalTabListKeyDown } from "@/lib/tabKeyboardNav";
import { contentDetailPath } from "@/lib/contentDetailPath";
import type {
  FoProductGroupItem,
  FoProductGroupResponse,
} from "./mainProductsData";
import "swiper/css";

const PRODUCT_IMAGE_FALLBACK = "/img/main/product_01.webp";

type ProductItem = {
  id: string;
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  badge?: boolean;
  badges?: 1 | 2;
};

function toProductItem(item: FoProductGroupItem): ProductItem {
  return {
    id: String(item.id),
    href: item.slug ? contentDetailPath("/product", item.id, item.slug) : "",
    image: item.image ?? PRODUCT_IMAGE_FALLBACK,
    imageAlt: item.productNm,
    title: item.productNm,
    description: item.prdSubDesc,
    badges: item.awards === "01" ? (2 as const) : undefined,
  };
}

const PRODUCTS_DESKTOP_MQ = "(min-width: 781px)";
const PRODUCTS_DESKTOP_SLIDES_PER_VIEW = 4;
const PRODUCTS_MOBILE_SPACE_BETWEEN = 14;
const PRODUCTS_MOBILE_SLIDES_PER_VIEW_ESTIMATE = 1.06;

function getSlidesPerView(swiper: SwiperType): number {
  const value = swiper.params.slidesPerView;
  if (value === "auto") {
    const space =
      typeof swiper.params.spaceBetween === "number"
        ? swiper.params.spaceBetween
        : 0;
    const slideWidth = swiper.slides[swiper.activeIndex]?.offsetWidth ?? 0;
    if (!slideWidth || !swiper.width) return 1;
    return (swiper.width + space) / (slideWidth + space);
  }
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

type ProductsSwiperPer4Props = {
  products: ProductItem[];
};

function ProductsSwiperPer4({ products }: ProductsSwiperPer4Props) {
  const isDesktop = useMediaQuery(PRODUCTS_DESKTOP_MQ);
  const layoutSlidesPerView = isDesktop
    ? PRODUCTS_DESKTOP_SLIDES_PER_VIEW
    : PRODUCTS_MOBILE_SLIDES_PER_VIEW_ESTIMATE;
  const loopEnabled = canEnableProductLoop(products.length, layoutSlidesPerView);
  const pageCount = getPageCount(
    products.length,
    layoutSlidesPerView,
    loopEnabled,
  );

  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const syncPagination = useCallback(
    (swiper: SwiperType) => {
      setActiveIndex(getActivePageIndex(swiper, products.length, loopEnabled));
    },
    [loopEnabled, products.length],
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

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="products_swipers per4">
      <div className="products_swipers_area">
        <Swiper
          key={`products-swiper-${loopEnabled ? "loop" : "slide"}-${isDesktop ? "desktop" : "mobile"}`}
          className="products_swiper"
          data-slug="ms"
          data-slug-repeat="true"
          modules={[A11y]}
          slidesPerView={4}
          spaceBetween={24}
          speed={400}
          loop={loopEnabled}
          watchOverflow
          breakpoints={{
            0: {
              slidesPerView: "auto",
              spaceBetween: PRODUCTS_MOBILE_SPACE_BETWEEN,
            },
            781: {
              slidesPerView: PRODUCTS_DESKTOP_SLIDES_PER_VIEW,
              spaceBetween: 24,
            },
          }}
          onSwiper={handleSwiper}
          onSlideChange={handleSlideChange}
          onSlideChangeTransitionEnd={handleSlideChange}
          onBreakpoint={handleSlideChange}
          onResize={handleSlideChange}
        >
          {products.map((product) => {
            const isLinkable = product.href !== "";
            const badgeType = getProductBadgeType(product);

            return (
              <SwiperSlide key={product.id} data-slug-item>
                <Link
                  href={product.href}
                  className={badgeType ? `sl ${badgeType}` : "sl"}
                  data-slugkey="seo.slug"
                  data-slugkey-attr="href"
                  aria-disabled={!isLinkable}
                  tabIndex={isLinkable ? undefined : -1}
                  onClick={isLinkable ? undefined : (e) => e.preventDefault()}
                >
                  <div className="img_area">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={product.image}
                      alt={product.imageAlt}
                      data-slugkey="info.image"
                      data-slugkey-attr="src"
                    />
                  </div>
                  <div className="txt_area">
                    <h3
                      className="tit_product"
                      data-slugkey="productDataForm.productNm"
                    >
                      {product.title}
                    </h3>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {pageCount > 1 ? (
          <SwiperBarControls
            variant="products_swipers"
            count={pageCount}
            activeIndex={activeIndex}
            isPrevDisabled={!loopEnabled && activeIndex <= 0}
            isNextDisabled={!loopEnabled && activeIndex >= pageCount - 1}
            onSelect={handlePaginationClick}
            onPrev={handlePrev}
            onNext={handleNext}
            ariaLabel="Product slide controls"
            paginationAriaLabel="Product slide pagination"
            prevLabel="Previous product"
            nextLabel="Next product"
          />
        ) : null}
      </div>
    </div>
  );
}

type MainProductsClientProps = {
  groups: FoProductGroupResponse[];
};

export default function MainProductsClient({ groups }: MainProductsClientProps) {
  const [activeGroupId, setActiveGroupId] = useState<number>(groups[0].id);

  return (
    <section className="main_products">
      <div className="inner">
        <h2 className="section_tit">Discover Our Products</h2>

        <div
          className="tab_area"
          role="tablist"
          aria-label="Product categories"
          data-slug="prdGrp-data"
          data-slug-repeat="true"
          onKeyDown={handleHorizontalTabListKeyDown}
        >
          {groups.map((group) => (
            <TabButton
              key={group.id}
              id={`main-products-tab-${group.id}`}
              label={group.prdGrpNm}
              isActive={activeGroupId === group.id}
              controls={`main-products-panel-${group.id}`}
              onSelect={() => setActiveGroupId(group.id)}
              data-slug-item
              data-slugkey="prdGrpNm"
            />
          ))}
        </div>

        <div
          className="products_panels"
          data-slug="prdGrp-data"
          data-slug-repeat="true"
        >
          {groups.map((group) => {
            const isActive = activeGroupId === group.id;

            return (
              <div
                key={group.id}
                data-slug-item
                id={`main-products-panel-${group.id}`}
                role="tabpanel"
                aria-labelledby={`main-products-tab-${group.id}`}
                hidden={!isActive}
                className={
                  isActive ? "products_panel is-active" : "products_panel"
                }
              >
                {isActive && (
                  <ProductsSwiperPer4 products={group.ms.map(toProductItem)} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
