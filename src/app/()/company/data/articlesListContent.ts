/** Figma 5584:53170 · P-FO-COMP-080000P — Articles list */
export type ArticlesListItem = {
  id: string;
  title: string;
  date: string;
  image: string;
};

export const articlesFeatured = {
  title: "LS ELECTRIC H100+ VFD: Advanced Fluid Control and Protection for Modern Pumping Infrastructure",
  description:
    "LS ELECTRIC America, a leader in power distribution and automation, is addressing the most demanding fluid-handling challenges with its H100+ Variable Frequency Drive (VFD). Developed specifically for pump and fan systems, the H100+ combines precise motor control with embedded pump-smart intelligence.",
  date: "Mar 27, 2026",
  image: "/img/company/articles/hero.png",
  href: "/company/articles/detail",
};

export const articlesItems: ArticlesListItem[] = [
  {
    id: "articles-01",
    title: "LS ELECTRIC to shake up the industry in the era of a ‘Supercycle’",
    date: "Apr 20, 2026",
    image: "/img/company/articles/list_01.png",
  },
  {
    id: "articles-02",
    title: "LS ELECTRIC Unveils a Wide Range of Future-Oriented Manufacturing AX Solutions",
    date: "Apr 20, 2026",
    image: "/img/company/articles/list_02.png",
  },
  {
    id: "articles-03",
    title: 'LS to unveil a wide range of future innovation technologies at "InterBattery',
    date: "Apr 20, 2026",
    image: "/img/company/articles/list_03.png",
  },
  {
    id: "articles-04",
    title: "LS ELECTRIC to shake up the industry in the era of a ‘Supercycle’",
    date: "Apr 20, 2026",
    image: "/img/company/articles/list_04.png",
  },
  {
    id: "articles-05",
    title: "LS ELECTRIC Unveils a Wide Range of Future-Oriented Manufacturing AX Solutions",
    date: "Apr 20, 2026",
    image: "/img/company/articles/list_05.png",
  },
  {
    id: "articles-06",
    title: "LS ELECTRIC Builds Solar-ed Energy Management Solution for ACE BED",
    date: "Apr 20, 2026",
    image: "/img/company/articles/list_06.png",
  },
  {
    id: "articles-07",
    title: 'LS ELECTRIC Showcases Capabilities in "Energy Highway" Business Built on Unrival...',
    date: "Apr 20, 2026",
    image: "/img/company/articles/list_07.png",
  },
  {
    id: "articles-08",
    title: "LS ELECTRIC Steps Up Push Into North American Distribution Market With Global No...",
    date: "Apr 20, 2026",
    image: "/img/company/articles/list_08.png",
  },
  {
    id: "articles-09",
    title: "LS ELECTRIC Surpasses 60 Billion KRW in Japanese ESS Market Orders",
    date: "Apr 20, 2026",
    image: "/img/company/articles/list_09.png",
  },
];

export const articlesListPager = {
  currentPage: 1,
  totalPages: 5,
};
