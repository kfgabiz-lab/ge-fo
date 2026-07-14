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

// 공통 피드 리스트 아이템 타입 (Press/Articles 동일 구조)
export type CompanyFeedListItem = {
  id: string;
  title: string;
  date: string;
  image: string;
};

// 공통 피드 variant (Press/Articles)
export type CompanyFeedVariant = "press" | "articles";

// Featured 카드 데이터 타입
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

// variant별 콘텐츠/기본 pageId 매핑 (기존 개별 Page 컴포넌트의 기본값을 그대로 이관)
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
