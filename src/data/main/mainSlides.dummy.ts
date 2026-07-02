import type { MainSlide } from "./types";

/** 메인 비주얼 슬라이더 더미 데이터 */
export const mainSlidesDummy: MainSlide[] = [
  {
    id: "slide-1",
    type: "video",
    sources: [
      {
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
        type: "video/mp4",
      },
    ],
    title: "Smart Energy for Tomorrow",
    description: "LS ELECTRIC delivers safe, clean energy solutions worldwide.",
  },
  {
    id: "slide-2",
    type: "image",
    src: "/img/main_sample.png",
    alt: "LS ELECTRIC main visual",
    title: "Clean Energy Solutions",
    description: "Sustainable power infrastructure for a greener future.",
  },
  {
    id: "slide-3",
    type: "video",
    sources: [
      {
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        type: "video/mp4",
      },
    ],
    title: "Innovation in Power & Automation",
    description: "Advanced technology for sustainable industrial growth.",
  },
  {
    id: "slide-4",
    type: "image",
    src: "/img/main_sample.png",
    alt: "Smart factory and automation",
    title: "Smart Factory & Automation",
    description: "Digital transformation for next-generation manufacturing.",
  },
  {
    id: "slide-5",
    type: "video",
    sources: [
      {
        src: "https://media.w3.org/2010/05/sintel/trailer.mp4",
        type: "video/mp4",
      },
    ],
    title: "Global Leader in Energy",
    description: "Connecting the world with reliable smart energy infrastructure.",
  },
];
