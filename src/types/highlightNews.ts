/** HighlightNewsSection에 주입하는 카드 1건 */
export type HighlightNewsItem = {
  id: string;
  href: string;
  image: string;
  imageAlt?: string;
  tag: string;
  title: string;
  date: string;
};

/** 스타일 변형 (레이아웃·타이포만 구분, 데이터와 무관) */
export type HighlightNewsVariant = "main" | "markets";
