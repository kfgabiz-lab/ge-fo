import WhereToBuyBanner from "../components/WhereToBuyBanner";
import WhereToBuyContents from "../components/WhereToBuyContents";
import WhereToBuyTitle from "../components/WhereToBuyTitle";
import "@/assets/css/support.css";

export default function WhereToBuyNoDataPage() {
  return (
    <main
      className="support-page support-page--where-to-buy"
      id="P-FO-SUPP-040100S"
    >
      <WhereToBuyTitle />
      <WhereToBuyContents noDataPage />
      <WhereToBuyBanner />
    </main>
  );
}
