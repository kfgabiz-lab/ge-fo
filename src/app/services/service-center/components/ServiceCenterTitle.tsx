import { serviceCenterPage } from "@/data/services/serviceCenterContent";

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
