import Link from "next/link";
import { articleDetailClass } from "@/app/()/company/articleDetailClass";
import CompanyArticleDetail from "@/app/()/company/components/CompanyArticleDetail";
import {
  blogDetailBullets,
  blogDetailHero,
  blogDetailPager,
  blogDetailParagraphs,
  blogDetailTags,
  blogDetailTailParagraphs,
} from "@/app/()/company/data/blogDetailContent";
import {
  eventsDetailBullets,
  eventsDetailHero,
  eventsDetailMeta,
  eventsDetailPager,
} from "@/app/()/company/data/eventsDetailContent";
import {
  pressDetailBullets,
  pressDetailHero,
  pressDetailPager,
  pressDetailParagraphs,
  pressDetailYoutube,
} from "@/app/()/company/data/pressDetailContent";
import {
  mediaArticleDetailContentImage,
  mediaArticleDetailPager,
  mediaArticleDetailPullquote,
  mediaArticleDetailSections,
  mediaArticleDetailTailSections,
  mediaArticleDetailYoutube,
} from "@/app/()/company/data/mediaArticleDetailContent";
import DevicesProductVideoPlayer from "@/components/video/DevicesProductVideoPlayer";
import { pressFeatured } from "@/app/()/company/data/pressListContent";
import CompanyPressEmpty from "@/app/()/company/components/CompanyPressEmpty";
import CompanyBlogEmpty from "@/app/()/company/components/CompanyBlogEmpty";
import CompanyPressFeatured from "@/app/()/company/components/CompanyPressFeatured";
import CompanyEventsCalendar from "@/app/()/company/components/CompanyEventsCalendar";
import CompanyEventsFeatured from "@/app/()/company/components/CompanyEventsFeatured";
import CompanyEventsPastSection from "@/app/()/company/components/CompanyEventsPastSection";
import {
  eventsCalendarMonths,
  eventsFeaturedItems,
  eventsPastItems,
} from "@/app/()/company/data/eventsListContent";
import CompanyAmericaPage, {
  type AmericaPreviewSection,
} from "@/app/()/company/components/CompanyAmericaPage";
import CompanyLsElectricPage, {
  type LsElectricPreviewSection,
} from "@/app/()/company/components/CompanyLsElectricPage";
import CompanyAffiliateAmericaPage, {
  type AffiliateAmericaPreviewSection,
} from "@/app/()/company/components/CompanyAffiliateAmericaPage";
import CompanyCareersPage, {
  type CareersPreviewSection,
} from "@/app/()/company/components/CompanyCareersPage";
import CompanyEsgPage, {
  type EsgPreviewSection,
} from "@/app/()/company/components/CompanyEsgPage";
import { americaCareersBanner } from "@/app/()/company/data/americaContent";
import CompanyPressListSection from "@/app/()/company/components/CompanyPressListSection";
import CompanyPressTitle from "@/app/()/company/components/CompanyPressTitle";
import CommonBanner01 from "@/components/banners/CommonBanner01";
import CommonBanner02 from "@/components/banners/CommonBanner02";
import CommonBanner03Link from "@/components/banners/CommonBanner03Link";
import CommonBanner04 from "@/components/banners/CommonBanner04";
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import CommonFaq from "@/components/faq/CommonFaq";
import SectionGuideBlock from "@/components/guide/SectionGuideBlock";
import { mainHighlightNewsItems } from "@/data/highlightNews";
import IconCards from "@/app/main/components/IconCards";
import MainCards from "@/app/main/components/MainCards";
import MainInfo from "@/app/main/components/MainInfo";
import MainProducts from "@/app/main/components/MainProducts";
import MainVisual from "@/app/main/components/MainVisual";
import WhatWeDoSwiper from "@/app/main/components/WhatWeDoSwiper";
import DevicesCategoryList from "@/app/()/products-systems/components/DevicesCategoryList";
import DevicesHelp from "@/app/()/products-systems/components/DevicesHelp";
import DevicesHero from "@/app/()/products-systems/components/DevicesHero";
import DevicesMarkets from "@/app/()/products-systems/components/DevicesMarkets";
import DevicesHvdcHero from "@/app/()/products-systems/components/product/DevicesHvdcHero";
import DevicesHvdcOverview from "@/app/()/products-systems/components/product/DevicesHvdcOverview";
import DevicesMicroGridHighlights from "@/app/()/products-systems/components/product/DevicesMicroGridHighlights";
import DevicesProductApplications from "@/app/()/products-systems/components/product/DevicesProductApplications";
import DevicesProductDownloads from "@/app/()/products-systems/components/product/DevicesProductDownloads";
import DevicesProductHero from "@/app/()/products-systems/components/product/DevicesProductHero";
import DevicesProductLineup from "@/app/()/products-systems/components/product/DevicesProductLineup";
import DevicesProductOtherProducts from "@/app/()/products-systems/components/product/DevicesProductOtherProducts";
import DevicesProductVideo from "@/app/()/products-systems/components/product/DevicesProductVideo";
import DevicesProductWhy from "@/app/()/products-systems/components/product/DevicesProductWhy";
import DevicesSoftwareHighlights from "@/app/()/products-systems/components/product/DevicesSoftwareHighlights";
import DevicesXemsEnergySolutions from "@/app/()/products-systems/components/product/DevicesXemsEnergySolutions";
import DevicesXemsHero from "@/app/()/products-systems/components/product/DevicesXemsHero";
import DevicesXemsOverview from "@/app/()/products-systems/components/product/DevicesXemsOverview";
import DevicesProductFeaturesSection from "@/components/content/DevicesProductFeaturesSection";
import {
  hvdcApplicationsSection,
  hvdcBenefitsSection,
  hvdcOtherProducts,
  hvdcOtherProductsTitle,
  hvdcWhySection,
} from "@/app/()/products-systems/data/hvdcContent";
import { smartFactoryWhySection } from "@/app/()/products-systems/data/smartFactoryContent";
import {
  lvAutomationIntro,
  lvAutomationProducts,
} from "@/app/()/products-systems/data/lvAutomationContent";
import {
  h100PlusDetail,
  metasolMsDetail,
  susolUlSmartMccbDetail,
} from "@/app/()/products-systems/data/productDetailContent";
import MarketsBenefits from "@/app/()/markets/components/MarketsBenefits";
import MarketsExplore from "@/app/()/markets/components/MarketsExplore";
import MarketsFaq from "@/app/()/markets/components/MarketsFaq";
import MarketsHero from "@/app/()/markets/components/MarketsHero";
import MarketsSolutionsPanel from "@/app/()/markets/components/MarketsSolutionsPanel";
import { commercialSolutionsPanel } from "@/app/()/markets/data/marketsCommercialSolutionsPanel";
import { oilGasMiningSolutionsPanel } from "@/app/()/markets/data/marketsOilGasMiningSolutionsPanel";
import { publicInfrastructureSolutionsPanel } from "@/app/()/markets/data/marketsPublicInfrastructureSolutionsPanel";
import MarketsIntro from "@/app/()/markets/components/MarketsIntro";
import MarketsProducts from "@/app/()/markets/components/MarketsProducts";
import MarketsReferences from "@/app/()/markets/components/MarketsReferences";
import MarketsReferencesModalPreview from "@/app/()/markets/components/MarketsReferencesModalPreview";
import MarketsSmartGrid from "@/app/()/markets/components/MarketsSmartGrid";
import MarketsSolutions from "@/app/()/markets/components/MarketsSolutions";
import MarketsStats from "@/app/()/markets/components/MarketsStats";
import MarketsSustainability from "@/app/()/markets/components/MarketsSustainability";
import MarketsWhy from "@/app/()/markets/components/MarketsWhy";
import {
  dataCenterBenefits,
  dataCenterFaqItems,
  dataCenterHero,
  dataCenterIntro,
  dataCenterProducts,
  dataCenterStats,
  dataCenterWhyDescription,
  dataCenterWhyItems,
} from "@/app/()/markets/data/marketsDataCenterContent";
import { marketsHighlightNewsItems } from "@/app/()/markets/data/marketsHighlights";
import { faqItems } from "@/app/()/markets/data/marketsContent";
import {
  powerGridIndustryTabs,
  powerGridSmartGridOperation,
  powerGridSmartGridUseCases,
  powerGridSustainabilityCards,
} from "@/app/()/markets/data/marketsPowerGridContent";
import ConnectPortalDetail from "@/app/()/support/connect-portal/components/ConnectPortalDetail";
import ConnectPortalFeatures from "@/app/()/support/connect-portal/components/ConnectPortalFeatures";
import ConnectPortalTitle from "@/app/()/support/connect-portal/components/ConnectPortalTitle";
import ConnectPortalVideo from "@/app/()/support/connect-portal/components/ConnectPortalVideo";
import DownloadCenterSearch from "@/app/()/support/download-center/components/DownloadCenterSearch";
import EngineeringTrainingCurriculum from "@/app/()/services/engineering-training/components/EngineeringTrainingCurriculum";
import ServiceCenterBanner from "@/app/()/services/service-center/components/ServiceCenterBanner";
import ServiceCenterCards from "@/app/()/services/service-center/components/ServiceCenterCards";
import ServiceCenterFlow from "@/app/()/services/service-center/components/ServiceCenterFlow";
import ServiceCenterGics from "@/app/()/services/service-center/components/ServiceCenterGics";
import ServiceCenterOffering from "@/app/()/services/service-center/components/ServiceCenterOffering";
import ServiceCenterTitle from "@/app/()/services/service-center/components/ServiceCenterTitle";
import WarrantyPolicyApply from "@/app/()/services/warranty-policy/components/WarrantyPolicyApply";
import WarrantyPolicyBanner from "@/app/()/services/warranty-policy/components/WarrantyPolicyBanner";
import WarrantyPolicyCoverage from "@/app/()/services/warranty-policy/components/WarrantyPolicyCoverage";
import WarrantyPolicyExtension from "@/app/()/services/warranty-policy/components/WarrantyPolicyExtension";
import WarrantyPolicyTitle from "@/app/()/services/warranty-policy/components/WarrantyPolicyTitle";
import {
  serviceCenterFaqDescriptionLines,
  serviceCenterFaqItems,
} from "@/data/services/serviceCenterContent";
import EngineeringTrainingDetailHero from "@/app/()/services/engineering-training/components/EngineeringTrainingDetailHero";
import EngineeringTrainingDetailSchedule from "@/app/()/services/engineering-training/components/EngineeringTrainingDetailSchedule";
import EngineeringTrainingSessionDetail from "@/app/()/services/engineering-training/components/EngineeringTrainingSessionDetail";
import EngineeringTrainingIntro from "@/app/()/services/engineering-training/components/EngineeringTrainingIntro";
import EngineeringTrainingTitle from "@/app/()/services/engineering-training/components/EngineeringTrainingTitle";
import RequestForTraining from "@/app/()/services/request-for-training/components/RequestForTraining";
import RequestForTrainingStep1Form from "@/app/()/services/request-for-training/components/RequestForTrainingStep1Form";
import RequestForTrainingStep2Form from "@/app/()/services/request-for-training/components/RequestForTrainingStep2Form";
import RequestForTrainingStep3Form from "@/app/()/services/request-for-training/components/RequestForTrainingStep3Form";
import RequestForTrainingStep4Form from "@/app/()/services/request-for-training/components/RequestForTrainingStep4Form";
import RequestForTrainingTitle from "@/app/()/services/request-for-training/components/RequestForTrainingTitle";
import { requestForTrainingNavCopy, requestForTrainingRoutes } from "@/data/services/requestForTrainingContent";
import { getEngineeringTrainingDetail } from "@/data/services/engineeringTrainingDetailContent";
import { getEngineeringTrainingSessionDetail } from "@/data/services/engineeringTrainingSessionDetailContent";
import SearchAllHero from "@/app/()/search/components/SearchAllHero";
import SearchAllTabContent from "@/app/()/search/components/SearchAllTabContent";
import SearchDocumentsPanel from "@/app/()/search/components/SearchDocumentsPanel";
import SearchMediaPanel from "@/app/()/search/components/SearchMediaPanel";
import SearchPagesPanel from "@/app/()/search/components/SearchPagesPanel";
import SearchProductsPanel from "@/app/()/search/components/SearchProductsPanel";
import { Suspense } from "react";
import TechHubSearch from "@/app/()/support/tech-hub/components/TechHubSearch";
import TechHubTitle from "@/app/()/support/tech-hub/components/TechHubTitle";
import ContactUsForm from "@/app/()/support/contact-us/components/ContactUsForm";
import ContactUsModalsHubPage from "@/app/()/support/contact-us/components/ContactUsModalsHubPage";
import ContactUsTermsModalPreview from "@/app/()/support/contact-us/components/ContactUsTermsModalPreview";
import ContactUsTitle from "@/app/()/support/contact-us/components/ContactUsTitle";
import ContactUsViewResponseDetailAnsweredPreview from "@/app/()/support/contact-us/components/ContactUsViewResponseDetailAnsweredPreview";
import ContactUsViewResponseDetailPendingPreview from "@/app/()/support/contact-us/components/ContactUsViewResponseDetailPendingPreview";
import ContactUsViewResponseModalErrorPreview from "@/app/()/support/contact-us/components/ContactUsViewResponseModalErrorPreview";
import ContactUsViewResponseModalPreview from "@/app/()/support/contact-us/components/ContactUsViewResponseModalPreview";
import TechHubContents from "@/app/()/support/tech-hub/components/TechHubContents";
import TechHubView from "@/app/()/support/tech-hub/components/TechHubView";
import WhereToBuyBanner from "@/app/()/support/where-to-buy/components/WhereToBuyBanner";
import WhereToBuyContents from "@/app/()/support/where-to-buy/components/WhereToBuyContents";
import WhereToBuySearch from "@/app/()/support/where-to-buy/components/WhereToBuySearch";
import WhereToBuyTitle from "@/app/()/support/where-to-buy/components/WhereToBuyTitle";
import { connectPortalPage } from "@/data/support/connectPortalContent";
import { getSectionGuideEntry } from "@/data/sectionGuide";

