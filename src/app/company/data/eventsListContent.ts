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
