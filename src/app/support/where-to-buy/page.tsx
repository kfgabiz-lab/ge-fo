import WhereToBuyBanner from "./components/WhereToBuyBanner";
import WhereToBuyContents from "./components/WhereToBuyContents";
import WhereToBuyTitle from "./components/WhereToBuyTitle";
import "@/assets/css/support.css";

export default function WhereToBuyPage() {
  return (
    <main
      className="support-page support-page--where-to-buy"
      id="P-FO-SUPP-040000P"
    >
      <WhereToBuyTitle />
      <WhereToBuyContents />
      <WhereToBuyBanner />
    </main>
  );
}