function block(id: string) {
  const entry = getSectionGuideEntry(id);
  if (!entry) {
    throw new Error(`Unknown section guide entry: ${id}`);
  }
  return entry;
}

export function MainSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("main_visual")}>
        <MainVisual />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("main_info")}>
        <MainInfo />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("what_we_do__inner")}>
        <WhatWeDoSwiper />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("main_cards")}>
        <MainCards />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("main_products")}>
        <MainProducts />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("icon_cards")}>
        <IconCards />
      </SectionGuideBlock>
    </>
  );
}

export function MarketsSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("markets_hero")}>
        <MarketsHero
          variant="key-visual"
          subtitle={dataCenterHero.subtitle}
          title={dataCenterHero.title}
          heroImage={dataCenterHero.heroImage}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_intro")}>
        <MarketsIntro
          titleLines={dataCenterIntro.titleLines}
          text={dataCenterIntro.text}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_stats")}>
        <MarketsStats items={dataCenterStats} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_explore")}>
        <MarketsExplore />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_references")}>
        <MarketsReferences />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_references_modal")}>
        <MarketsReferencesModalPreview />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_benefits")}>
        <MarketsBenefits items={dataCenterBenefits} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_solutions_panel")}>
        <MarketsSolutionsPanel {...commercialSolutionsPanel} />
      </SectionGuideBlock>
      <SectionGuideBlock
        entry={{
          ...block("markets_solutions_panel"),
          label: "Solutions Panel (grouped · public-infrastructure)",
        }}
      >
        <MarketsSolutionsPanel {...publicInfrastructureSolutionsPanel} />
      </SectionGuideBlock>
      <SectionGuideBlock
        entry={{
          ...block("markets_solutions_panel"),
          label: "Solutions Panel (stacked · oil-gas-mining)",
        }}
      >
        <MarketsSolutionsPanel {...oilGasMiningSolutionsPanel} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_sustainability")}>
        <MarketsSustainability cards={powerGridSustainabilityCards} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_smart_grid")}>
        <MarketsSmartGrid
          useCases={powerGridSmartGridUseCases}
          operationItems={powerGridSmartGridOperation}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_solutions")}>
        <MarketsSolutions />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_why")}>
        <MarketsWhy
          items={dataCenterWhyItems}
          description={dataCenterWhyDescription}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_products")}>
        <MarketsProducts items={dataCenterProducts} badgesType2Only />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_banner_01")}>
        <CommonBanner01 />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_highlight_news")}>
        <HighlightNewsSection
          variant="markets"
          title="Highlights"
          items={marketsHighlightNewsItems}
          sectionId="guide-markets-highlights"
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_faq")}>
        <MarketsFaq items={dataCenterFaqItems} />
      </SectionGuideBlock>
    </>
  );
}

