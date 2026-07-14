import type { ReactNode } from "react";

export type SupportPageTitleSpacing = "default" | "with-bottom";

export type SupportPageTitleProps = {
  id: string;
  /** Section guide registry alias (e.g. support_tech_hub_title) */
  rootClass: string;
  title: string | readonly string[];
  description: string;
  spacing?: SupportPageTitleSpacing;
  /** Mobile section horizontal inset (Connect Portal, Where to Buy) */
  mobileInset?: boolean;
  /** Where to Buy mobile bottom spacing */
  variant?: "where-to-buy";
  children?: ReactNode;
};

export default function SupportPageTitle({
  id,
  rootClass,
  title,
  description,
  spacing = "default",
  mobileInset = false,
  variant,
  children,
}: SupportPageTitleProps) {
  const titleLines = typeof title === "string" ? [title] : title;
  const classNames = [
    "support_page_title",
    rootClass,
    spacing === "with-bottom" ? "support_page_title--with-bottom" : "",
    mobileInset ? "support_page_title--mo-inset" : "",
    variant === "where-to-buy" ? "support_page_title--where-to-buy" : "",
    children ? "support_page_title--with-actions" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classNames} id={id}>
      <div className="inner">
        <h1 className="support_page_title__heading">
          {titleLines.map((line) => (
            <span key={line} className="support_page_title__heading-line">
              {line}
            </span>
          ))}
        </h1>
        <p className="support_page_title__desc">{description}</p>
        {children}
      </div>
    </section>
  );
}
