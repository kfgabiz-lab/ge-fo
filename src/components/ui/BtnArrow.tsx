import type { ReactNode } from "react";

type BtnArrowProps = {
  href?: string;
  children: ReactNode;
  className?: string;
};

export default function BtnArrow({
  href = "",
  children,
  className = "btn_arrow",
}: BtnArrowProps) {
  return (
    <a href={href} className={className}>
      {children}
      <span className="icon_arrow" aria-hidden="true" />
    </a>
  );
}
