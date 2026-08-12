export type CompanyFeedListItem = {
  id: string;
  title: string;
  date: string;
  image: string;
  href?: string;
};

export type CompanyFeedVariant = "press" | "articles";

export type CompanyFeedFeaturedData = {
  title: string;
  description: string;
  date: string;
  image: string;
  href: string;
};
