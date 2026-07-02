import CompanyAboutIntroSection from "./CompanyAboutIntroSection";
import CompanyAboutSectionHead from "./CompanyAboutSectionHead";
import CompanyAboutTitleSection from "./CompanyAboutTitleSection";
import {
  CompanyLsElectricGlobalStats,
  CompanyLsElectricHighlightsStats,
} from "./CompanyLsElectricCountUpStats";
import CompanyMissionSection from "./CompanyMissionSection";
import {
  lsElectricBusiness,
  lsElectricGlobal,
  lsElectricHighlights,
  lsElectricHistory,
  lsElectricIntro,
  lsElectricPageTitle,
  lsElectricPtt,
  lsElectricRnd,
  type LsElectricBusinessCard,
  type LsElectricHistoryEra,
  type LsElectricPttCard,
  type LsElectricRndItem,
} from "../data/lsElectricContent";

export type LsElectricPreviewSection =
  | "title"
  | "intro"
  | "highlights"
  | "business"
  | "global"
  | "ptt"
  | "rnd"
  | "history"
  | "mission";

type CompanyLsElectricPageProps = {
  previewSection?: LsElectricPreviewSection;
};

function BusinessCard({ card }: { card: LsElectricBusinessCard }) {
  return (
    <article
      className={[
        "company-ls-electric-business__card",
        card.gradient === "top" && "company-ls-electric-business__card--gradient-top",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <img loading="lazy" decoding="async" src={card.image} alt="" />
      <span className="company-ls-electric-business__card-overlay" aria-hidden />
      <div className="company-ls-electric-business__card-content">
        <h3 className="company-ls-electric-business__card-tit">{card.title}</h3>
        <span className="company-ls-electric-business__card-line" aria-hidden />
        <ul className="company-ls-electric-business__card-list">
          {card.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function LsElectricGlobalSection() {
  return (
    <section className="company-ls-electric-global">
      <div className="company-ls-electric-global__bg" aria-hidden>
        <img
          loading="lazy"
          decoding="async"
          src={lsElectricGlobal.bgTexture}
          alt=""
          className="company-ls-electric-global__bg-texture"
        />
      </div>
      <div className="inner">
        <div className="company-ls-electric-global__head">
          <h2 className="company-ls-electric-global__tit">{lsElectricGlobal.title}</h2>
          <p className="company-ls-electric-global__desc">{lsElectricGlobal.description}</p>
        </div>
        <div className="company-ls-electric-global__visual">
          <div className="company-ls-electric-global__map">
            <img
              loading="lazy"
              decoding="async"
              src={lsElectricGlobal.mapImage}
              alt="LS ELECTRIC global network map"
            />
          </div>
          <CompanyLsElectricGlobalStats stats={lsElectricGlobal.stats} />
        </div>
      </div>
    </section>
  );
}

function PttCard({ card }: { card: LsElectricPttCard }) {
  return (
    <article className="company-ls-electric-ptt__card">
      <div className="company-ls-electric-ptt__card-img">
        <img loading="lazy" decoding="async" src={card.image} alt="" />
      </div>
      <div className="company-ls-electric-ptt__card-body">
        <h3 className="company-ls-electric-ptt__card-tit">{card.title}</h3>
        <p className="company-ls-electric-ptt__card-sub">{card.subtitle}</p>
        <p className="company-ls-electric-ptt__card-desc">{card.description}</p>
      </div>
    </article>
  );
}

function RndItem({ item }: { item: LsElectricRndItem }) {
  return (
    <article className="company-ls-electric-rnd__item">
      <span className="company-ls-electric-rnd__num" aria-hidden>
        {item.number}
      </span>
      <div className="company-ls-electric-rnd__item-text">
        <h3 className="company-ls-electric-rnd__item-tit">{item.title}</h3>
        <p className="company-ls-electric-rnd__item-desc">{item.description}</p>
      </div>
    </article>
  );
}

function HistoryEra({ era }: { era: LsElectricHistoryEra }) {
  return (
    <li
      className={[
        "company-ls-electric-history__era",
        `company-ls-electric-history__era--${era.id}`,
        era.align === "left"
          ? "company-ls-electric-history__era--left"
          : "company-ls-electric-history__era--right",
      ].join(" ")}
    >
      <div className="company-ls-electric-history__era-body">
        <div className="company-ls-electric-history__era-media">
          <div className="company-ls-electric-history__era-head">
            <h3 className="company-ls-electric-history__era-tit">{era.title}</h3>
            <p className="company-ls-electric-history__era-sub">{era.subtitle}</p>
          </div>
          <div className="company-ls-electric-history__era-img">
            <img loading="lazy" decoding="async" src={era.image} alt="" />
          </div>
        </div>
        <div className="company-ls-electric-history__era-conts">
          <p className="company-ls-electric-history__era-period">{era.period}</p>
          <ul className="company-ls-electric-history__events">
            {era.events.map((event) => (
              <li key={`${event.date}-${event.text.slice(0, 24)}`}>
                <span className="company-ls-electric-history__event-date">{event.date}</span>
                <span className="company-ls-electric-history__event-text">{event.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

function LsElectricTitleSection() {
  return (
    <CompanyAboutTitleSection
      title={lsElectricPageTitle.title}
      description={lsElectricPageTitle.description}
    />
  );
}

function LsElectricIntroSection() {
  return (
    <CompanyAboutIntroSection
      heroImage={lsElectricIntro.heroImage}
      headlineLines={lsElectricIntro.headlineLines}
      paragraphs={lsElectricIntro.paragraphs}
    />
  );
}

function LsElectricHighlightsSection() {
  return (
    <section className="company-ls-electric-highlights">
      <div className="company-ls-electric-highlights__bg" aria-hidden>
        <img
          loading="lazy"
          decoding="async"
          src={lsElectricHighlights.bgImage}
          alt=""
          className="company-ls-electric-highlights__bg-img company-ls-electric-highlights__bg-img--pc"
        />
        <img
          loading="lazy"
          decoding="async"
          src={lsElectricHighlights.bgImageMo}
          alt=""
          className="company-ls-electric-highlights__bg-img company-ls-electric-highlights__bg-img--mo"
        />
        <span className="company-ls-electric-highlights__overlay" aria-hidden />
      </div>
      <div className="inner">
        <div className="company-ls-electric-highlights__head">
          <h2 className="company-ls-electric-highlights__tit">{lsElectricHighlights.title}</h2>
          <a
            href={lsElectricHighlights.ctaHref}
            className="btn-text-30 company-ls-electric-highlights__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {lsElectricHighlights.ctaLabel}
            <span
              className="btn-text-30__icon company-ls-electric-highlights__link-icon company-ls-electric-highlights__link-icon--pc"
              aria-hidden="true"
            >
              <span className="icon_arrow-14" />
            </span>
            <span
              className="btn-text-30__icon company-ls-electric-highlights__link-icon company-ls-electric-highlights__link-icon--mo"
              aria-hidden="true"
            >
              <span className="icon_arrow-14" />
            </span>
          </a>
        </div>
        <CompanyLsElectricHighlightsStats stats={lsElectricHighlights.stats} />
        <p className="company-ls-electric-highlights__footnote">{lsElectricHighlights.footnote}</p>
      </div>
    </section>
  );
}

function LsElectricBusinessSection() {
  return (
    <section className="company-ls-electric-business">
      <div className="inner">
        <CompanyAboutSectionHead
          title={lsElectricBusiness.title}
          description={lsElectricBusiness.description}
        />
        <div className="company-ls-electric-business__grid">
          {lsElectricBusiness.cards.map((card) => (
            <BusinessCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LsElectricPttSection() {
  return (
    <section className="company-ls-electric-ptt">
      <div className="company-ls-electric-ptt__bg" aria-hidden />
      <div className="inner">
        <CompanyAboutSectionHead title={lsElectricPtt.title} description={lsElectricPtt.description} />
        <div className="company-ls-electric-ptt__cards">
          {lsElectricPtt.cards.map((card) => (
            <PttCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LsElectricRndSection() {
  return (
    <section className="company-ls-electric-rnd">
      <div className="inner">
        <div className="company-ls-electric-rnd__top">
          <CompanyAboutSectionHead title={lsElectricRnd.title} description={lsElectricRnd.description} />
          <div className="company-ls-electric-rnd__hero">
            <img loading="lazy" decoding="async" src={lsElectricRnd.heroImage} alt="" />
          </div>
        </div>
        <div className="company-ls-electric-rnd__list">
          {lsElectricRnd.items.map((item) => (
            <RndItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LsElectricHistorySection() {
  return (
    <section className="company-ls-electric-history">
      <div className="inner">
        <div className="company-ls-electric-history__head">
          <h2 className="company-ls-electric-history__tit">{lsElectricHistory.title}</h2>
          <p className="company-ls-electric-history__desc">{lsElectricHistory.description}</p>
        </div>
        <ul className="company-ls-electric-history__timeline">
          {lsElectricHistory.eras.map((era) => (
            <HistoryEra key={era.id} era={era} />
          ))}
        </ul>
      </div>
    </section>
  );
}

const lsElectricPreviewSections: Record<
  LsElectricPreviewSection,
  () => React.ReactNode
> = {
  title: LsElectricTitleSection,
  intro: LsElectricIntroSection,
  highlights: LsElectricHighlightsSection,
  business: LsElectricBusinessSection,
  global: LsElectricGlobalSection,
  ptt: LsElectricPttSection,
  rnd: LsElectricRndSection,
  history: LsElectricHistorySection,
  mission: CompanyMissionSection,
};

export default function CompanyLsElectricPage({
  previewSection,
}: CompanyLsElectricPageProps = {}) {
  if (previewSection) {
    const PreviewSection = lsElectricPreviewSections[previewSection];
    return <PreviewSection />;
  }

  return (
    <main className="company-page company-page--ls-electric" id="P-FO-COMP-020000P">
      <LsElectricTitleSection />
      <LsElectricIntroSection />
      <LsElectricHighlightsSection />
      <LsElectricBusinessSection />
      <LsElectricGlobalSection />
      <LsElectricPttSection />
      <LsElectricRndSection />
      <LsElectricHistorySection />
      <CompanyMissionSection />
    </main>
  );
}
