import Link from "next/link";

type CompanyPressFeaturedProps = {
  title: string;
  description: string;
  date: string;
  image: string;
  href: string;
};

export default function CompanyPressFeatured({
  title,
  description,
  date,
  image,
  href,
}: CompanyPressFeaturedProps) {
  return (
    <section className="company-press-featured">
      <div className="inner">
        <Link href={href} className="company-press-featured__card">
          <div className="company-press-featured__image">
            <img src={image} alt={title} />
          </div>
          <div className="company-press-featured__content">
            <div className="company-press-featured__text">
              <h2 className="company-press-featured__title">{title}</h2>
              <p className="company-press-featured__desc">{description}</p>
              <p className="company-press-featured__date">{date}</p>
            </div>
            <span className="btn-text-30 company-press-featured__link">
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
