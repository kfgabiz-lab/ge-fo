"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  careersJobsSection,
  careersLinkedInBanner,
  careersLinkedInCta,
  careersPageTitle,
  fetchCareersJobs,
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
            width={16}
            height={16}
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
    // data-slug-item: 채용공고 1건(반복 단위). 상위 grid의 data-slug="careers-data" 반복 아이템.
    <li className="company-careers-jobs__card" data-slug-item>
      {/* 채용 직무명 → careers.title (단일 섹션이라 flatten 후 root의 title로 접근) */}
      <h3 className="company-careers-jobs__card-title" data-slugkey="title">{job.title}</h3>
      {/* 직무 설명 → careers.description (textarea 원본 단일 문자열).
          사용자 확정 지시대로 불릿 리스트 파싱 없이 줄바꿈만 유지(white-space: pre-line)해 그대로 렌더. */}
      <p className="company-careers-jobs__card-desc" data-slugkey="description">
        {job.description}
      </p>
    </li>
  );
}

function CareersJobsSection() {
  // careers-data slug 공개 채용공고 목록(정렬 포함)을 클라이언트에서 1회 조회
  const [jobs, setJobs] = useState<CareersJob[]>([]);

  useEffect(() => {
    let alive = true;
    fetchCareersJobs()
      .then((rows) => {
        if (alive) setJobs(rows);
      })
      .catch(() => {
        if (alive) setJobs([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="company-careers-jobs">
      <div className="inner company-careers-jobs__inner">
        <h2 className="company-careers-jobs__title">{careersJobsSection.title}</h2>
        {/* data-slug="careers-data"(활성 PAGE_DATA slug) 다건 반복 컨테이너.
            공개(careers.is_visible=001) 항목만, careers.sort 오름차순(동률 시 updatedAt 최신순) 정렬. */}
        <ul
          className="company-careers-jobs__grid"
          data-slug="careers-data"
          data-slug-repeat="true"
        >
          {jobs.map((job) => (
            <CareersJobCard key={job.id} job={job} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function CareersLinkedInSection() {
  const { backgroundImage, backgroundImageMo, title, titleMo, description, descriptionMo, cta } =
    careersLinkedInBanner;

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
            className="company-careers-linkedin__bg company-careers-linkedin__bg--pc"
            loading="lazy"
            decoding="async"
            aria-hidden
          />
          <img
            src={backgroundImageMo}
            alt=""
            className="company-careers-linkedin__bg company-careers-linkedin__bg--mo"
            loading="lazy"
            decoding="async"
            aria-hidden
          />
          <div className="company-careers-linkedin__dim" aria-hidden />
          <div className="company-careers-linkedin__content">
            <h2 className="company-careers-linkedin__title company-careers-linkedin__title--pc">
              {title}
            </h2>
            <h2 className="company-careers-linkedin__title company-careers-linkedin__title--mo">
              <span className="company-careers-linkedin__title-line">{titleMo[0]}</span>
              <span className="company-careers-linkedin__title-line">{titleMo[1]}</span>
            </h2>
            <div className="company-careers-linkedin__desc company-careers-linkedin__desc--pc">
              {description.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p className="company-careers-linkedin__desc company-careers-linkedin__desc--mo">
              {descriptionMo}
            </p>
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
