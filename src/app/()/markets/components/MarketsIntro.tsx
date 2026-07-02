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
        <h2 className="markets_intro__tit">
          <span>
            {titleLines.map((line, index) => (
              <Fragment key={line}>
                {index > 0 ? <br /> : null}
                {line}
              </Fragment>
            ))}
          </span>
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
                while enabling data-driven optimization and supporting
                sustainable, ESG-ready Commercial &amp; Buildings environments.
              </>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
