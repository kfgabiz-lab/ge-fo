export default function CompanyAboutSectionHead({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="company-about__head">
      <h2 className="section_tit">{title}</h2>
      {description ? <p className="section_desc">{description}</p> : null}
    </div>
  );
}
