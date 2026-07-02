import type { ReactNode } from "react";
import {
  careersJobs,
  careersJobsSection,
  careersLinkedInBanner,
  careersLinkedInCta,
  careersPageTitle,
  type CareersJob,
} from "../data/careersContent";

export type CareersPreviewSection = "title" | "jobs" | "linkedin";

type CompanyCareersPageProps = {
  previewSection?: CareersPreviewSection;
};

function CareersTitleSection() {
  return (
    <section className="company-careers-title">
      <div className="inner">
        <h1 className="company-careers-title__heading">{careersPageTitle.title}</h1>
        <p className="company-careers-title__desc">{careersPageTitle.description}</p>
        <a
          href={careersLinkedInCta.href}
          className="btn-base btn-lv01 btn-lv01--solid company-careers-title__cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{careersLinkedInCta.label}</span>
          <img
            src="/ico/ico_link.svg"
            alt=""
            width={18}
            height={18}
            className="company-careers-title__cta-icon"
            aria-hidden
          />
        </a>
      </div>
    </section>
  );
}

function CareersJobCard({ job }: { job: CareersJob }) {
  return (
    <li className="company-careers-jobs__card">
      <h3 className="company-careers-jobs__card-title">{job.title}</h3>
      <ul className="company-careers-jobs__card-list">
        {job.duties.map((duty) => (
          <li key={duty} className="company-careers-jobs__card-item">
            {duty}
          </li>
        ))}
      </ul>
    </li>
  );
}

function CareersJobsSection() {
  return (
    <section className="company-careers-jobs">
      <div className="inner company-careers-jobs__inner">
        <h2 className="company-careers-jobs__title">{careersJobsSection.title}</h2>
        <ul className="company-careers-jobs__grid">
          {careersJobs.map((job) => (
            <CareersJobCard key={job.id} job={job} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function CareersLinkedInSection() {
  const { backgroundImage, title, description, cta } = careersLinkedInBanner;

  return (
    <section className="company-careers-linkedin">
      <div className="inner">
        <a
          href={cta.href}
          className="company-careers-linkedin__panel"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={backgroundImage}
            alt=""
            className="company-careers-linkedin__bg"
            loading="lazy"
            decoding="async"
            aria-hidden
          />
          <div className="company-careers-linkedin__dim" aria-hidden />
          <div className="company-careers-linkedin__content">
            <h2 className="company-careers-linkedin__title">{title}</h2>
            <div className="company-careers-linkedin__desc">
              {description.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          <span className="btn-text-30 company-careers-linkedin__cta">
            {cta.label}
            <span className="btn-text-30__icon">
              <span className="icon_link-14" aria-hidden />
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}

const careersPreviewSections: Record<CareersPreviewSection, () => ReactNode> = {
  title: CareersTitleSection,
  jobs: CareersJobsSection,
  linkedin: CareersLinkedInSection,
};

export default function CompanyCareersPage({
  previewSection,
}: CompanyCareersPageProps = {}) {
  if (previewSection) {
    const PreviewSection = careersPreviewSections[previewSection];
    return <PreviewSection />;
  }

  return (
    <main className="company-page company-page--careers" id="P-FO-COMP-090000P">
      <CareersTitleSection />
      <CareersJobsSection />
      <CareersLinkedInSection />
    </main>
  );
}
