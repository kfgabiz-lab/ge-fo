import type { ReactNode } from "react";

type BtnFlatProps = {
  href?: string;
  children: ReactNode;
  type?: "button" | "submit";
  className?: string;
  onClick?: () => void;
};

export default function BtnFlat({
  href,
  children,
  type = "button",
  className = "btn_flat",
  onClick,
}: BtnFlatProps) {
  if (href !== undefined) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
}
