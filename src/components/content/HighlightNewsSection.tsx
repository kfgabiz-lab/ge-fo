import Link from "next/link";
import type { HighlightNewsItem, HighlightNewsVariant } from "@/types/highlightNews";

export type { HighlightNewsItem, HighlightNewsVariant };

export type HighlightNewsSectionProps = {
  /** 스타일 변형 (main / markets) */
  variant: HighlightNewsVariant;
  /** 섹션 제목 — 페이지·API마다 다르게 전달 */
  title: string;
  /** 카드 목록 — 페이지·API·CMS 등 외부 데이터 주입 */
  items: HighlightNewsItem[];
  /** section 요소 id (앵커·a11y) */
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
