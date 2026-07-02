type ConnectPortalDetailProps = {
  title?: string;
  titleLines?: readonly string[];
  description: string;
  bullets: readonly string[];
  image: string;
  imageAlt: string;
  reverse?: boolean;
};

export default function ConnectPortalDetail({
  title,
  titleLines,
  description,
  bullets,
  image,
  imageAlt,
  reverse = false,
}: ConnectPortalDetailProps) {
  const sectionClass = [
    "support_connect_detail",
    reverse ? "support_connect_detail--reverse" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={sectionClass}>
      <div className="inner support_connect_detail__inner">
        <div className="support_connect_detail__content">
          <h2 className="support_connect_detail__tit">
            {title ? (
              title
            ) : (
              titleLines?.map((line) => (
                <span key={line} className="support_connect_detail__tit-line">
                  {line}
                </span>
              ))
            )}
          </h2>
          <p className="support_connect_detail__desc">{description}</p>
          <ul className="support_connect_detail__list">
            {bullets.map((item) => (
              <li key={item} className="support_connect_detail__item">
                <span className="support_connect_detail__check" aria-hidden />
                <span className="support_connect_detail__item-txt">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="support_connect_detail__media">
          <img src={image} alt={imageAlt} className="support_connect_detail__img" />
        </div>
      </div>
    </section>
  );
}
