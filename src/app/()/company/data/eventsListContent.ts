export type EventsFeaturedItem = {
  id: string;
  title: string;
  dateRange: string;
  venue: string;
  image: string;
  href?: string;
};

export type EventsCalendarEntry = {
  id: string;
  title: string;
  venue: string;
  dates: string;
  href: string;
};

export type EventsCalendarMonth = {
  id: string;
  label: string;
  events: EventsCalendarEntry[];
};

export type EventsPastItem = {
  id: string;
  title: string;
  dateRange: string;
  image: string;
  href: string;
};

/** Featured carousel — desktop: 2 cards per Swiper slide (slidesPerView/Group: 2) */
export const eventsFeaturedItems: EventsFeaturedItem[] = [
  {
    id: "featured-1",
    title: "Data Center World (DCW)",
    dateRange: "Apr 21, 2026 - Apr 23, 2026",
    venue: "Washington, D.C.",
    image: "/img/company/events/featured_01.png",
    href: "/company/events/detail",
  },
  {
    id: "featured-2",
    title: "IEEE PES T&D",
    dateRange: "Apr 21, 2026 - Apr 23, 2026",
    venue: "Las Vegas",
    image: "/img/company/events/featured_02.png",
    href: "/company/events/detail",
  },
  {
    id: "featured-3",
    title: "Data Center World (DCW)",
    dateRange: "Apr 21, 2026 - Apr 23, 2026",
    venue: "Las Vegas",
    image: "/img/company/events/featured_01.png",
    href: "/company/events/detail",
  },
  {
    id: "featured-4",
    title: "IEEE PES T&D",
    dateRange: "Apr 21, 2026 - Apr 23, 2026",
    venue: "Washington, D.C.",
    image: "/img/company/events/featured_02.png",
    href: "/company/events/detail",
  },
];

export const eventsCalendarMonths: EventsCalendarMonth[] = [
  {
    id: "2026-02",
    label: "Feb, 2026",
    events: [
      {
        id: "cal-02-1",
        title: "Data Center World (DCW)",
        venue: "Las Vegas",
        dates: "Feb 02, 2026~ Feb 04, 2026",
        href: "/company/events/detail",
      },
      {
        id: "cal-02-2",
        title: "IEEE PES T&D",
        venue: "Washington, D.C.",
        dates: "Feb 02, 2026~ Feb 04, 2026",
        href: "/company/events/detail",
      },
    ],
  },
  {
    id: "2026-03",
    label: "Mar, 2026",
    events: [
      {
        id: "cal-03-1",
        title: "Data Center World (DCW)",
        venue: "Las Vegas",
        dates: "Feb 02, 2026~ Feb 04, 2026",
        href: "/company/events/detail",
      },
      {
        id: "cal-03-2",
        title: "IEEE PES T&D",
        venue: "Washington, D.C.",
        dates: "Feb 02, 2026~ Feb 04, 2026",
        href: "/company/events/detail",
      },
      {
        id: "cal-03-3",
        title: "Data Center World (DCW)",
        venue: "Las Vegas",
        dates: "Feb 02, 2026~ Feb 04, 2026",
        href: "/company/events/detail",
      },
      {
        id: "cal-03-4",
        title: "IEEE PES T&D",
        venue: "Washington, D.C.",
        dates: "Feb 02, 2026~ Feb 04, 2026",
        href: "/company/events/detail",
      },
    ],
  },
];

export const eventsPastItems: EventsPastItem[] = [
  {
    id: "past-01",
    title: "Data Center World 2025",
    dateRange: "Sep 09, 2025 - Sep 11, 2025",
    image: "/img/company/events/past_01.png",
    href: "/company/events/detail",
  },
  {
    id: "past-02",
    title: "Data Center World 2025",
    dateRange: "Sep 09, 2025 - Sep 11, 2025",
    image: "/img/company/events/past_02.png",
    href: "/company/events/detail",
  },
  {
    id: "past-03",
    title: "Data Center World 2025",
    dateRange: "Sep 09, 2025 - Sep 11, 2025",
    image: "/img/company/events/past_03.png",
    href: "/company/events/detail",
  },
  {
    id: "past-04",
    title: "Data Center World 2025",
    dateRange: "Sep 09, 2025 - Sep 11, 2025",
    image: "/img/company/events/past_04.png",
    href: "/company/events/detail",
  },
  {
    id: "past-05",
    title: "Data Center World 2025",
    dateRange: "Sep 09, 2025 - Sep 11, 2025",
    image: "/img/company/events/past_05.png",
    href: "/company/events/detail",
  },
  {
    id: "past-06",
    title: "ELECS Vietnam 2025",
    dateRange: "Sep 09, 2025 - Sep 11, 2025",
    image: "/img/company/press/list_06.png",
    href: "/company/events/detail",
  },
  {
    id: "past-07",
    title: "Data Center World 2025",
    dateRange: "Sep 09, 2025 - Sep 11, 2025",
    image: "/img/company/press/list_07.png",
    href: "/company/events/detail",
  },
  {
    id: "past-08",
    title: "Data Center World 2025",
    dateRange: "Sep 09, 2025 - Sep 11, 2025",
    image: "/img/company/events/past_08.png",
    href: "/company/events/detail",
  },
  {
    id: "past-09",
    title: "JECA Fair 2025",
    dateRange: "Sep 09, 2025 - Sep 11, 2025",
    image: "/img/company/events/past_09.png",
    href: "/company/events/detail",
  },
];

export const eventsPastPager = {
  currentPage: 1,
  totalPages: 5,
};