export function DevicesSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("devices_hero")}>
        <DevicesHero withProducts />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_category")}>
        <DevicesCategoryList
          layout="stacked"
          intro={lvAutomationIntro}
          products={lvAutomationProducts}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_markets")}>
        <DevicesMarkets />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_help")}>
        <DevicesHelp variant="overlay" sectionId="guide-devices-help" />
      </SectionGuideBlock>
    </>
  );
}

export function ProductSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("devices_product_hero")}>
        <DevicesProductHero product={metasolMsDetail} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_features")}>
        <DevicesProductFeaturesSection
          title="Key Features"
          items={metasolMsDetail.keyFeatures}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("common_banner_02_expert")}>
        <CommonBanner02
          variant="expert"
          linkHref={metasolMsDetail.expertBannerHref}
          linkExternal={metasolMsDetail.expertBannerExternal}
          contactEmail={metasolMsDetail.expertContactEmail}
          backgroundSrc={metasolMsDetail.configuratorBannerBg}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_lineup_type1")}>
        <DevicesProductLineup
          variant="type1"
          items={susolUlSmartMccbDetail.lineup}
          configuratorHref={susolUlSmartMccbDetail.configuratorHref}
          configuratorExternal={susolUlSmartMccbDetail.configuratorExternal}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_lineup_type2")}>
        <DevicesProductLineup
          variant="type2"
          frameLineup={h100PlusDetail.frameLineup}
          configuratorHref={h100PlusDetail.configuratorHref}
          configuratorExternal={h100PlusDetail.configuratorExternal}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_downloads")}>
        <DevicesProductDownloads items={metasolMsDetail.downloads} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_video")}>
        <DevicesProductVideo youtubeVideoId={metasolMsDetail.youtubeVideoId} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_other")}>
        <DevicesProductOtherProducts
          title={hvdcOtherProductsTitle}
          items={hvdcOtherProducts}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_hvdc_hero")}>
        <DevicesHvdcHero />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_hvdc_overview")}>
        <DevicesHvdcOverview />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_benefits")}>
        <DevicesProductFeaturesSection
          variant="list"
          sectionId="product-benefits"
          title={hvdcBenefitsSection.title}
          items={hvdcBenefitsSection.items}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_applications")}>
        <DevicesProductApplications
          title={hvdcApplicationsSection.title}
          description={hvdcApplicationsSection.description}
          items={hvdcApplicationsSection.items}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_why")}>
        <DevicesProductWhy
          title={hvdcWhySection.title}
          blocks={hvdcWhySection.blocks}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_why_image_only")}>
        <DevicesSoftwareHighlights
          title={smartFactoryWhySection.title}
          blocks={smartFactoryWhySection.blocks}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_software_hero")}>
        <DevicesXemsHero />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_software_overview")}>
        <DevicesXemsOverview />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_xems_energy_solutions")}>
        <DevicesXemsEnergySolutions />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_micro_grid_why")}>
        <DevicesMicroGridHighlights />
      </SectionGuideBlock>
    </>
  );
}

