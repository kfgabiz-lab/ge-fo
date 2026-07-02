import Link from "next/link";
import GuideNav from "@/components/guide/GuideNav";
import GuidePageHeader from "@/components/guide/GuidePageHeader";
import GuideRelated from "@/components/guide/GuideRelated";
import {
  CommonSectionPreviews,
  CompanyAmericaSectionPreviews,
  CompanyAffiliateAmericaSectionPreviews,
  CompanyCareersSectionPreviews,
  CompanyEsgSectionPreviews,
  CompanyLsElectricSectionPreviews,
  CompanyArticleDetailSectionPreviews,
  CompanyBlogSectionPreviews,
  CompanyEventsSectionPreviews,
  CompanyPressSectionPreviews,
  DevicesSectionPreviews,
  MainSectionPreviews,
  MarketsSectionPreviews,
  ProductSectionPreviews,
  SupportConnectSectionPreviews,
  SupportContactUsSectionPreviews,
  SupportDownloadSectionPreviews,
  SupportTechHubSectionPreviews,
  SupportTechHubViewSectionPreviews,
  SupportWhereToBuySectionPreviews,
  ServicesServiceCenterSectionPreviews,
  ServicesWarrantyPolicySectionPreviews,
  ServicesEngineeringTrainingSectionPreviews,
  ServicesEngineeringTrainingDetailSectionPreviews,
  ServicesEngineeringTrainingSessionSectionPreviews,
  ServicesRequestForTrainingSectionPreviews,
  SearchSectionPreviews,
} from "@/components/guide/SectionGuidePreviews";
import {
  sectionGuideCategories,
  sectionGuideEntryCount,
} from "@/data/sectionGuide";

const previewByCategory = {
  main: MainSectionPreviews,
  markets: MarketsSectionPreviews,
  devices: DevicesSectionPreviews,
  product: ProductSectionPreviews,
  "company-america": CompanyAmericaSectionPreviews,
  "company-ls-electric": CompanyLsElectricSectionPreviews,
  "company-affiliate-america": CompanyAffiliateAmericaSectionPreviews,
  "company-careers": CompanyCareersSectionPreviews,
  "company-esg": CompanyEsgSectionPreviews,
  "company-blog": CompanyBlogSectionPreviews,
  "company-press": CompanyPressSectionPreviews,
  "company-events": CompanyEventsSectionPreviews,
  "company-article-detail": CompanyArticleDetailSectionPreviews,
  common: CommonSectionPreviews,
  support: SupportConnectSectionPreviews,
  "support-download": SupportDownloadSectionPreviews,
  "support-tech-hub": SupportTechHubSectionPreviews,
  "support-contact-us": SupportContactUsSectionPreviews,
  "support-where-to-buy": SupportWhereToBuySectionPreviews,
  "support-tech-hub-view": SupportTechHubViewSectionPreviews,
  "services-service-center": ServicesServiceCenterSectionPreviews,
  "services-warranty-policy": ServicesWarrantyPolicySectionPreviews,
  "services-engineering-training": ServicesEngineeringTrainingSectionPreviews,
  "services-engineering-training-detail": ServicesEngineeringTrainingDetailSectionPreviews,
  "services-engineering-training-session": ServicesEngineeringTrainingSessionSectionPreviews,
  "services-request-for-training": ServicesRequestForTrainingSectionPreviews,
  search: SearchSectionPreviews,
} as const;

export default function SectionGuide() {
  return (
    <section className="guide-doc section-guide">
      <GuidePageHeader
        title="Section Guide"
        description={
          <>
            프로젝트 섹션 루트 클래스 레지스트리와 라이브 미리보기 ({sectionGuideEntryCount}
            entries). 마크업 규칙: <code>docs/SECTION_MARKUP_GUIDE.md</code> ·
            레지스트리: <code>docs/SECTION_CLASS_GUIDE.md</code>
          </>
        }
      />

      <GuideRelated excludeHref="/guide/sections" />
      <GuideNav current="sections" />

      <div className="section-guide__rules">
        <h2>네이밍 규칙</h2>
        <p>
          상세: <code>docs/SECTION_MARKUP_GUIDE.md</code> · 클래스 목록:{" "}
          <code>docs/SECTION_CLASS_GUIDE.md</code>
        </p>
        <ul>
          <li>
            섹션 루트: <code>{`{domain}_{block}`}</code> — 예:{" "}
            <code>markets_hero</code>
          </li>
          <li>
            하위 요소: <code>{`{root}__{element}`}</code> — 예:{" "}
            <code>markets_hero__tit</code>
          </li>
          <li>
            변형: <code>{`{root}--{variant}`}</code> — 예:{" "}
            <code>devices_help--overlay</code>
          </li>
          <li>
            공통 타이포: <code>.section_tit</code>, <code>.section_desc</code>,{" "}
            <code>.inner</code> (<code>globals.css</code>)
          </li>
        </ul>
        <h3>타이포그래피</h3>
        <p>
          상세: <code>docs/SECTION_MARKUP_GUIDE.md</code> § 타이포그래피
        </p>
        <ul>
          <li>
            페이지 h1 <code>__heading</code>: 70px / <strong>line-height 80px</strong> / weight
            800 — <code>line-height: 1</code> 금지
          </li>
          <li>
            페이지 <code>__desc</code>: 18px / line-height 28px / weight <strong>400</strong> /
            #666 — weight 300 금지
          </li>
          <li>
            섹션 h2 <code>.section_tit</code>: 50px / 62px · <code>.section_desc</code>: 18px /
            28px
          </li>
          <li>
            Hero 부제 <code>__sub</code>만 weight 300 (예: <code>markets_hero__sub</code>)
          </li>
        </ul>
      </div>

      <nav className="section-guide__toc" aria-label="섹션 카테고리">
        {sectionGuideCategories.map((category) => (
          <a key={category.id} href={`#sg-cat-${category.id}`}>
            {category.label}
            <span className="section-guide__toc-count">{category.entries.length}</span>
          </a>
        ))}
      </nav>

      {sectionGuideCategories.map((category) => {
        const Preview = previewByCategory[category.id as keyof typeof previewByCategory];

        return (
          <div
            key={category.id}
            id={`sg-cat-${category.id}`}
            className="section-guide__category"
          >
            <header className="section-guide__category-head">
              <h2>{category.label}</h2>
              <p>
                CSS:{" "}
                {category.cssFiles.map((file) => (
                  <code key={file}>{file}</code>
                ))}{" "}
                · wrapper: <code>{category.pageClass}</code>
                {category.livePage ? (
                  <>
                    {" "}
                    ·{" "}
                    <Link href={category.livePage}>라이브 페이지</Link>
                  </>
                ) : null}
              </p>
            </header>

            <div className={`section-guide__scope ${category.pageClass}`}>
              {Preview ? (
                <Preview />
              ) : category.livePage ? (
                <p className="section-guide__registry-only">
                  라이브 미리보기:{" "}
                  <Link href={category.livePage}>{category.livePage}</Link>
                </p>
              ) : (
                <p className="section-guide__registry-only">
                  레지스트리만 등록됨 (미리보기 없음)
                </p>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
