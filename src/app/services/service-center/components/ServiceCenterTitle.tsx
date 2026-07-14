import { serviceCenterPage } from "@/data/services/serviceCenterContent";

// ls-publish의 CompanyAboutTitleSection(16줄 trivial 컴포넌트)를 인라인 이관 — company 섹션 외부 의존 제거
export default function ServiceCenterTitle() {
  return (
    <section className="company-about-title">
      <div className="inner">
        <h1 className="company-about-title__heading">
          {serviceCenterPage.title}
        </h1>
        <p className="company-about-title__desc">
          {serviceCenterPage.description}
        </p>
      </div>
    </section>
  );
}
