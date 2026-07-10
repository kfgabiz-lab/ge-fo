"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";

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
  const { ref: sectionRef, isInView } = useInView<HTMLElement>();

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
