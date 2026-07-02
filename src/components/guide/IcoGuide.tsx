import GuideNav from "@/components/guide/GuideNav";
import GuidePageHeader from "@/components/guide/GuidePageHeader";
import GuideRelated from "@/components/guide/GuideRelated";
import {
  icoCategoryLabels,
  icoCategoryOrder,
  icoItems,
  getIcoItemsByCategory,
  type IcoItem,
} from "@/data/icoGuide";
import {
  pageIconCategoryLabels,
  pageIconCategoryOrder,
  pageIconCount,
  getPageIconItemsByCategory,
} from "@/data/pageIconGuide";

function IcoGuideCard({ item }: { item: IcoItem }) {
  return (
    <article className="ico-card">
      <div className="ico-preview ico-preview--dark">
        <img
          loading="lazy"
          decoding="async"
          src={item.path}
          alt={item.name}
          width={item.size}
          height={item.size}
        />
      </div>
      <div className="ico-preview ico-preview--light">
        <img
          loading="lazy"
          decoding="async"
          src={item.path}
          alt={item.name}
          width={item.size}
          height={item.size}
        />
      </div>

      <div className="ico-card-body">
        <h3 className="ico-name">{item.fileName}</h3>
        <dl className="ico-meta">
          <div>
            <dt>이름</dt>
            <dd>{item.name}</dd>
          </div>
          <div>
            <dt>크기</dt>
            <dd>{item.size}px</dd>
          </div>
          <div>
            <dt>색상</dt>
            <dd>{item.color}</dd>
          </div>
          <div>
            <dt>용도</dt>
            <dd>{item.usage}</dd>
          </div>
          {item.usedIn ? (
            <div>
              <dt>사용처</dt>
              <dd>{item.usedIn}</dd>
            </div>
          ) : null}
          <div>
            <dt>경로</dt>
            <dd>
              <code>{item.path}</code>
            </dd>
          </div>
        </dl>

        <div className="ico-code-block">
          <p className="ico-code-label">img</p>
          <pre>
            <code>{`<img loading="lazy" decoding="async" src="${item.path}" alt="" width="${item.size}" height="${item.size}" aria-hidden="true" />`}</code>
          </pre>
        </div>

        <div className="ico-code-block">
          <p className="ico-code-label">CSS (background)</p>
          <pre>
            <code>{`.icon_${item.id} {\n  width: ${item.size}px;\n  height: ${item.size}px;\n  background: url("${item.path}") no-repeat center / contain;\n}`}</code>
          </pre>
        </div>
      </div>
    </article>
  );
}

function IcoGuideSection({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: IcoItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section id={id} className="guide-doc__section ico-guide-section">
      <h2 className="guide-doc__section-title ico-guide-section-title">
        {title}
        <span className="guide-doc__count ico-guide-section-count">{items.length}</span>
      </h2>

      <div className="ico-guide-grid">
        {items.map((item) => (
          <IcoGuideCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default function IcoGuide() {
  return (
    <section className="guide-doc ico-guide">
      <GuidePageHeader
        title="Icon Guide"
        description={
          <>
            <code>public/ico</code> SVG·PNG ({icoItems.length}개) · 페이지 전용 (
            {pageIconCount}개). 앱: <code>/ico/파일명</code> · 상세:{" "}
            <code>docs/ICON_GUIDE.md</code>. GNB: <a href="/guide/gnb">GNB Guide</a> ·{" "}
            <code>docs/GNB_GUIDE.md</code>
          </>
        }
      />

      <GuideRelated excludeHref="/guide/ico" />
      <GuideNav current="ico" />

      <div className="guide-doc__rules ico-guide-rules">
        <h2>파일 네이밍</h2>
        <ul>
          <li>
            공통 아이콘은 <code>ico_</code> 접두사를 사용합니다.
          </li>
          <li>
            <code>{`ico_{역할}_{크기}_{색상}.svg`}</code> — 예:{" "}
            <code>ico_search_24_white.svg</code>
          </li>
          <li>
            <code>{`ico_{역할}.svg`}</code> — 예: <code>ico_bell_20.svg</code>
          </li>
          <li>
            체크박스 22px: <code>ico_check</code> / <code>ico_checked</code>,
            Downloads 필터 <code>ico_check_block</code> / <code>ico_checked_black</code>{" "}
            — <a href="/guide/components#check">Component Guide · Check</a>
          </li>
          <li>
            페이지 전용 아이콘은 <code>public/img/</code> 하위 —{" "}
            <code>pageIconGuide.ts</code>
          </li>
          <li>
            CSS 유틸(<code>icon_arrow-14</code> 등)은 <code>globals.css</code>에서 SVG를
            background로 매핑합니다.
          </li>
        </ul>
      </div>

      <nav className="guide-doc__toc ico-guide-toc" aria-label="카테고리">
        {icoCategoryOrder.map((category) => (
          <a key={category} href={`#ico-${category}`}>
            {icoCategoryLabels[category]}
          </a>
        ))}
        {pageIconCategoryOrder.map((category) => (
          <a key={category} href={`#ico-${category}`}>
            {pageIconCategoryLabels[category]}
          </a>
        ))}
      </nav>

      {icoCategoryOrder.map((category) => (
        <IcoGuideSection
          key={category}
          id={`ico-${category}`}
          title={icoCategoryLabels[category]}
          items={getIcoItemsByCategory(category)}
        />
      ))}

      {pageIconCategoryOrder.map((category) => (
        <IcoGuideSection
          key={category}
          id={`ico-${category}`}
          title={pageIconCategoryLabels[category]}
          items={getPageIconItemsByCategory(category)}
        />
      ))}
    </section>
  );
}
