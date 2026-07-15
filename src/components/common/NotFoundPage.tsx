import NotFoundHelpfulLinks from "@/components/common/not-found/NotFoundHelpfulLinks";
import NotFoundSearch from "@/components/common/not-found/NotFoundSearch";
import NotFoundTitle from "@/components/common/not-found/NotFoundTitle";
import "@/assets/css/common-404.css";

/** P-FO-COMMON-010000P — Figma 7334:130743 · 404 Not found */
export default function NotFoundPage() {
  return (
    <main className="common-page common-page--404" id="P-FO-COMMON-010000P">
      <NotFoundTitle />
      <NotFoundSearch />
      <NotFoundHelpfulLinks />
    </main>
  );
}
