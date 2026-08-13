"use client";

import { useEffect, useRef } from "react";

type CompanyAmericaShapingVideoProps = {
  src: string;
  poster: string;
  /** Accessible name for the decorative ambient video */
  ariaLabel: string;
};

export default function CompanyAmericaShapingVideo({
  src,
  poster,
  ariaLabel,
}: CompanyAmericaShapingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncPlayback = (entry?: IntersectionObserverEntry) => {
      if (media.matches) {
        video.pause();
        return;
      }

      const inView =
        entry?.isIntersecting ??
        (() => {
          const rect = video.getBoundingClientRect();
          return rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
        })();

      if (inView) {
        void video.play().catch(() => {});
        return;
      }
      video.pause();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        syncPlayback(entry);
      },
      { threshold: 0.25 },
    );

    const onMotionChange = () => {
      syncPlayback();
    };

    observer.observe(video);
    media.addEventListener("change", onMotionChange);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={ariaLabel}
    >
      <source src={src} type="video/webm" />
    </video>
  );
}
