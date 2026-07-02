type CompanyPressTitleProps = {
  heading?: string;
  description?: string;
};

export default function CompanyPressTitle({
  heading = "Press",
  description = "Provides a variety of information from LS ELECTRIC.",
}: CompanyPressTitleProps) {
  return (
    <section className="company-press-title">
      <div className="inner">
        <h1 className="company-press-title__heading">{heading}</h1>
        <p className="company-press-title__desc">{description}</p>
      </div>
    </section>
  );
}
