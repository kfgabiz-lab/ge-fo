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

  return (
    <p className="markets_stats__value">
      {displayValue}
      {item.valueUnit ? (
        <span className="markets_stats__value-unit">{item.valueUnit}</span>
      ) : null}
      {item.valueSuffix ? (
        <span className="markets_stats__value-suffix">{item.valueSuffix}</span>
      ) : null}
    </p>
  );
}

export default function MarketsStats({ items }: MarketsStatsProps) {
  const { ref: panelRef, isInView } = useInView<HTMLDivElement>();

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
                  <p className="markets_stats__sublabel">{item.sublabel}</p>
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
