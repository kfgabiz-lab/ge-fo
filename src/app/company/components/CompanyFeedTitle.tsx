// 공통 피드 타이틀 (Press/Articles). Events는 variant="press"로 재사용하며 heading/description만 override
type CompanyFeedTitleVariant = "press" | "articles";

const titleDefaults: Record<CompanyFeedTitleVariant, { heading: string; description: string }> = {
  press: {
    heading: "Press",
    description: "Provides a variety of information from LS ELECTRIC.",
  },
  articles: {
    heading: "Articles",
    description: "Our Latest Articles",
  },
};

type CompanyFeedTitleProps = {
  variant: CompanyFeedTitleVariant;
  heading?: string;
  description?: string;
};

export default function CompanyFeedTitle({
  variant,
  heading,
  description,
}: CompanyFeedTitleProps) {
  const defaults = titleDefaults[variant];
  const resolvedHeading = heading ?? defaults.heading;
  const resolvedDescription = description ?? defaults.description;
  const prefix = `company-${variant}-title`;

  return (
    <section className={prefix}>
      <div className="inner">
        <h1 className={`${prefix}__heading`}>{resolvedHeading}</h1>
        <p className={`${prefix}__desc`}>{resolvedDescription}</p>
      </div>
    </section>
  );
}
