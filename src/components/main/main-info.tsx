"use client";

import { useEffect, useRef, useState } from "react";

const COUNT_DURATION = 1600;

const mainInfoStats = [
  {
    id: "years",
    value: 50,
    suffix: "+",
    label: "Years",
    moreTxt: "of Industry Experience",
  },
  {
    id: "nations",
    value: 107,
    label: "Nations",
    moreTxt: "Worldwide Reach",
  },
  {
    id: "states",
    value: 50,
    label: "States",
    moreTxt: "Comprehensive Warranty Coverage",
  },
];

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

type StatItemProps = {
  value: number;
  suffix?: string;
  label: string;
  moreTxt: string;
  isActive: boolean;
  delay: number;
};

function StatItem({ value, suffix, label, moreTxt, isActive, delay }: StatItemProps) {
  const count = useCountUp(value, isActive, delay);

  return (
    <div className="item">
      <h3 className="tit">
        <strong className="info_box__count">
          <span className="info_box__count-ghost" aria-hidden="true">
            {value}
            {suffix ? <b className="upper">{suffix}</b> : null}
          </span>
          <span className="info_box__count-live">
            {count}
            {suffix ? <b className="upper">{suffix}</b> : null}
          </span>
        </strong>
        <span className="txt">{label}</span>
      </h3>
      <p className="more_txt">{moreTxt}</p>
    </div>
  );
}

export default function MainInfo() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsInView(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="main_info">
      <div className="main_info__inner">
        <h2 className="tit_area">
          Rooted in 50 years of expertise, <br />
          driven by a vision to serve every corner of the world.
        </h2>
        <div className="info_box">
          <div className="info_box__inner">
            {mainInfoStats.map((stat, index) => (
              <StatItem
                key={stat.id}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                moreTxt={stat.moreTxt}
                isActive={isInView}
                delay={index * 120}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
