import type { ReactNode } from "react";
import type { SectionGuideEntry } from "@/data/sectionGuide";

type SectionGuideBlockProps = {
  entry: SectionGuideEntry;
  children?: ReactNode;
};

export default function SectionGuideBlock({
  entry,
  children,
}: SectionGuideBlockProps) {
  const tag = entry.element ?? "section";

  return (
    <article className="section-guide__block" id={`sg-${entry.id}`}>
      <header className="section-guide__block-head">
        <div className="section-guide__block-title">
          <h3>{entry.label}</h3>
          <code className="section-guide__class">{entry.rootClass}</code>
        </div>
        <dl className="section-guide__meta">
          <div>
            <dt>컴포넌트</dt>
            <dd>
              <code>{entry.component}</code>
            </dd>
          </div>
          <div>
            <dt>CSS</dt>
            <dd>
              <code>{entry.cssFile}</code>
            </dd>
          </div>
          <div>
            <dt>요소</dt>
            <dd>
              <code>&lt;{tag}&gt;</code>
            </dd>
          </div>
          {entry.modifiers?.length ? (
            <div>
              <dt>modifier</dt>
              <dd>
                {entry.modifiers.map((modifier) => (
                  <code key={modifier}>{`${entry.rootClass}${modifier}`}</code>
                ))}
              </dd>
            </div>
          ) : null}
          {entry.anchorId ? (
            <div>
              <dt>id</dt>
              <dd>
                <code>{entry.anchorId}</code>
              </dd>
            </div>
          ) : null}
        </dl>
        {entry.note ? <p className="section-guide__note">{entry.note}</p> : null}
      </header>
      {children ? (
        <div className="section-guide__preview">{children}</div>
      ) : null}
    </article>
  );
}
