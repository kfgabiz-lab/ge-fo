import type { ReactNode } from "react";

type GuidePageHeaderProps = {
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
};

export default function GuidePageHeader({
  title,
  description,
  meta,
}: GuidePageHeaderProps) {
  return (
    <header className="guide-doc__header">
      <h1>{title}</h1>
      {description ? <p className="guide-doc__lead">{description}</p> : null}
      {meta ? <div className="guide-doc__meta">{meta}</div> : null}
    </header>
  );
}
