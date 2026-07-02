export default function CompanyAboutTitleSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="company-about-title">
      <div className="inner">
        <h1 className="company-about-title__heading">{title}</h1>
        <p className="company-about-title__desc">{description}</p>
      </div>
    </section>
  );
}
