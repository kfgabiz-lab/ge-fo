import Link from "next/link";
import { notFoundPage } from "@/data/common/notFoundContent";

export default function NotFoundHelpfulLinks() {
  return (
    <section className="common_404_links" id="common-404-links">
      <div className="inner">
        <h2 className="section_tit common_404_links__tit">
          {notFoundPage.helpfulLinksTitle}
        </h2>
        <ul className="common_404_links__list">
          {notFoundPage.helpfulLinks.map((item) => {
            const content = (
              <>
                <span className="common_404_links__icon" aria-hidden>
                  <img src={item.iconSrc} alt="" width={80} height={80} />
                </span>
                <span className="common_404_links__label">{item.label}</span>
              </>
            );

            return (
              <li key={item.id} className="common_404_links__item">
                {item.external ? (
                  <a
                    href={item.href}
                    className="common_404_links__card"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="common_404_links__card"
                    prefetch={false}
                  >
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
