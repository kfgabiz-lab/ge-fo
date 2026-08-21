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
};

function MarketsStatValue({ item }: MarketsStatValueProps) {
  const { ref, isInView } = useInView<HTMLSpanElement>(
    0.18,
    "0px 0px -3% 0px",
  );
  const parsed = parseNumericStatValue(item.value);
  const count = useCountUp(
    parsed?.target ?? 0,
    isInView && parsed !== null,
    0,
    parsed?.decimalPlaces ?? 0,
  );
  const displayValue = parsed
    ? formatStatNumber(count, parsed.useComma, parsed.decimalPlaces)
    : item.value;
  const inlinePlusSuffix =
    !item.valueSuffix && item.value.trim().endsWith("+") ? "+" : null;

  return (
    <span ref={ref} className="markets_stats__value">
      {displayValue}
      {item.valueUnit ? (
        <span className="markets_stats__value-unit">{item.valueUnit}</span>
      ) : null}
      {item.valueSuffix || inlinePlusSuffix ? (
        <span className="markets_stats__value-suffix">
          {item.valueSuffix ?? inlinePlusSuffix}
        </span>
      ) : null}
    </span>
  );
}

export default function MarketsStats({ items }: MarketsStatsProps) {
  return (
    <section className="markets_stats">
      <div className="inner">
        <div className="markets_stats__panel">
          <div className="markets_stats__grid">
            {items.map((item) => (
              <article key={item.id} className="markets_stats__col">
                <h3 className="markets_stats__head">
                  <span className="markets_stats__label">{item.label}</span>
                  <div className="markets_stats__headline">
                    <MarketsStatValue item={item} />
                    {item.sublabel ? (
                      <span className="markets_stats__sublabel">
                        {item.sublabel}
                      </span>
                    ) : null}
                  </div>
                </h3>
                <p className="markets_stats__desc">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
