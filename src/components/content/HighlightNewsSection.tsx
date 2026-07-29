import Link from "next/link";
import type { HighlightNewsItem, HighlightNewsVariant } from "@/types/highlightNews";

export type { HighlightNewsItem, HighlightNewsVariant };

export type HighlightNewsSectionProps = {
  variant: HighlightNewsVariant;
  title: string;
  items: HighlightNewsItem[];
  sectionId?: string;
  className?: string;
};

export default function HighlightNewsSection({
  variant,
  title,
  items,
  sectionId,
  className,
}: HighlightNewsSectionProps) {
  if (items.length === 0) {
    return null;
  }

  const sectionClass = [
    "highlight_news",
    `highlight_news--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={sectionClass} id={sectionId}>
      <div className="inner">
        <h2 className="section_tit">{title}</h2>
        <div className="highlight_news__list">
          {items.map((item) => (
            <Link key={item.id} href={item.href} className="item">
              <div className="img_area">
                <img loading="lazy" decoding="async" src={item.image} alt={item.imageAlt ?? item.title} />
              </div>
              <div className="txt_area">
                <span className="tag">{item.tag}</span>
                <h3 className="tit">{item.title}</h3>
                <p className="date">{item.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
