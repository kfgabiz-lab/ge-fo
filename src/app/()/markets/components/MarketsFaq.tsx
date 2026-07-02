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
         Learn how LS ELECTRIC's tailored power and automation solutions are engineered to solve your specific market challenges and accelerate your critical business objectives
        </>
      }
      items={items}
    />
  );
}
