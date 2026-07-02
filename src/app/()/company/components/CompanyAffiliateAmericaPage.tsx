import type { ReactNode } from "react";
import CompanyAboutIntroSection from "./CompanyAboutIntroSection";
import CompanyAboutTitleSection from "./CompanyAboutTitleSection";
import {
  affiliateIntro,
  affiliateList,
  affiliatePageTitle,
  type AffiliateAmericaItem,
} from "../data/affiliateAmericaContent";

export type AffiliateAmericaPreviewSection = "title" | "intro" | "list";

type CompanyAffiliateAmericaPageProps = {
  previewSection?: AffiliateAmericaPreviewSection;
};

function AffiliateTitleSection() {
  return (
    <CompanyAboutTitleSection
      title={affiliatePageTitle.title}
      description={affiliatePageTitle.description}
    />
  );
}

function AffiliateIntroSection() {
  return (
    <CompanyAboutIntroSection
      heroImage={affiliateIntro.heroImage}
      headlineLines={affiliateIntro.headlineLines}
      paragraphs={affiliateIntro.paragraphs}
      heroImagePosition="center bottom"
      headlineSize="wide"
      paddingBottom="compact"
    />
  );
}

function AffiliateField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="company-affiliate-list__field">
      <dt className="company-affiliate-list__label">{label}</dt>
      <dd className="company-affiliate-list__value">{children}</dd>
    </div>
  );
}

function AffiliateRow({ item }: { item: AffiliateAmericaItem }) {
  return (
    <li className="company-affiliate-list__item">
      <div className="company-affiliate-list__logo">
        <img
          loading="lazy"
          decoding="async"
          src={item.logo}
          alt=""
          width={item.logoWidth}
          height={item.logoHeight}
        />
      </div>
      <div className="company-affiliate-list__meta">
        <dl className="company-affiliate-list__fields company-affiliate-list__fields--left">
          <AffiliateField label="Founded Year">{item.foundedYear}</AffiliateField>
          <AffiliateField label="Website">
            <a href={item.websiteHref} target="_blank" rel="noopener noreferrer">
              {item.website}
            </a>
          </AffiliateField>
        </dl>
        <dl className="company-affiliate-list__fields company-affiliate-list__fields--right">
          <AffiliateField label="Key Business Areas">{item.keyBusinessAreas}</AffiliateField>
          <AffiliateField label="Address">{item.headquarters}</AffiliateField>
        </dl>
      </div>
    </li>
  );
}

function AffiliateListSection() {
  return (
    <section className="company-affiliate-list">
      <div className="inner">
        <ul className="company-affiliate-list__items">
          {affiliateList.map((item) => (
            <AffiliateRow key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}

const affiliatePreviewSections: Record<AffiliateAmericaPreviewSection, () => ReactNode> = {
  title: AffiliateTitleSection,
  intro: AffiliateIntroSection,
  list: AffiliateListSection,
};

export default function CompanyAffiliateAmericaPage({
  previewSection,
}: CompanyAffiliateAmericaPageProps = {}) {
  if (previewSection) {
    const PreviewSection = affiliatePreviewSections[previewSection];
    return <PreviewSection />;
  }

  return (
    <main
      className="company-page company-page--affiliate-america"
      id="P-FO-COMP-030000P"
    >
      <AffiliateTitleSection />
      <AffiliateIntroSection />
      <AffiliateListSection />
    </main>
  );
}
