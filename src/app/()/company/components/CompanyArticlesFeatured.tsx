import Link from "next/link";

type CompanyArticlesFeaturedProps = {
  title: string;
  description: string;
  date: string;
  image: string;
  href: string;
};

export default function CompanyArticlesFeatured({
  title,
  description,
  date,
  image,
  href,
}: CompanyArticlesFeaturedProps) {
  return (
    <section className="company-articles-featured">
      <div className="inner">
        <Link href={href} className="company-articles-featured__card">
          <div className="company-articles-featured__image">
            <img src={image} alt={title} />
          </div>
          <div className="company-articles-featured__content">
            <div className="company-articles-featured__text">
              <h2 className="company-articles-featured__title">{title}</h2>
              <p className="company-articles-featured__desc">{description}</p>
              <p className="company-articles-featured__date">{date}</p>
            </div>
            <span className="btn-text-30 company-articles-featured__link">
              Explore
              <span className="btn-text-30__icon" aria-hidden="true">
                <span className="icon_arrow-14" />
              </span>
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
