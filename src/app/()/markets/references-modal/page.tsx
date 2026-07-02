import { Suspense } from "react";
import MarketsReferencesModalPageClient from "../components/MarketsReferencesModalPageClient";
import "@/assets/css/markets.css";

export default function MarketsReferencesModalPage() {
  return (
    <Suspense fallback={null}>
      <MarketsReferencesModalPageClient />
    </Suspense>
  );
}
