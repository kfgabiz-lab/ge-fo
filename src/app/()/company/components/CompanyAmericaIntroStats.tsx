"use client";

import { useEffect, useRef, useState } from "react";
import type { AmericaStatItem } from "../data/americaContent";

const COUNT_TARGET = 1000;
const COUNT_DURATION = 1600;
const COUNT_UP_VALUE = "1,000+";

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

function useCountUp(target: number, isActive: boolean, delay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setValue(0);
      return;
    }

    let frameId = 0;
    let startTime: number | null = null;

    const delayTimeout = window.setTimeout(() => {
      const animate = (timestamp: number) => {
        if (startTime === null) {
          startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / COUNT_DURATION, 1);
        setValue(Math.round(easeOutCubic(progress) * target));

        if (progress < 1) {
          frameId = requestAnimationFrame(animate);
        }
      };

      frameId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      window.clearTimeout(delayTimeout);
      cancelAnimationFrame(frameId);
    };
  }, [delay, isActive, target]);

  return value;
}

function ProjectsStatValue({ isActive, delay }: { isActive: boolean; delay: number }) {
  const count = useCountUp(COUNT_TARGET, isActive, delay);

  return (
    <>
      {count.toLocaleString("en-US")}+
    </>
  );
}

type CompanyAmericaIntroStatsProps = {
  stats: AmericaStatItem[];
};

export default function CompanyAmericaIntroStats({
  stats,
}: CompanyAmericaIntroStatsProps) {
  const statsRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const statsEl = statsRef.current;
    if (!statsEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsInView(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(statsEl);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={statsRef} className="company-about-intro__stats">
      {stats.map((stat, index) => (
        <div key={stat.value} className="company-about-intro__stat">
          <p className="company-about-intro__stat-value">
            {stat.value === COUNT_UP_VALUE ? (
              <ProjectsStatValue isActive={isInView} delay={index * 120} />
            ) : (
              stat.value
            )}
          </p>
          <p className="company-about-intro__stat-label">{stat.label}</p>
          <p className="company-about-intro__stat-desc">{stat.desc}</p>
          {index < stats.length - 1 ? (
            <span className="company-about-intro__stat-divider" aria-hidden />
          ) : null}
        </div>
      ))}
    </div>
  );
}
