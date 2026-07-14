import { americaFollow } from "../data/americaContent";

export default function CompanyFollowSection() {
  return (
    <section className="company-follow">
      <div className="inner">
        <p className="company-follow__tit">{americaFollow.title}</p>
        <ul className="company-follow__list">
          {americaFollow.links.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                className="company-follow__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="company-follow__icon">
                  <img loading="lazy" decoding="async" src={link.icon} alt="" />
                </span>
                <span>{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
