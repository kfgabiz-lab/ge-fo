import Link from "next/link";
import GuideNav from "@/components/guide/GuideNav";
import GuidePageHeader from "@/components/guide/GuidePageHeader";
import { icoItems } from "@/data/icoGuide";

const guideCards = [
  {
    href: "/guide/components",
    title: "Component Guide",
    description:
      "Button, Check, Textfield, Pagination, Banner, Modal — docs/COMPONENT_GUIDE.md",
    meta: "Figma 04~08",
  },
  {
    href: "/guide/ico",
    title: "Icon Guide",
    description: "public/ico SVG — docs/ICON_GUIDE.md",
    meta: `${icoItems.length} icons`,
  },
  {
    href: "/guide/sections",
    title: "Section Guide",
    description:
      "섹션 마크업·클래스 레지스트리 — docs/SECTION_MARKUP_GUIDE.md",
    meta: "Live previews",
  },
  {
    href: "/guide/gnb",
    title: "GNB Guide",
    description: "글로벌 내비·메가 메뉴 — docs/GNB_GUIDE.md",
    meta: "Live GnbMenu",
  },
] as const;

export default function GuideHubPage() {
  return (
    <main className="guide-hub" id="Page_design_guide">
      <GuidePageHeader
        title="Design Guide"
        description={
          <>
            LS 프로젝트 UI 가이드 허브. 문서: <code>docs/DESIGN_GUIDE.md</code>{" "}
            · 영역별 <code>COMPONENT_GUIDE</code>, <code>ICON_GUIDE</code>,{" "}
            <code>SECTION_*</code>, <a href="/guide/gnb">GNB Guide</a>
          </>
        }
      />
      <GuideNav current="hub" />

      <ul className="guide-hub__list">
        {guideCards.map((card) => (
          <li key={card.href}>
            <Link href={card.href} className="guide-hub__card">
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <span className="guide-hub__meta">{card.meta}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
