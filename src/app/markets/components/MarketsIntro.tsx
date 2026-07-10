import { Fragment } from "react";

type MarketsIntroProps = {
  titleLines?: string[];
  text?: string;
  /** 여러 단락 intro (Power Grid 등) — `text`보다 우선 */
  paragraphs?: string[];
};

const DEFAULT_TITLE_LINES = [
  "Energy-Efficient &",
  "Intelligent Building Infrastructure",
];

export default function MarketsIntro({
  titleLines = DEFAULT_TITLE_LINES,
  text,
  paragraphs,
}: MarketsIntroProps) {
  return (
    <section className="markets_intro">
      <div className="inner">
        {/* 대상 markets.css의 .markets_intro__tit는 flex-column이므로 span 래퍼 없이 직접 자식으로 렌더 */}
        <h2 className="markets_intro__tit">
          {titleLines.map((line, index) => (
            <Fragment key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </Fragment>
          ))}
        </h2>
        {paragraphs ? (
          <div className="markets_intro__txt">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="markets_intro__txt">
            {text ?? (
              <>
                LS ELECTRIC delivers integrated building power solutions—from
                low-voltage distribution and protection devices to BEMS, smart
                electrical rooms, and solar-PV/ESS integration. These solutions
                enhance{" "}
                <strong>
                  power reliability, energy efficiency, and safety
                </strong>{" "}
                while enabling data-driven optimization and supporting sustainable,
                ESG-ready Commercial &amp; Buildings environments.
              </>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
