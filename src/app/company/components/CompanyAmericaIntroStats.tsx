"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import type { AmericaStatItem } from "../data/americaContent";

const COUNT_TARGET = 1000;
const COUNT_UP_VALUE = "1,000+";

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
  const { ref: statsRef, isInView } = useInView<HTMLDivElement>();

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
