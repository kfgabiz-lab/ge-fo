import Link from "next/link";

const relatedLinks = [
  { href: "/guide", label: "Design Guide" },
  { href: "/guide/components", label: "Component Guide" },
  { href: "/guide/sections", label: "Section Guide" },
  { href: "/guide/gnb", label: "GNB Guide" },
  { href: "/guide/ico", label: "Icon Guide" },
] as const;

type GuideRelatedProps = {
  /** 현재 페이지 href — 목록에서 제외 */
  excludeHref?: string;
};

export default function GuideRelated({ excludeHref }: GuideRelatedProps) {
  const links = relatedLinks.filter((item) => item.href !== excludeHref);

  if (links.length === 0) return null;

  return (
    <nav className="guide-doc__related" aria-label="관련 가이드">
      {links.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
