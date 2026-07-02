import { companyMission } from "../data/companyMissionContent";
import CompanyAboutSectionHead from "./CompanyAboutSectionHead";

export default function CompanyMissionSection() {
  return (
    <section className="company-mission">
      <div className="company-mission__bg-wrap" aria-hidden>
        <img
          loading="lazy"
          decoding="async"
          src={companyMission.bgImage}
          alt=""
          className="company-mission__bg company-mission__bg--pc"
        />
        <img
          loading="lazy"
          decoding="async"
          src={companyMission.bgImageMo}
          alt=""
          className="company-mission__bg company-mission__bg--mo"
        />
      </div>
      <div className="inner">
        <CompanyAboutSectionHead
          title={companyMission.title}
          description={companyMission.description}
        />
        <div className="company-mission__body">
          <div className="company-mission__philosophy">
            <p className="company-mission__label">{companyMission.philosophyLabel}</p>
            <div className="company-mission__philosophy-emblem">
              <img
                loading="lazy"
                decoding="async"
                src={companyMission.philosophyEmblem}
                alt="LS partnership — Excellence, Integrity, Respect"
                className="company-mission__philosophy-emblem-img company-mission__philosophy-emblem-img--pc"
              />
              <img
                loading="lazy"
                decoding="async"
                src={companyMission.philosophyEmblemMo}
                alt="LS partnership — Excellence, Integrity, Respect"
                className="company-mission__philosophy-emblem-img company-mission__philosophy-emblem-img--mo"
              />
            </div>
          </div>
          <div className="company-mission__mission">
            <div className="company-mission__mission-head">
              <p className="company-mission__label">Mission</p>
              <div className="company-mission__intro">
                <img
                  loading="lazy"
                  decoding="async"
                  src={companyMission.missionLogo}
                  alt="FUTURING SMART ENERGY"
                  className="company-mission__logo company-mission__logo--mission"
                />
                <p className="company-mission__text">{companyMission.missionText}</p>
              </div>
            </div>
            <div className="company-mission__pillars">
              {companyMission.pillars.map((pillar) => (
                <article key={pillar.id} className="company-mission__pillar">
                  <div className="company-mission__pillar-icon">
                    <img loading="lazy" decoding="async" src={pillar.icon} alt="" />
                  </div>
                  <div className="company-mission__pillar-text">
                    <h3 className="company-mission__pillar-tit">{pillar.title}</h3>
                    <p className="company-mission__pillar-desc">{pillar.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <img
            loading="lazy"
            decoding="async"
            src={companyMission.coreValueArrow}
            alt=""
            className="company-mission__arrow"
            aria-hidden
          />
          <div className="company-mission__core">
            <div className="company-mission__core-head">
              <p className="company-mission__label">Core Value</p>
              <div className="company-mission__intro">
                <img
                  loading="lazy"
                  decoding="async"
                  src={companyMission.coreValueLogo}
                  alt="DRIVE CHANGE FOR 2030"
                  className="company-mission__logo company-mission__logo--core"
                />
                <p className="company-mission__text company-mission__text--core">
                  {companyMission.coreValueDesc}
                </p>
              </div>
            </div>
            <ul className="company-mission__values">
              {companyMission.coreValues.flatMap((value, index) => {
                const item = (
                  <li key={value.id} className="company-mission__value-item">
                    <div className="company-mission__value-circle">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={value.icon}
                        alt=""
                        className="company-mission__value-icon"
                      />
                      <span className="company-mission__value-label">{value.label}</span>
                    </div>
                  </li>
                );

                if (index === 0) {
                  return [item];
                }

                return [
                  <li
                    key={`${value.id}-connector`}
                    className="company-mission__value-connector"
                    aria-hidden
                  >
                    <span className="company-mission__value-line" />
                    <span className="company-mission__value-plus">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={companyMission.coreValuePlusIcon}
                        alt=""
                        width={24}
                        height={24}
                      />
                    </span>
                    <span className="company-mission__value-line" />
                  </li>,
                  item,
                ];
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
