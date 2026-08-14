"use client";

import { useEffect, useRef, useState } from "react";

const LOADING_MS = 1000;
const TOAST_MS = 1000;

type DownloadPhase = "idle" | "loading" | "done";

type DevicesProductDownloadsDownloadBtnProps = {
  url?: string;
  resolveUrl?: () => Promise<string>;
  className?: string;
  onDownloaded?: (url: string) => void;
};

export default function DevicesProductDownloadsDownloadBtn({
  url,
  resolveUrl,
  className = "",
  onDownloaded,
}: DevicesProductDownloadsDownloadBtnProps) {
  const [phase, setPhase] = useState<DownloadPhase>("idle");
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

  const handleDownload = async () => {
    if (phase === "loading") return;

    clearTimers();
    setPhase("loading");

    let fileUrl = url ?? "";
    if (resolveUrl) {
      try {
        fileUrl = await resolveUrl();
      } catch {
        fileUrl = "";
      }
    }

    if (fileUrl && typeof window !== "undefined") {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
      onDownloaded?.(fileUrl);
    }

    const showToast = setTimeout(() => {
      setPhase("done");
      const hideToast = setTimeout(() => {
        setPhase("idle");
      }, TOAST_MS);
      timersRef.current.push(hideToast);
    }, LOADING_MS);
    timersRef.current.push(showToast);
  };

  const btnClass = [
    "devices_product_downloads__file-btn",
    "devices_product_downloads__file-btn--download",
    className,
    phase === "loading" ? "is-loading" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={btnClass}
      onClick={() => {
        void handleDownload();
      }}
      aria-busy={phase === "loading"}
      aria-live="polite"
    >
      {phase === "done" ? (
        <span className="devices_product_downloads__copy-toast" role="status">
          Download complete!
        </span>
      ) : null}
      <span className="devices_product_downloads__file-btn-label">Download</span>
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