export function CommonSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("common_banner_01")}>
        <CommonBanner01 />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("common_banner_02")}>
        <CommonBanner02 linkHref="#configurator" />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("common_banner_03")}>
        <CommonBanner03Link
          items={[
            {
              title: "Contact Us",
              description:
                "Connect with our experts to find the right solution for your business.",
              href: "/support/contact-us",
            },
            {
              title: "Where to buy",
              description:
                "Find authorized retailers and partners to purchase our products.",
              href: "/support/where-to-buy",
            },
          ]}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("common_banner_04")}>
        <CommonBanner04 />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("common_faq")}>
        <CommonFaq items={faqItems.slice(0, 3)} defaultOpenIndex={0} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("highlight_news")}>
        <HighlightNewsSection
          variant="main"
          title="Catch up on the latest news"
          items={mainHighlightNewsItems}
          sectionId="guide-highlight-main"
        />
      </SectionGuideBlock>
    </>
  );
}

const guideBlogFeatured = {
  category: "Power Distribution & Infrastructure",
  title: "Control Panel Troubleshooting Tips Every Industrial Team Should Know",
  description:
    "Power interruptions drain an estimated $150 billion annually from the U.S. economy, and many of these costly losses start with a fault that lasts less than a second.",
  date: "Jan 23, 2026",
  image: "/img/company/blog/hero_01.png",
  tags: ["#MCCB", "#Switches", "#Panel Control"],
};

