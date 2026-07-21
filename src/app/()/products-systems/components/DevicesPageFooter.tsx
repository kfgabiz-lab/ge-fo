import CommonBanner04 from "@/components/banners/CommonBanner04";
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import CommonFaq, { type CommonFaqEntry } from "@/components/faq/CommonFaq";
import { fetchMainHighlightNews } from "@/data/highlightNews";

type DevicesPageFooterProps = {
  // 값이 있으면 하단에 FAQ 섹션(제품 상세 페이지)을 노출한다.
  // 없으면 배너 + Highlights 까지만 노출한다(카테고리/랜딩 페이지).
  faqItems?: CommonFaqEntry[];
};

// products-systems 디바이스 페이지 공통 하단 섹션.
// CommonBanner04 + Highlights 뉴스 섹션(+ 선택적으로 제품 FAQ)을 동일한 구성으로 렌더링한다.
// Highlights는 main/markets와 동일한 fetchMainHighlightNews()(press/blog/articles 통합 최신 3건)를 재사용한다.
// products-systems 페이지는 market 축이 아니라 제품 카테고리 축이라 market 필터를 걸 자연스러운 값이 없어 market 무관 버전을 쓴다.
export default async function DevicesPageFooter({ faqItems }: DevicesPageFooterProps) {
  const highlightItems = await fetchMainHighlightNews();
  return (
    <>
      <CommonBanner04 />
      <HighlightNewsSection
        variant="markets"
        title="Highlights"
        items={highlightItems}
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
