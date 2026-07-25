import CommonBanner04 from "@/components/banners/CommonBanner04";
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import CommonFaq, { type CommonFaqEntry } from "@/components/faq/CommonFaq";
import { fetchMainHighlightNews } from "@/data/highlightNews";
import type { HighlightNewsItem } from "@/types/highlightNews";

type DevicesPageFooterProps = {
  // 값이 있으면 하단에 FAQ 섹션(제품 상세 페이지)을 노출한다.
  // 없으면 배너 + Highlights 까지만 노출한다(카테고리/랜딩 페이지).
  faqItems?: CommonFaqEntry[];
  // 제품상세(38번): 제품에 맵핑된 게시글을 이미 조회해 전달할 때 사용. 주어지면 이 목록을 그대로 쓰고,
  // 없으면(카테고리/랜딩) 기존처럼 전체 최신 3건(fetchMainHighlightNews)을 조회한다.
  // 0건이면 HighlightNewsSection이 섹션 자체를 렌더하지 않는다(자연 숨김).
  highlightItems?: HighlightNewsItem[];
  // Lv1 카테고리 랜딩(기획서 12번 Contact Us) 전용: 하단 CommonBanner04의 링크 주소.
  // 미전달이면 CommonBanner04 기본값(빈 href = 클릭 비활성) 유지 → Lv2/제품상세 등 기존 화면은 현행 그대로.
  bannerLinkHref?: string;
};

// products-systems 디바이스 페이지 공통 하단 섹션.
// CommonBanner04 + Highlights 뉴스 섹션(+ 선택적으로 제품 FAQ)을 동일한 구성으로 렌더링한다.
// Highlights는 main/markets와 동일한 fetchMainHighlightNews()(press/blog/articles 통합 최신 3건)를 재사용한다.
// products-systems 페이지는 market 축이 아니라 제품 카테고리 축이라 market 필터를 걸 자연스러운 값이 없어 market 무관 버전을 쓴다.
export default async function DevicesPageFooter({
  faqItems,
  highlightItems,
  bannerLinkHref,
}: DevicesPageFooterProps) {
  // 제품상세에서 highlightItems를 넘기면 그대로 사용(제품 맵핑 게시글), 아니면 전체 최신 3건 조회.
  const resolvedHighlightItems = highlightItems ?? (await fetchMainHighlightNews());
  return (
    <>
      <CommonBanner04 linkHref={bannerLinkHref} />
      <HighlightNewsSection
        variant="markets"
        title="Highlights"
        items={resolvedHighlightItems}
        sectionId="devices-highlights"
      />
      {faqItems ? (
        <CommonFaq
          sectionId="product-faq"
          defaultOpenIndex={-1}
          description={
            <>
              Find quick answers to common questions about installation, troubleshooting, and
              maintenance.
              <br />
              Our expert engineering team has curated these responses to help you optimize product
              performance.
            </>
          }
          items={faqItems}
        />
      ) : null}
    </>
  );
}
