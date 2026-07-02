import Link from "next/link";

const guideLinks = [
  { href: "/", label: "Page Index", key: "index" },
  { href: "/guide", label: "Design Guide", key: "hub" },
  { href: "/guide/components", label: "Components", key: "components" },
  { href: "/guide/sections", label: "Sections", key: "sections" },
  { href: "/guide/gnb", label: "GNB", key: "gnb" },
  { href: "/guide/ico", label: "Icons", key: "ico" },
  { href: "/main", label: "Main", key: "main" },
  { href: "/markets/commercial-residential", label: "Markets", key: "markets" },
] as const;

export type GuideNavCurrent = (typeof guideLinks)[number]["key"];

type GuideNavProps = {
  current?: GuideNavCurrent;
};

export default function GuideNav({ current }: GuideNavProps) {
  return (
    <nav className="guide-nav" aria-label="프로젝트 내비게이션">
      {guideLinks.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          aria-current={current === item.key ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
