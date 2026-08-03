import NotFoundHelpfulLinks from "@/components/common/not-found/NotFoundHelpfulLinks";
import NotFoundSearch from "@/components/common/not-found/NotFoundSearch";
import NotFoundTitle from "@/components/common/not-found/NotFoundTitle";
import "@/assets/css/common-404.css";

export default function NotFoundPage() {
  return (
    <main className="common-page common-page--404" id="P-FO-COMMON-010000P">
      <NotFoundTitle />
      <NotFoundSearch />
      <NotFoundHelpfulLinks />
    </main>
  );
}
