import type { CSSProperties, ReactNode } from "react";
import CompanyAboutIntroSection from "./CompanyAboutIntroSection";
import CompanyAboutTitleSection from "./CompanyAboutTitleSection";
import {
  esgClimate,
  esgIntro,
  esgPageTitle,
  esgPolicies,
  esgVision,
} from "../data/esgContent";

export type EsgPreviewSection = "title" | "intro" | "vision" | "climate" | "policies";

type CompanyEsgPageProps = {
  previewSection?: EsgPreviewSection;
};

function EsgTitleSection() {
  return (
    <CompanyAboutTitleSection
      title={esgPageTitle.title}
      description={esgPageTitle.description}
    />
  );
}

function EsgIntroSection() {
  return (
    <CompanyAboutIntroSection
      heroImage={esgIntro.heroImage}
      headlineLines={esgIntro.headlineLines}
      paragraphs={esgIntro.paragraphs}
      cta={esgIntro.cta}
      heroImagePosition="center bottom"
      paddingBottom="compact"
    />
  );
}

function EsgVisionSection() {
  return (
    <section className="company-esg-vision">
      <div className="company-esg-vision__bg" aria-hidden="true">
        <span className="company-esg-vision__bg-base" />
        <img loading="lazy" decoding="async" src={esgVision.backgroundImage} alt="" />
      </div>
      <div className="company-esg-vision__mgmt">
        <img
          loading="lazy"
          decoding="async"
          className="company-esg-vision__arrow"
          src={esgVision.arrowImage}
          alt=""
          aria-hidden="true"
        />
        <div className="inner">
          <div className="company-esg-vision__mgmt-stack">
            <div className="company-esg-vision__block company-esg-vision__block--mission">
              <p className="company-esg-vision__label">Mission</p>
              <img
                loading="lazy"
                decoding="async"
                className="company-esg-vision__mission"
                src={esgVision.missionImage}
                alt="Futuring SMART ENERGY"
              />
            </div>
            <div className="company-esg-vision__block company-esg-vision__block--vision">
              <p className="company-esg-vision__label">Vision</p>
              <img
                loading="lazy"
                decoding="async"
                className="company-esg-vision__emblem"
                src={esgVision.visionEmblemImage}
                alt="DRIVE CHANGE FOR 2030"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="company-esg-vision__content">
        <div className="inner">
          <div className="company-esg-vision__content-stack">
            <div className="company-esg-vision__block company-esg-vision__block--management">
              <p className="company-esg-vision__label">ESG Management Vision</p>
              <div className="company-esg-vision__pill">
                <img
                  loading="lazy"
                  decoding="async"
                  src={esgVision.managementVisionImage}
                  alt="Sustainable Future with Green Energy Solution"
                />
              </div>
            </div>
            <div className="company-esg-vision__block company-esg-vision__block--directivity">
              <p className="company-esg-vision__label">ESG Directivity</p>
              <ul className="company-esg-vision__cards">
                {esgVision.directivityCards.map((card) => (
                  <li key={card.id} className="company-esg-vision__card">
                    <img
                      loading="lazy"
                      decoding="async"
                      className="company-esg-vision__card-icon"
                      src={card.iconImage}
                      alt=""
                    />
                    <p className="company-esg-vision__card-text">
                      {card.titleLines.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EsgClimateSection() {
  return (
    <section className="company-esg-climate">
      <div className="inner">
        <header className="company-esg-climate__head">
          <h2 className="company-esg-climate__title">
            {esgClimate.titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className="company-esg-climate__desc">{esgClimate.description}</p>
        </header>
        <div className="company-esg-climate__roadmap">
          <h3 className="company-esg-climate__roadmap-title">{esgClimate.roadmapTitle}</h3>
          <img
            className="company-esg-climate__roadmap-body"
            loading="lazy"
            decoding="async"
            src={esgClimate.roadmapBodyImage}
            alt={esgClimate.roadmapBodyAlt}
          />
          <ol className="company-esg-climate__roadmap-phases">
            {esgClimate.roadmapPhases.map((phase) => (
              <li
                key={phase.id}
                className="company-esg-climate__roadmap-phase"
                style={
                  {
                    "--roadmap-progress-h": `${phase.lineProgressHeight}px`,
                  } as CSSProperties
                }
              >
                <div className="company-esg-climate__roadmap-line" aria-hidden="true">
                  <span className="company-esg-climate__roadmap-line-track" />
                  <span className="company-esg-climate__roadmap-line-progress" />
                </div>
                <div className="company-esg-climate__roadmap-phase-body">
                  <div className="company-esg-climate__roadmap-phase-head">
                    <p className="company-esg-climate__roadmap-phase-label">{phase.phaseLabel}</p>
                    <p className="company-esg-climate__roadmap-phase-heading">{phase.title}</p>
                  </div>
                  <ul className="company-esg-climate__roadmap-items">
                    {phase.items.map((item) => {
                      const subItems = "subItems" in item ? item.subItems : undefined;

                      return (
                      <li key={item.text} className="company-esg-climate__roadmap-item">
                        <p className="company-esg-climate__roadmap-item-text">{item.text}</p>
                        {subItems?.length ? (
                          <ul className="company-esg-climate__roadmap-subitems">
                            {subItems.map((subItem) => (
                              <li key={subItem} className="company-esg-climate__roadmap-subitem">
                                {subItem}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function EsgPoliciesSection() {
  return (
    <section className="company-esg-policies">
      <div className="inner">
        <header className="company-esg-policies__head">
          <h2 className="company-esg-policies__title">{esgPolicies.title}</h2>
          <p className="company-esg-policies__desc">{esgPolicies.description}</p>
        </header>
        <ul className="company-esg-policies__cards">
          {esgPolicies.items.map((item) => (
            <li key={item.id} className="company-esg-policies__card">
              <div className="company-esg-policies__card-meta">
                <p className="company-esg-policies__card-name">{item.name}</p>
                <span className="company-esg-policies__card-divider" aria-hidden="true" />
                <p className="company-esg-policies__card-standard">{item.standard}</p>
              </div>
              <a href={item.downloadHref} className="btn-base btn-lv03 btn-lv03--line">
                Download
                <span className="icon_download" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const esgPreviewSections: Record<EsgPreviewSection, () => ReactNode> = {
  title: EsgTitleSection,
  intro: EsgIntroSection,
  vision: EsgVisionSection,
  climate: EsgClimateSection,
  policies: EsgPoliciesSection,
};

export default function CompanyEsgPage({ previewSection }: CompanyEsgPageProps = {}) {
  if (previewSection) {
    const PreviewSection = esgPreviewSections[previewSection];
    return <PreviewSection />;
  }

  return (
    <main className="company-page company-page--esg" id="P-FO-COMP-040000P">
      <EsgTitleSection />
      <EsgIntroSection />
      <EsgVisionSection />
      <EsgClimateSection />
      <EsgPoliciesSection />
    </main>
  );
}
