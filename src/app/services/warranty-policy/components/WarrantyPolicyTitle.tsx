import { warrantyPolicyPage } from "@/data/services/warrantyPolicyContent";

// ls-publish의 CompanyAboutTitleSection을 인라인 이관 — company 섹션 외부 의존 제거
export default function WarrantyPolicyTitle() {
  return (
    <section className="company-about-title">
      <div className="inner">
        <h1 className="company-about-title__heading">
          {warrantyPolicyPage.title}
        </h1>
        <p className="company-about-title__desc">
          {warrantyPolicyPage.description}
        </p>
      </div>
    </section>
  );
}
