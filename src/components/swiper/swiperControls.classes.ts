export type SwiperBarVariant = "swiper_type_01" | "products_swipers";

export const swiperBarClasses: Record<
  SwiperBarVariant,
  {
    controls: string;
    pagination: string;
    item: string;
    bar: string;
    nav: string;
    btn: string;
    icon: string;
  }
> = {
  swiper_type_01: {
    controls: "swiper_type_01_controls",
    pagination: "swiper_type_01_pagination",
    item: "swiper_type_01_pagination__item",
    bar: "swiper_type_01_pagination__bar",
    nav: "swiper_type_01_nav",
    btn: "swiper_type_01_btn",
    icon: "swiper_type_01_icon",
  },
  products_swipers: {
    controls: "products_swipers_controls",
    pagination: "products_swipers_pagination",
    item: "products_swipers_pagination__item",
    bar: "products_swipers_pagination__bar",
    nav: "products_swipers_nav",
    btn: "products_swipers_btn",
    icon: "products_swipers_icon",
  },
};