const guidePressFeatured = {
  title: "LS ELECTRIC to shake up the industry in the era of a Supercycle",
  description:
    "Stated at the annual general meeting of shareholders held on the 26th at LS Tower in Anyang.",
  date: "Apr 20, 2026",
  image: "/img/company/press/hero.png",
};

const companyAmericaPreviewBlocks: Array<{
  entryId: string;
  section: AmericaPreviewSection;
}> = [
  { entryId: "company_america_title", section: "title" },
  { entryId: "company_america_intro", section: "intro" },
  { entryId: "company_america_shaping", section: "shaping" },
  { entryId: "company_america_business", section: "business" },
  { entryId: "company_america_careers_banner", section: "careers-banner" },
  { entryId: "company_america_operate", section: "operate" },
  { entryId: "company_america_leaders", section: "leaders" },
  { entryId: "company_america_mission", section: "mission" },
  { entryId: "company_america_follow", section: "follow" },
];

export function CompanyAmericaSectionPreviews() {
  return (
    <>
      {companyAmericaPreviewBlocks.map(({ entryId, section }) => (
        <SectionGuideBlock key={entryId} entry={block(entryId)}>
          {section === "careers-banner" ? (
            <CommonBanner04
              title={americaCareersBanner.title}
              description={americaCareersBanner.description}
              linkHref={americaCareersBanner.ctaHref}
              linkLabel={americaCareersBanner.ctaLabel}
              backgroundSrc={americaCareersBanner.bgImage}
              backgroundSrcMo={americaCareersBanner.bgImageMo}
            />
          ) : (
            <CompanyAmericaPage previewSection={section} />
          )}
        </SectionGuideBlock>
      ))}
    </>
  );
}

const companyLsElectricPreviewBlocks: Array<{
  entryId: string;
  section: LsElectricPreviewSection;
}> = [
  { entryId: "company_ls_electric_title", section: "title" },
  { entryId: "company_ls_electric_intro", section: "intro" },
  { entryId: "company_ls_electric_highlights", section: "highlights" },
  { entryId: "company_ls_electric_business", section: "business" },
  { entryId: "company_ls_electric_global", section: "global" },
  { entryId: "company_ls_electric_ptt", section: "ptt" },
  { entryId: "company_ls_electric_rnd", section: "rnd" },
  { entryId: "company_ls_electric_history", section: "history" },
  { entryId: "company_ls_electric_mission", section: "mission" },
];

export function CompanyLsElectricSectionPreviews() {
  return (
    <>
      {companyLsElectricPreviewBlocks.map(({ entryId, section }) => (
        <SectionGuideBlock key={entryId} entry={block(entryId)}>
          <CompanyLsElectricPage previewSection={section} />
        </SectionGuideBlock>
      ))}
    </>
  );
}

const companyAffiliatePreviewBlocks: {
  entryId: string;
  section: AffiliateAmericaPreviewSection;
}[] = [
  { entryId: "company_affiliate_title", section: "title" },
  { entryId: "company_affiliate_intro", section: "intro" },
  { entryId: "company_affiliate_list", section: "list" },
];

export function CompanyAffiliateAmericaSectionPreviews() {
  return (
    <>
      {companyAffiliatePreviewBlocks.map(({ entryId, section }) => (
        <SectionGuideBlock key={entryId} entry={block(entryId)}>
          <CompanyAffiliateAmericaPage previewSection={section} />
        </SectionGuideBlock>
      ))}
    </>
  );
}

const companyEsgPreviewBlocks: {
  entryId: string;
  section: EsgPreviewSection;
}[] = [
  { entryId: "company_esg_title", section: "title" },
  { entryId: "company_esg_intro", section: "intro" },
  { entryId: "company_esg_vision", section: "vision" },
  { entryId: "company_esg_climate", section: "climate" },
  { entryId: "company_esg_policies", section: "policies" },
];

export function CompanyEsgSectionPreviews() {
  return (
    <>
      {companyEsgPreviewBlocks.map(({ entryId, section }) => (
        <SectionGuideBlock key={entryId} entry={block(entryId)}>
          <CompanyEsgPage previewSection={section} />
        </SectionGuideBlock>
      ))}
    </>
  );
}

const companyCareersPreviewBlocks: {
  entryId: string;
  section: CareersPreviewSection;
}[] = [
  { entryId: "company_careers_title", section: "title" },
  { entryId: "company_careers_jobs", section: "jobs" },
  { entryId: "company_careers_linkedin", section: "linkedin" },
];

