import { warrantyPolicyPage } from "@/data/services/warrantyPolicyContent";

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
