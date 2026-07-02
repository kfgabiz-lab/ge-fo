import CommonBanner04 from "@/components/banners/CommonBanner04";
import CompanyAboutIntroSection from "./CompanyAboutIntroSection";
import CompanyAboutSectionHead from "./CompanyAboutSectionHead";
import CompanyAboutTitleSection from "./CompanyAboutTitleSection";
import CompanyAmericaIntroStats from "./CompanyAmericaIntroStats";
import CompanyFollowSection from "./CompanyFollowSection";
import CompanyMissionSection from "./CompanyMissionSection";
import {
  americaBusiness,
  americaCareersBanner,
  americaIntro,
  americaLeaders,
  americaOperate,
  americaPageTitle,
  americaShaping,
  type AmericaBusinessItem,
  type AmericaLocationItem,
  type AmericaLocationContact,
  type AmericaShapingBlock,
} from "../data/americaContent";
import "@/assets/css/company.css";

export type AmericaPreviewSection =
  | "title"
  | "intro"
  | "shaping"
  | "business"
  | "careers-banner"
  | "operate"
  | "leaders"
  | "mission"
  | "follow";

type CompanyAmericaPageProps = {
  previewSection?: AmericaPreviewSection;
};

function ShapingBlock({ block }: { block: AmericaShapingBlock }) {
  return (
    <article className="company-america-shaping__block">
      <div className="company-america-shaping__img">
        <img loading="lazy" decoding="async" src={block.image} alt="" />
        <span className="company-america-shaping__img-overlay" aria-hidden />
      </div>
      <div className="company-america-shaping__panel">
        <div className="company-america-shaping__panel-inner inner">
          <div className="company-america-shaping__title-wrap">
            <h3 className="company-america-shaping__tit">
              {block.titleLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h3>
            <p className="company-america-shaping__location">
              <img
                loading="lazy"
                decoding="async"
                src={americaShaping.locationIcon}
                alt=""
                width={16}
                height={16}
                className="company-america-shaping__location-icon"
                aria-hidden
              />
              {block.location}
            </p>
          </div>
          <div className="company-america-shaping__highlights">
            <div className="company-america-shaping__highlight-row">
              {block.highlights.slice(0, 2).map((item) => (
                <div key={item.title} className="company-america-shaping__highlight">
                  <p className="company-america-shaping__highlight-tit">{item.title}</p>
                  <p className="company-america-shaping__highlight-desc">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="company-america-shaping__highlight-row">
              {block.highlights.slice(2, 4).map((item) => (
                <div key={item.title} className="company-america-shaping__highlight">
                  <p className="company-america-shaping__highlight-tit">{item.title}</p>
                  <p className="company-america-shaping__highlight-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function BusinessRow({ item }: { item: AmericaBusinessItem }) {
  const image = (
    <div className="company-america-business__img">
      <img loading="lazy" decoding="async" src={item.image} alt="" />
    </div>
  );
  const text = (
    <div className="company-america-business__text">
      <h3 className="company-america-business__tit">{item.title}</h3>
      <p className="company-america-business__desc">{item.description}</p>
    </div>
  );

  return (
    <article
      className={[
        "company-america-business__row",
        item.imagePosition === "right" && "company-america-business__row--reverse",
      ]
        .filter(Boolean)
        .join(" ")}
    >
          {image}
          {text}
    </article>
  );
}

function formatPhoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `tel:+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `tel:+${digits}`;
  }

  return `tel:+${digits}`;
}

function getContactIcon(type: AmericaLocationContact["type"]) {
  if (type === "address") return americaOperate.contactIcons.map;
  if (type === "phone") return americaOperate.contactIcons.phone;
  return americaOperate.contactIcons.website;
}

function LocationCard({ item }: { item: AmericaLocationItem }) {
  return (
    <article className="company-america-operate__card">
      <div className="company-america-operate__card-head">
        <p className="company-america-operate__badge">{item.badge}</p>
        <h3 className="company-america-operate__name">{item.name}</h3>
      </div>
      <div className="company-america-operate__card-body">
        <p className="company-america-operate__role">{item.role}</p>
        <ul className="company-america-operate__contacts">
          {item.contacts.map((contact) => (
            <li key={`${contact.type}-${contact.text}`}>
              <span className="company-america-operate__contact-icon" aria-hidden>
                <img
                  loading="lazy"
                  decoding="async"
                  src={getContactIcon(contact.type)}
                  alt=""
                  width={16}
                  height={16}
                />
              </span>
              {contact.type === "phone" ? (
                <a
                  href={formatPhoneHref(contact.text)}
                  className="company-america-operate__contact-link"
                >
                  {contact.text}
                </a>
              ) : contact.type === "website" ? (
                <a
                  href={contact.href ?? contact.text}
                  className="company-america-operate__contact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contact.text}
                </a>
              ) : (
                <span>{contact.text}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function AmericaTitleSection() {
  return (
    <CompanyAboutTitleSection
      title={americaPageTitle.title}
      description={americaPageTitle.description}
    />
  );
}

function AmericaIntroSection() {
  return (
    <CompanyAboutIntroSection
      heroImage={americaIntro.heroImage}
      headlineLines={americaIntro.headlineLines}
      paragraphs={americaIntro.paragraphs}
      headlineSize="wide"
      withStats
    >
      <CompanyAmericaIntroStats stats={americaIntro.stats} />
    </CompanyAboutIntroSection>
  );
}

function AmericaShapingSection() {
  return (
    <section className="company-america-shaping">
      <div className="company-america-shaping__bg" aria-hidden />
      <div className="inner">
        <h2 className="section_tit company-america-shaping__section-tit">
          {americaShaping.title}
        </h2>
      </div>
      <div className="company-america-shaping__blocks">
        {americaShaping.blocks.map((block) => (
          <ShapingBlock key={block.id} block={block} />
        ))}
      </div>
    </section>
  );
}

function AmericaBusinessSection() {
  return (
    <section className="company-america-business">
      <div className="inner">
        <CompanyAboutSectionHead
          title={americaBusiness.title}
          description={americaBusiness.description}
        />
        <div className="company-america-business__list">
          {americaBusiness.items.map((item) => (
            <BusinessRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AmericaCareersBannerSection() {
  return (
    <CommonBanner04
      title={americaCareersBanner.title}
      description={americaCareersBanner.description}
      linkHref={americaCareersBanner.ctaHref}
      linkLabel={americaCareersBanner.ctaLabel}
      backgroundSrc={americaCareersBanner.bgImage}
      backgroundSrcMo={americaCareersBanner.bgImageMo}
    />
  );
}

function AmericaOperateSection() {
  return (
    <section className="company-america-operate">
      <div className="inner">
        <CompanyAboutSectionHead
          title={americaOperate.title}
          description={americaOperate.description}
        />
        <div className="company-america-operate__map">
          <img
            loading="lazy"
            decoding="async"
            src={americaOperate.mapImage}
            alt="LS ELECTRIC America locations map"
          />
        </div>
        <div className="company-america-operate__cards">
          {americaOperate.locationGroups.map((group) => (
            <div key={group.id} className="company-america-operate__group">
              <h3 className="company-america-operate__group-tit">{group.title}</h3>
              <div className="company-america-operate__group-cards">
                {group.rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="company-america-operate__row">
                    {row.map((item) => (
                      <LocationCard key={item.id} item={item} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AmericaLeadersSection() {
  return (
    <section className="company-america-leaders">
      <div className="inner">
        <CompanyAboutSectionHead
          title={americaLeaders.title}
          description={americaLeaders.description}
        />
        <div className="company-america-leaders__letter">
          <h3 className="company-america-leaders__letter-tit">
            {americaLeaders.letterTitle}
          </h3>
          {americaLeaders.letterBody.map((line) => (
            <p key={line.slice(0, 48)}>{line}</p>
          ))}
        </div>
        <div className="company-america-leaders__grid">
          {americaLeaders.items.map((leader) => (
            <article
              key={leader.id}
              className={[
                "company-america-leaders__card",
                leader.gradientStop === "65.122" &&
                  "company-america-leaders__card--gradient-65",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="company-america-leaders__img">
                <img loading="lazy" decoding="async" src={leader.image} alt="" />
                <span className="company-america-leaders__overlay" aria-hidden />
              </div>
              <div className="company-america-leaders__meta">
                <p className="company-america-leaders__role">{leader.role}</p>
                <p className="company-america-leaders__name">{leader.name}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const americaPreviewSections: Record<
  AmericaPreviewSection,
  () => React.ReactNode
> = {
  title: AmericaTitleSection,
  intro: AmericaIntroSection,
  shaping: AmericaShapingSection,
  business: AmericaBusinessSection,
  "careers-banner": AmericaCareersBannerSection,
  operate: AmericaOperateSection,
  leaders: AmericaLeadersSection,
  mission: CompanyMissionSection,
  follow: CompanyFollowSection,
};

export default function CompanyAmericaPage({ previewSection }: CompanyAmericaPageProps = {}) {
  if (previewSection) {
    const PreviewSection = americaPreviewSections[previewSection];
    return <PreviewSection />;
  }

  return (
    <main className="company-page company-page--america" id="Page_company_america">
      <AmericaTitleSection />
      <AmericaIntroSection />
      <AmericaShapingSection />
      <AmericaBusinessSection />
      <AmericaCareersBannerSection />
      <AmericaOperateSection />
      <AmericaLeadersSection />
      <CompanyMissionSection />
      <CompanyFollowSection />
    </main>
  );
}

