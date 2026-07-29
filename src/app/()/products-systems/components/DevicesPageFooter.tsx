import CommonBanner04 from "@/components/banners/CommonBanner04";
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import CommonFaq, { type CommonFaqEntry } from "@/components/faq/CommonFaq";
import { fetchMainHighlightNews } from "@/data/highlightNews";
import type { HighlightNewsItem } from "@/types/highlightNews";

type DevicesPageFooterProps = {
  faqItems?: CommonFaqEntry[];
  highlightItems?: HighlightNewsItem[];
  bannerLinkHref?: string;
};

export default async function DevicesPageFooter({
  faqItems,
  highlightItems,
  bannerLinkHref,
}: DevicesPageFooterProps) {
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
