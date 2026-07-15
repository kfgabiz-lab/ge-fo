import SupportPageTitle from "@/app/support/components/SupportPageTitle";
import { whereToBuyPage } from "@/data/support/whereToBuyContent";

export default function WhereToBuyTitle() {
  return (
    <SupportPageTitle
      id="support-where-to-buy-title"
      rootClass="support_where_to_buy_title"
      title={whereToBuyPage.title}
      description={whereToBuyPage.description}
      spacing="with-bottom"
      mobileInset
      variant="where-to-buy"
    />
  );
}
