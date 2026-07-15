"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import { formatStatNumber, parseNumericStatValue } from "@/lib/statNumber";
import type { MarketStatItem } from "../data/marketsDataCenterContent";

type MarketsStatsProps = {
  items: MarketStatItem[];
};

type MarketsStatValueProps = {
  item: MarketStatItem;
  isActive: boolean;
  delay: number;
};

function MarketsStatValue({ item, isActive, delay }: MarketsStatValueProps) {
  const parsed = parseNumericStatValue(item.value);
  const count = useCountUp(
    parsed?.target ?? 0,
    isActive && parsed !== null,
    delay,
    parsed?.decimalPlaces ?? 0,
  );
  const displayValue = parsed
    ? formatStatNumber(count, parsed.useComma, parsed.decimalPlaces)
    : item.value;
  // 원본 값이 "+"로 끝나면(별도 valueSuffix가 없을 때) 인라인 "+" 접미사로 표시
  const inlinePlusSuffix =
    !item.valueSuffix && item.value.trim().endsWith("+") ? "+" : null;

  return (
    <p className="markets_stats__value">
      {displayValue}
      {item.valueUnit ? (
        <span className="markets_stats__value-unit">{item.valueUnit}</span>
      ) : null}
      {item.valueSuffix || inlinePlusSuffix ? (
        <span className="markets_stats__value-suffix">
          {item.valueSuffix ?? inlinePlusSuffix}
        </span>
      ) : null}
    </p>
  );
}

export default function MarketsStats({ items }: MarketsStatsProps) {
  // 최초 1회 진입 감지(fo 공통 useInView, 임계값 0.18은 pub useInViewOnce 기준과 동일)
  const { ref: panelRef, isInView } = useInView<HTMLDivElement>(0.18);

  return (
    <section className="markets_stats">
      <div className="inner">
        <div ref={panelRef} className="markets_stats__panel">
          <div className="markets_stats__grid">
            {items.map((item, index) => (
              <article key={item.id} className="markets_stats__col">
                <p className="markets_stats__label">{item.label}</p>
                <div className="markets_stats__headline">
                  <MarketsStatValue
                    item={item}
                    isActive={isInView}
                    delay={index * 120}
                  />
                  {item.sublabel ? (
                    <p className="markets_stats__sublabel">{item.sublabel}</p>
                  ) : null}
                </div>
                <p className="markets_stats__desc">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
