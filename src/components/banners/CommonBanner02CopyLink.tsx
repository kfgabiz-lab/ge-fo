"use client";

import type { ReactNode } from "react";

type CommonBanner02CopyLinkProps = {
  value: string;
  label?: ReactNode;
  /** default: light surface · on-dark: banner on dark */
  variant?: "default" | "on-dark";
  className?: string;
};

export default function CommonBanner02CopyLink({
  value,
  label = "Copy Email",
  variant = "on-dark",
  className,
}: CommonBanner02CopyLinkProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
    }
  };

  const baseClass =
    variant === "on-dark"
      ? "btn-base btn-line-30 btn-line-30--on-dark"
      : "btn-base btn-line-30";

  return (
    <button
      type="button"
      className={className ? `${baseClass} ${className}` : baseClass}
      onClick={handleCopy}
    >
      {label}
      <span
        className="btn-line-30__icon btn-line-30__icon--copy"
        aria-hidden="true"
      />
    </button>
  );
}