export function CompanyCareersSectionPreviews() {
  return (
    <>
      {companyCareersPreviewBlocks.map(({ entryId, section }) => (
        <SectionGuideBlock key={entryId} entry={block(entryId)}>
          <CompanyCareersPage previewSection={section} />
        </SectionGuideBlock>
      ))}
    </>
  );
}

export function CompanyBlogSectionPreviews() {

  return (
    <>
      <SectionGuideBlock entry={block("company_blog_title")}>
        <section className="company-blog-title">
          <div className="inner">
            <h1 className="company-blog-title__heading">Blog</h1>
            <p className="company-blog-title__desc">
              Your Knowledge Hub for Electrical Innovation
            </p>
          </div>
        </section>
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_blog_top")}>
        <section className="company-blog-top">
          <img
            src="/img/company/blog/hero_bg_blog.png"
            alt=""
            className="company-blog-top__bg"
          />
          <div className="inner">
            <div className="company-blog-featured__card">
              <div className="company-blog-featured__image">
                <img src={guideBlogFeatured.image} alt={guideBlogFeatured.title} />
              </div>
              <Link href="/company/blog/detail" className="company-blog-featured__content">
                <p className="company-blog-featured__category">{guideBlogFeatured.category}</p>
                <h2 className="company-blog-featured__title">{guideBlogFeatured.title}</h2>
                <p className="company-blog-featured__desc">{guideBlogFeatured.description}</p>
                <p className="company-blog-featured__date">{guideBlogFeatured.date}</p>
                <div className="company-blog-featured__tags">
                  {guideBlogFeatured.tags.map((tag) => (
                    <div key={tag} className="company-blog-featured__tag">
                      {tag}
                    </div>
                  ))}
                </div>
              </Link>
            </div>
          </div>
        </section>
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_blog_list")}>
        <section className="company-blog-list">
          <div className="inner">
            <ul className="company-blog-list__items">
              <li className="company-blog-list__item">
                <div className="company-blog-list__content-wrap">
                  <div className="company-blog-list__link">
                    <div className="company-blog-list__image">
                      <img src="/img/company/blog/list_01.jpg" alt="" />
                    </div>
                    <Link href="/company/blog/detail" className="company-blog-list__content">
                      <p className="company-blog__category">{guideBlogFeatured.category}</p>
                      <h3 className="company-blog-list__title">{guideBlogFeatured.title}</h3>
                      <p className="company-blog-list__desc">{guideBlogFeatured.description}</p>
                      <p className="company-blog__date">{guideBlogFeatured.date}</p>
                      <div className="company-blog-list__tags-row">
                        <div className="company-blog__tags">
                          {guideBlogFeatured.tags.map((tag) => (
                            <div key={tag} className="company-blog__tag">
                              {tag}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_blog_empty")}>
        <section className="company-blog-list company-blog-list--no-data">
          <div className="inner">
            <div className="company-blog-list__body">
              <CompanyBlogEmpty />
            </div>
            <div className="company-blog-list__divider" aria-hidden="true" />
          </div>
        </section>
      </SectionGuideBlock>
    </>
  );
}

export function CompanyArticleDetailSectionPreviews() {
  return (
    <SectionGuideBlock entry={block("company_article_detail")}>
      <div className="section-guide__article-detail-stack">
        <CompanyArticleDetail
          embedded
          variant="blog"
          pageId="guide_company_blog_detail"
          category="Power Distribution & Infrastructure"
          title="Control Panel Troubleshooting Tips Every Industrial Team Should Know"
          date="Dec 9, 2025"
          heroImage={blogDetailHero}
          pagerAriaLabel="Blog post navigation"
          prev={blogDetailPager.prev}
          next={blogDetailPager.next}
          listHref="/company/blog"
        >
          <div className={articleDetailClass("body")}>
            <p>{blogDetailParagraphs[0]}</p>
            <ul className={articleDetailClass("list")}>
              {blogDetailBullets.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={articleDetailClass("tags")}>
            <div className="company-blog__tags">
              {blogDetailTags.map((tag) => (
                <div key={tag} className="company-blog__tag">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </CompanyArticleDetail>
        <CompanyArticleDetail
          embedded
          variant="press"
          pageId="guide_company_press_detail"
          title="LS ELECTRIC Showcases Capabilities in Energy Highway Business"
          date="Dec 9, 2025"
          heroImage={pressDetailHero}
          afterHero={
            <DevicesProductVideoPlayer
              youtubeVideoId={pressDetailYoutube.videoId}
              title={pressDetailYoutube.title}
            />
          }
          pagerAriaLabel="Press post navigation"
          prev={pressDetailPager.prev}
          next={pressDetailPager.next}
          listHref="/company/press"
        >
          <div className={articleDetailClass("body")}>
            <ul className={articleDetailClass("list")}>
              {pressDetailBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{pressDetailParagraphs[0]}</p>
          </div>
        </CompanyArticleDetail>
        <CompanyArticleDetail
          embedded
          variant="events"
          pageId="guide_company_events_detail"
          title="ELECS KOREA 2026"
          eventsMeta={eventsDetailMeta}
          heroImage={eventsDetailHero}
          pagerAriaLabel="Events post navigation"
          prev={eventsDetailPager.prev}
          next={eventsDetailPager.next}
          listHref="/company/events"
        >
          <div className={articleDetailClass("body")}>
            <ul className={articleDetailClass("list")}>
              {eventsDetailBullets.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </CompanyArticleDetail>
        <CompanyArticleDetail
          embedded
          variant="media"
          pageId="guide_company_articles_detail"
          title="LS ELECTRIC to shake up the industry in the era of a Supercycle"
          date="Dec 9, 2025"
          heroVideo={{
            youtubeVideoId: mediaArticleDetailYoutube.videoId,
            title: mediaArticleDetailYoutube.title,
          }}
          pagerAriaLabel="Media article navigation"
          prev={mediaArticleDetailPager.prev}
          next={mediaArticleDetailPager.next}
          listHref="/company/articles"
        >
          <div className={articleDetailClass("body")}>
            <h2 className={articleDetailClass("section-title")}>
              {mediaArticleDetailSections[0].title}
            </h2>
            <p>{mediaArticleDetailSections[0].paragraphs[0]}</p>
            <h3 className={articleDetailClass("subsection-title")}>
              {mediaArticleDetailSections[1].title}
            </h3>
            <p>{mediaArticleDetailSections[1].paragraphs[0]}</p>
            <p className={articleDetailClass("pullquote")}>{mediaArticleDetailPullquote}</p>
          </div>
          <img
            src={mediaArticleDetailContentImage.src}
            alt={mediaArticleDetailContentImage.alt}
            className={articleDetailClass("content-img")}
          />
          <div className={articleDetailClass("body")}>
            {mediaArticleDetailTailSections.slice(0, 1).map((section) => (
              <div key={section.id} className={articleDetailClass("body-block")}>
                <h3 className={articleDetailClass("subsection-title")}>{section.title}</h3>
                <p>{section.paragraphs[0]}</p>
              </div>
            ))}
          </div>
        </CompanyArticleDetail>
      </div>
    </SectionGuideBlock>
  );
}

export function CompanyEventsSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("company_events_title")}>
        <CompanyPressTitle
          heading="Events"
          description="All Planned Exhibitions and Webinars"
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_events_featured")}>
        <CompanyEventsFeatured items={eventsFeaturedItems} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_events_calendar")}>
        <CompanyEventsCalendar months={eventsCalendarMonths} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_events_past")}>
        <CompanyEventsPastSection items={eventsPastItems.slice(0, 3)} totalPages={1} />
      </SectionGuideBlock>
    </>
  );
}

export function CompanyPressSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("company_press_title")}>
        <CompanyPressTitle />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_press_featured")}>
        <CompanyPressFeatured
          title={pressFeatured.title}
          description={pressFeatured.description}
          date={pressFeatured.date}
          image={pressFeatured.image}
          href={pressFeatured.href}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_press_list")}>
        <CompanyPressListSection
          items={[
            {
              id: "guide-press-01",
              title: pressFeatured.title,
              date: pressFeatured.date,
              image: "/img/company/press/list_01.png",
            },
          ]}
          totalPages={1}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_press_empty")}>
        <section className="company-press-list company-press-list--no-data">
          <div className="inner">
            <CompanyPressEmpty />
            <div className="company-press-list__divider" aria-hidden="true" />
          </div>
        </section>
      </SectionGuideBlock>
    </>
  );
}

export function SupportConnectSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("support_connect_title")}>
        <ConnectPortalTitle />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_connect_video")}>
        <ConnectPortalVideo />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_connect_features")}>
        <ConnectPortalFeatures />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_connect_detail")}>
        {connectPortalPage.detailSections.map((section) => (
          <ConnectPortalDetail
            key={section.id}
            title={"title" in section ? section.title : undefined}
            titleLines={"titleLines" in section ? section.titleLines : undefined}
            description={section.description}
            bullets={section.bullets}
            image={section.image}
            imageAlt={section.imageAlt}
            reverse={section.reverse}
          />
        ))}
      </SectionGuideBlock>
    </>
  );
}

