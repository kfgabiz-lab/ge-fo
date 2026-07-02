"use client";

import type { LsElectricGlobalStat, LsElectricHighlightStat } from "../data/lsElectricContent";
import {
  formatAnimatedStatNumber,
  parseNumericStatValue,
  useCountUp,
  useInViewOnce,
} from "../hooks/useCountUp";

function HighlightStatValue({
  stat,
  isActive,
  delay,
}: {
  stat: LsElectricHighlightStat;
  isActive: boolean;
  delay: number;
}) {
  const parsed = parseNumericStatValue(stat.value);
  const count = useCountUp(
    parsed?.target ?? 0,
    isActive && parsed !== null,
    delay,
    parsed?.decimalPlaces ?? 0,
  );
  const displayValue = parsed
    ? formatAnimatedStatNumber(count, parsed.useComma, parsed.decimalPlaces)
    : stat.value;

  return (
    <p className="company-ls-electric-highlights__stat-value">
      {stat.prefix ? (
        <span className="company-ls-electric-highlights__stat-prefix">{stat.prefix}</span>
      ) : null}
      <span className="company-ls-electric-highlights__stat-number">{displayValue}</span>
      {stat.suffix ? (
        <span
          className={[
            "company-ls-electric-highlights__stat-suffix",
            stat.suffixSize === "medium" && "company-ls-electric-highlights__stat-suffix--medium",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {stat.suffix}
        </span>
      ) : null}
    </p>
  );
}

function HighlightStat({
  stat,
  isActive,
  delay,
}: {
  stat: LsElectricHighlightStat;
  isActive: boolean;
  delay: number;
}) {
  return (
    <div className="company-ls-electric-highlights__stat">
      <p className="company-ls-electric-highlights__stat-heading">
        {stat.headingLines
          ? stat.headingLines.map((line) => <span key={line}>{line}</span>)
          : stat.heading}
      </p>
      <div className="company-ls-electric-highlights__stat-body">
        <p className="company-ls-electric-highlights__stat-label">{stat.label}</p>
        <HighlightStatValue stat={stat} isActive={isActive} delay={delay} />
      </div>
    </div>
  );
}

type CompanyLsElectricHighlightsStatsProps = {
  stats: LsElectricHighlightStat[];
};

export function CompanyLsElectricHighlightsStats({
  stats,
}: CompanyLsElectricHighlightsStatsProps) {
  const { ref, isInView } = useInViewOnce<HTMLDivElement>();

  return (
    <div ref={ref} className="company-ls-electric-highlights__stats">
      {stats.map((stat, index) => (
        <div key={stat.id} className="company-ls-electric-highlights__stat-wrap">
          <HighlightStat stat={stat} isActive={isInView} delay={index * 120} />
          {index < stats.length - 1 ? (
            <span className="company-ls-electric-highlights__divider" aria-hidden />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function GlobalStatValue({
  stat,
  isActive,
  delay,
}: {
  stat: LsElectricGlobalStat;
  isActive: boolean;
  delay: number;
}) {
  const parsed = parseNumericStatValue(stat.value);
  const count = useCountUp(
    parsed?.target ?? 0,
    isActive && parsed !== null,
    delay,
    parsed?.decimalPlaces ?? 0,
  );
  const displayValue = parsed
    ? formatAnimatedStatNumber(count, parsed.useComma, parsed.decimalPlaces)
    : stat.value;

  return <span className="company-ls-electric-global__stat-value">{displayValue}</span>;
}

function GlobalStatCard({
  stat,
  isActive,
  delay,
}: {
  stat: LsElectricGlobalStat;
  isActive: boolean;
  delay: number;
}) {
  return (
    <article className="company-ls-electric-global__stat">
      <p className="company-ls-electric-global__stat-label">{stat.label}</p>
      <div className="company-ls-electric-global__stat-body">
        <GlobalStatValue stat={stat} isActive={isActive} delay={delay} />
        <span className="company-ls-electric-global__stat-unit">{stat.unit}</span>
      </div>
    </article>
  );
}

type CompanyLsElectricGlobalStatsProps = {
  stats: LsElectricGlobalStat[];
};

export function CompanyLsElectricGlobalStats({ stats }: CompanyLsElectricGlobalStatsProps) {
  const { ref, isInView } = useInViewOnce<HTMLDivElement>();

  return (
    <div ref={ref} className="company-ls-electric-global__stats">
      {stats.map((stat, index) => (
        <GlobalStatCard key={stat.id} stat={stat} isActive={isInView} delay={index * 120} />
      ))}
    </div>
  );
}
