import { Suspense } from "react";
// import CommonBanner04 from "@/components/banners/CommonBanner04";
import SearchAllPage from "./components/SearchAllPage";
import "@/assets/css/search.css";
import "@/assets/css/devices-product-detail.css";

export default function SearchAllRoutePage() {
  return (
    <main className="search-page" id="Page_search_all">
      <Suspense fallback={null}>
        <SearchAllPage />
      </Suspense>
      {/* <CommonBanner04 /> */}
    </main>
  );
}
