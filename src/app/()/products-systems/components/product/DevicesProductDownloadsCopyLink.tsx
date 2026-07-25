"use client";

import { useEffect, useRef, useState } from "react";

const LOADING_MS = 1000;
const TOAST_MS = 1000;

type CopyPhase = "idle" | "loading" | "copied";

type DevicesProductDownloadsCopyLinkProps = {
  /** 클립보드 텍스트(정적). 미지정 시 현재 페이지 URL 사용. resolveUrl 지정 시 무시. */
  url?: string;
  /**
   * 지정 시 클릭할 때마다 이 함수로 fresh URL 을 받아 복사한다(정적 url 대신 사용).
   * CTP 처럼 단기 만료 URL 을 그때그때 발급받는 경우용. 실패 시 "" 반환하면 복사를 건너뛴다.
   */
  resolveUrl?: () => Promise<string>;
  className?: string;
  /** true면 다음 클릭 전까지 "Link copied!" 토스트 유지 */
  persistToast?: boolean;
};

export default function DevicesProductDownloadsCopyLink({
  url,
  resolveUrl,
  className = "",
  persistToast = false,
}: DevicesProductDownloadsCopyLinkProps) {
  const [phase, setPhase] = useState<CopyPhase>("idle");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const handleCopy = async () => {
    if (phase === "loading") return;

    clearTimers();
    setPhase("loading");

    // resolveUrl 이 있으면 그때그때 fresh URL 발급(실패 시 "" → 복사 건너뜀), 없으면 정적 url/현재 URL 사용.
    let text = url ?? (typeof window !== "undefined" ? window.location.href : "");
    if (resolveUrl) {
      try {
        text = await resolveUrl();
      } catch {
        text = "";
      }
    }
    try {
      if (text) await navigator.clipboard.writeText(text);
    } catch {
      /* 클립보드 사용 불가 */
    }

    const showToast = setTimeout(() => {
      setPhase("copied");
      if (!persistToast) {
        const hideToast = setTimeout(() => {
          setPhase("idle");
        }, TOAST_MS);
        timersRef.current.push(hideToast);
      }
    }, LOADING_MS);
    timersRef.current.push(showToast);
  };

  const btnClass = [
    "devices_product_downloads__file-btn",
    "devices_product_downloads__file-btn--copy",
    className,
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
        <span className="devices_product_downloads__copy-toast" role="status">
          Link copied!
        </span>
      ) : null}
      <span className="devices_product_downloads__file-btn-label">Copy Link</span>
      <span
        className="devices_product_downloads__file-btn-icon"
        aria-hidden="true"
      />
      <span
        className="devices_product_downloads__file-btn-spinner"
        aria-hidden="true"
      />
    </button>
  );
}
