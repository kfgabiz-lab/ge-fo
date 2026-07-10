import CommonFaq from "@/components/faq/CommonFaq";
import { faqItems, type FaqItem } from "../data/marketsContent";

type MarketsFaqProps = {
  items?: FaqItem[];
};

export default function MarketsFaq({ items = faqItems }: MarketsFaqProps) {
  return (
    <CommonFaq
      description={
        <>
          Find quick answers to common questions about installation,
          troubleshooting, and maintenance. <br /> Our expert engineering team has
          curated these responses to help you optimize product performance.
        </>
      }
      items={items}
    />
  );
}
