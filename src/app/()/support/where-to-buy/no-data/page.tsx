import WhereToBuyBanner from "../components/WhereToBuyBanner";
import WhereToBuyContents from "../components/WhereToBuyContents";
import WhereToBuyTitle from "../components/WhereToBuyTitle";
import "@/assets/css/support.css";

export default function WhereToBuyNoDataPage() {
  return (
    <main
      className="support-page support-page--where-to-buy"
      id="Page_support_where_to_buy_no_data"
    >
      <WhereToBuyTitle />
      <WhereToBuyContents empty />
      <WhereToBuyBanner />
    </main>
  );
}
