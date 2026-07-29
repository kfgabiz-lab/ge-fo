export type HighlightNewsItem = {
  id: string;
  href: string;
  image: string;
  imageAlt?: string;
  tag: string;
  title: string;
  date: string;
};

export type HighlightNewsVariant = "main" | "markets";
