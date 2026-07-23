"use client";

import { useEffect, useRef } from "react";

type CompanyAmericaShapingVideoProps = {
  src: string;
  poster: string;
};

export default function CompanyAmericaShapingVideo({
  src,
  poster,
}: CompanyAmericaShapingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
          return;
        }
        video.pause();
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      controls
      preload="metadata"
      poster={poster}
    >
      <source src={src} type="video/webm" />
    </video>
  );
}
