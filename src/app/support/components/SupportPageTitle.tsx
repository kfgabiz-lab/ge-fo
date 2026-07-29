import type { ReactNode } from "react";

export type SupportPageTitleSpacing = "default" | "with-bottom";

export type SupportPageTitleProps = {
  id: string;
  rootClass: string;
  title: string | readonly string[];
  description: string;
  spacing?: SupportPageTitleSpacing;
  mobileInset?: boolean;
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
          {typeof title === "string"
            ? title
            : title.map((line) => (
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
