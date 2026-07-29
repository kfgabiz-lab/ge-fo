import {
  pressFeatured,
  pressItems,
  pressListPager,
} from "@/app/company/data/pressListContent";
import {
  articlesFeatured,
  articlesItems,
  articlesListPager,
} from "@/app/company/data/articlesListContent";

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

type CompanyFeedContentEntry = {
  featured: CompanyFeedFeaturedData;
  items: CompanyFeedListItem[];
  pager: { currentPage: number; totalPages: number };
  pageId: string;
};

export const companyFeedContent: Record<CompanyFeedVariant, CompanyFeedContentEntry> = {
  press: {
    featured: pressFeatured,
    items: pressItems,
    pager: pressListPager,
    pageId: "Page_company_press",
  },
  articles: {
    featured: articlesFeatured,
    items: articlesItems,
    pager: articlesListPager,
    pageId: "Page_company_articles",
  },
};
