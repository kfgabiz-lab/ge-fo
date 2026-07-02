import GuideNav from "@/components/guide/GuideNav";
import GuidePageHeader from "@/components/guide/GuidePageHeader";
import GuideRelated from "@/components/guide/GuideRelated";
import GnbGuidePreview from "@/components/guide/GnbGuidePreview";
import {
  gnbGuideClassRefs,
  gnbGuideGlobal,
  gnbGuideIcons,
  gnbGuidePanels,
} from "@/data/gnbGuide";

const tocItems = [
  { id: "gnb-preview", label: "Live preview" },
  { id: "gnb-structure", label: "Structure" },
  { id: "gnb-panels", label: "Mega panels" },
  { id: "gnb-icons", label: "Icons" },
  { id: "gnb-classes", label: "Class refs" },
] as const;

export default function GnbGuide() {
  return (
    <section className="guide-doc gnb-guide">
      <GuidePageHeader
        title="GNB Guide"
        description={
          <>
            글로벌 내비·메가 메뉴 전용 가이드. 스타일:{" "}
            <code>src/assets/css/components/gnb.css</code> · 상세:{" "}
            <code>docs/GNB_GUIDE.md</code>
          </>
        }
      />

      <GuideRelated excludeHref="/guide/gnb" />
      <GuideNav current="gnb" />

      <nav className="guide-doc__toc gnb-guide-toc" aria-label="섹션">
        {tocItems.map((item) => (
          <a key={item.id} href={`#${item.id}`}>
            {item.label}
          </a>
        ))}
      </nav>

      <section id="gnb-preview" className="guide-doc__section">
        <h2 className="guide-doc__section-title">
          Live preview
          <span className="guide-doc__count">GnbMenu.tsx</span>
        </h2>
        <p className="gnb-guide__lead">
          실제 <code>GnbMenu</code> 컴포넌트입니다. 1depth 클릭으로 메가 메뉴·Explore
          All·depth_1 active 보더를 확인하세요.
        </p>
        <GnbGuidePreview />
      </section>

      <section id="gnb-structure" className="guide-doc__section">
        <h2 className="guide-doc__section-title">Structure</h2>
        <div className="guide-doc__rules">
          <pre className="gnb-guide__tree">
{`GnbMenu.tsx (variant: main | markets)
  └── gnbNavItems (src/data/gnb/navItems.ts) — Products & Systems · Markets · …
        └── megaMenu per nav
              ├── devices  → GnbDevicesMegaPanel / GnbMegaPanel (4depth)
              └── simple   → grid (Markets) | sections (Services, Support, Company, …)
  └── GnbGlobalTrigger → #${gnbGuideGlobal.menuId} (active: ${gnbGuideGlobal.triggerLabel})`}
          </pre>
          <ul>
            <li>
              패널 ID: <code>src/data/gnb/panelIds.ts</code> (
              <code>GNB_MEGA_PANEL_ID</code>)
            </li>
            <li>
              CSS modifier: <code>getMegaPanelClassName.ts</code>
            </li>
            <li>
              글로벌 리전: <code>{gnbGuideGlobal.dataFile}</code> · 활성{" "}
              <strong>{gnbGuideGlobal.triggerLabel}</strong> · Figma{" "}
              {gnbGuideGlobal.figmaNote}
            </li>
            <li>
              Explore All: <code>src/data/gnbExploreAllProducts.ts</code> ·{" "}
              <code>/products-systems/explore-all</code>
            </li>
          </ul>
        </div>
      </section>

      <section id="gnb-panels" className="guide-doc__section">
        <h2 className="guide-doc__section-title">
          Mega panels
          <span className="guide-doc__count">{gnbGuidePanels.length}</span>
        </h2>
        <div className="gnb-guide-table-wrap">
          <table className="gnb-guide-table">
            <thead>
              <tr>
                <th scope="col">Nav</th>
                <th scope="col">Panel ID</th>
                <th scope="col">Type</th>
                <th scope="col">Data</th>
                <th scope="col">Component</th>
                <th scope="col">CSS</th>
              </tr>
            </thead>
            <tbody>
              {gnbGuidePanels.map((panel) => (
                <tr key={panel.navId}>
                  <td>
                    <strong>{panel.label}</strong>
                    <code className="gnb-guide-table__code">{panel.navId}</code>
                  </td>
                  <td>
                    <code>#{panel.panelId}</code>
                  </td>
                  <td>{panel.menuType}</td>
                  <td>
                    <code>{panel.dataFile}</code>
                  </td>
                  <td>
                    <code>{panel.component}</code>
                  </td>
                  <td>
                    <code>{panel.cssModifier}</code>
                    {panel.figmaNote ? (
                      <span className="gnb-guide-table__figma">
                        Figma {panel.figmaNote}
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="gnb-icons" className="guide-doc__section">
        <h2 className="guide-doc__section-title">
          GNB icons
          <span className="guide-doc__count">{gnbGuideIcons.length}</span>
        </h2>
        <p className="gnb-guide__lead">
          Icon Guide의 GNB 카테고리와 중복하지 않습니다. 목록:{" "}
          <code>src/data/gnbGuide.ts</code>
        </p>
        <div className="gnb-guide-icon-grid">
          {gnbGuideIcons.map((icon) => (
            <article key={icon.id} className="gnb-guide-icon-card">
              <div className="gnb-guide-icon-card__preview" aria-hidden>
                <img
                  src={icon.path}
                  alt=""
                  width={icon.size}
                  height={icon.size}
                />
              </div>
              <h3>
                <code>{icon.fileName}</code>
              </h3>
              <p>{icon.usage}</p>
              <p className="gnb-guide-icon-card__used">
                <code>{icon.usedIn}</code>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="gnb-classes" className="guide-doc__section">
        <h2 className="guide-doc__section-title">Class references</h2>
        <ul className="gnb-guide-class-list">
          {gnbGuideClassRefs.map((ref) => (
            <li key={ref.block}>
              <strong>{ref.block}</strong>
              <code>{ref.classes}</code>
              <span>{ref.file}</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
