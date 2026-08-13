"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const LOADING_MS = 1000;
const TOAST_MS = 1000;

type CopyPhase = "idle" | "loading" | "copied";

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
  const [phase, setPhase] = useState<CopyPhase>("idle");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const handleCopy = async () => {
    if (phase === "loading") return;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setPhase("loading");

    try {
      await navigator.clipboard.writeText(value);
    } catch {
    }

    const showToast = setTimeout(() => {
      setPhase("copied");
      const hideToast = setTimeout(() => setPhase("idle"), TOAST_MS);
      timersRef.current.push(hideToast);
    }, LOADING_MS);
    timersRef.current.push(showToast);
  };

  const baseClass =
    variant === "on-dark"
      ? "btn-base btn-line-30 btn-line-30--on-dark"
      : "btn-base btn-line-30";
  const btnClass = [
    className ? `${baseClass} ${className}` : baseClass,
    "common_banner_02__copy",
    phase === "loading" ? "is-loading" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={btnClass}
      onClick={handleCopy}
      aria-busy={phase === "loading"}
      aria-live="polite"
    >
      {phase === "copied" ? (
        <span className="common_banner_02__copy-toast" role="status">
          Link copied!
        </span>
      ) : null}
      <span className="common_banner_02__copy-label">{label}</span>
      <span
        className="btn-line-30__icon btn-line-30__icon--copy"
        aria-hidden="true"
      />
      <span className="common_banner_02__copy-spinner" aria-hidden="true" />
    </button>
  );
}