export function ServicesServiceCenterSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("support_service_center_title")}>
        <ServiceCenterTitle />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_cards")}>
        <ServiceCenterCards />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_banner")}>
        <ServiceCenterBanner />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_offering")}>
        <ServiceCenterOffering />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_flow")}>
        <ServiceCenterFlow />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_gics")}>
        <ServiceCenterGics />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_center_faq")}>
        <CommonFaq
          sectionId="service-center-faq"
          description={
            <>
              {serviceCenterFaqDescriptionLines[0]}
              <br />
              {serviceCenterFaqDescriptionLines[1]}
            </>
          }
          items={serviceCenterFaqItems}
          defaultOpenIndex={-1}
        />
      </SectionGuideBlock>
    </>
  );
}

export function ServicesWarrantyPolicySectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("support_service_warranty_title")}>
        <WarrantyPolicyTitle />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_warranty_coverage")}>
        <WarrantyPolicyCoverage />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_warranty_banner")}>
        <WarrantyPolicyBanner />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_warranty_extension")}>
        <WarrantyPolicyExtension />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_warranty_apply")}>
        <WarrantyPolicyApply />
      </SectionGuideBlock>
    </>
  );
}

export function ServicesEngineeringTrainingSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("support_service_training_title")}>
        <EngineeringTrainingTitle />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_training_intro")}>
        <EngineeringTrainingIntro />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_training_curriculum")}>
        <EngineeringTrainingCurriculum />
      </SectionGuideBlock>
    </>
  );
}

