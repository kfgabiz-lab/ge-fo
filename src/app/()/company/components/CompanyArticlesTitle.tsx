type CompanyArticlesTitleProps = {
  heading?: string;
  description?: string;
};

export default function CompanyArticlesTitle({
  heading = "Articles",
  description = "Our Latest Articles",
}: CompanyArticlesTitleProps) {
  return (
    <section className="company-articles-title">
      <div className="inner">
        <h1 className="company-articles-title__heading">{heading}</h1>
        <p className="company-articles-title__desc">{description}</p>
      </div>
    </section>
  );
}
