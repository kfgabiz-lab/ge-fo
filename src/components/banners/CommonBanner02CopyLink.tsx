"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const TOAST_MS = 1000;

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
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setCopied(true);
    timerRef.current = setTimeout(() => setCopied(false), TOAST_MS);

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(value).catch(() => {});
    }
  };

  const baseClass =
    variant === "on-dark"
      ? "btn-base btn-line-30 btn-line-30--on-dark"
      : "btn-base btn-line-30";
  const btnClass = className
    ? `${baseClass} ${className} common_banner_02__copy`
    : `${baseClass} common_banner_02__copy`;

  return (
    <button
      type="button"
      className={btnClass}
      onClick={handleCopy}
      aria-live="polite"
    >
      {copied ? (
        <span className="common_banner_02__copy-toast" role="status">
          Email copied!
        </span>
      ) : null}
      <span className="common_banner_02__copy-label">{label}</span>
      <span
        className="btn-line-30__icon btn-line-30__icon--copy"
        aria-hidden="true"
      />
    </button>
  );
}