const engineeringTrainingDetailPreview = getEngineeringTrainingDetail("breaker-training");
const engineeringTrainingSessionPreview = getEngineeringTrainingSessionDetail(
  "breaker-training",
  "jul-14-2026",
);

export function ServicesEngineeringTrainingDetailSectionPreviews() {
  if (!engineeringTrainingDetailPreview) {
    return null;
  }

  return (
    <>
      <SectionGuideBlock entry={block("support_service_training_detail_hero")}>
        <EngineeringTrainingDetailHero detail={engineeringTrainingDetailPreview} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_training_detail_schedule")}>
        <EngineeringTrainingDetailSchedule detail={engineeringTrainingDetailPreview} />
      </SectionGuideBlock>
    </>
  );
}

export function ServicesEngineeringTrainingSessionSectionPreviews() {
  if (!engineeringTrainingSessionPreview) {
    return null;
  }

  return (
    <SectionGuideBlock entry={block("support_service_training_session_detail")}>
      <EngineeringTrainingSessionDetail session={engineeringTrainingSessionPreview} />
    </SectionGuideBlock>
  );
}

export function ServicesRequestForTrainingSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("support_service_training_request_title")}>
        <RequestForTrainingTitle />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_training_request")}>
        <RequestForTraining currentStep={1} nextHref={requestForTrainingRoutes.step2}>
          <RequestForTrainingStep1Form />
        </RequestForTraining>
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_training_request_step_02")}>
        <RequestForTraining currentStep={2} previousHref={requestForTrainingRoutes.step1} nextHref={requestForTrainingRoutes.step3}>
          <RequestForTrainingStep2Form />
        </RequestForTraining>
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_training_request_step_03")}>
        <RequestForTraining currentStep={3} previousHref={requestForTrainingRoutes.step2} nextHref={requestForTrainingRoutes.step4}>
          <RequestForTrainingStep3Form />
        </RequestForTraining>
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_training_request_step_04")}>
        <RequestForTraining
          currentStep={4}
          previousHref={requestForTrainingRoutes.step3}
          submitLabel={requestForTrainingNavCopy.submitLabel}
        >
          <RequestForTrainingStep4Form variant="power" />
        </RequestForTraining>
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_service_training_request_step_04_type_01")}>
        <RequestForTraining
          currentStep={4}
          previousHref={requestForTrainingRoutes.step3}
          submitLabel={requestForTrainingNavCopy.submitLabel}
        >
          <RequestForTrainingStep4Form variant="automation" />
        </RequestForTraining>
      </SectionGuideBlock>
    </>
  );
}

export function SupportDownloadSectionPreviews() {
  return (
    <SectionGuideBlock entry={block("support_download_search")}>
      <DownloadCenterSearch />
    </SectionGuideBlock>
  );
}

export function SupportTechHubSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("support_tech_hub_title")}>
        <TechHubTitle />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_tech_hub_search")}>
        <TechHubSearch />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_tech_hub_contents")}>
        <TechHubContents />
      </SectionGuideBlock>
    </>
  );
}

export function SupportContactUsSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("support_contact_title")}>
        <ContactUsTitle />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_contact_view_response_modal")}>
        <ContactUsViewResponseModalPreview />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_contact_view_response_modal_error")}>
        <ContactUsViewResponseModalErrorPreview />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_contact_view_response_detail_modal")}>
        <ContactUsViewResponseDetailAnsweredPreview />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_contact_view_response_detail_modal_pending")}>
        <ContactUsViewResponseDetailPendingPreview />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_contact_form")}>
        <ContactUsForm />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_contact_terms_modal")}>
        <ContactUsTermsModalPreview />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_contact_modals_hub")}>
        <ContactUsModalsHubPage />
      </SectionGuideBlock>
    </>
  );
}

export function SupportWhereToBuySectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("support_where_to_buy_title")}>
        <WhereToBuyTitle />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_where_to_buy_search")}>
        <WhereToBuySearch embedded />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_where_to_buy_contents")}>
        <WhereToBuyContents />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_where_to_buy_banner")}>
        <WhereToBuyBanner />
      </SectionGuideBlock>
    </>
  );
}

export function SupportTechHubViewSectionPreviews() {
  return (
    <SectionGuideBlock entry={block("support_tech_hub_view")}>
      <TechHubView />
    </SectionGuideBlock>
  );
}

export function SearchSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("search_all_hero")}>
        <Suspense fallback={null}>
          <SearchAllHero />
        </Suspense>
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("search_all")}>
        <SearchAllTabContent />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("search_products")}>
        <SearchProductsPanel />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("search_documents")}>
        <SearchDocumentsPanel />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("search_media")}>
        <SearchMediaPanel />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("search_pages")}>
        <SearchPagesPanel />
      </SectionGuideBlock>
    </>
  );
}

