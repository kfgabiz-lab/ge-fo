import MarketsSmartGridDiagram from "./MarketsSmartGridDiagram";

export type SmartGridUseCase = {
  id: string;
  title?: string;
  description: string;
};

type MarketsSmartGridProps = {
  title?: string;
  descriptionLines?: string[];
  useCasesTitleLines?: string[];
  useCases?: SmartGridUseCase[];
  operationTitleLines?: string[];
  operationItems?: SmartGridUseCase[];
};

const DEFAULT_TITLE = "Smart Grid & Energy Storage Solutions";

export default function MarketsSmartGrid({
  title = DEFAULT_TITLE,
  descriptionLines = [
    "LS ELECTRIC delivers integrated BESS and microgrid solutions that enhance grid reliability, flexibility,",
    "and renewable integration through advanced energy management.",
  ],
  useCasesTitleLines = ["Use Case of", "BESS & Microgrid"],
  useCases = [],
  operationTitleLines = ["Microgrid Operation", "& Key Features"],
  operationItems = [],
}: MarketsSmartGridProps) {
  return (
    <section className="markets_smart_grid" id="markets-smart-grid">
      <div className="inner">
        <div className="markets_smart_grid__head">
          <h2 className="section_tit">{title}</h2>
          <p className="section_desc">
            {descriptionLines.map((line, index) => (
              <span key={line}>
                {index > 0 ? (
                  <>
                    <br />{" "}
                  </>
                ) : null}
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="markets_smart_grid__body">
        <div className="inner">
          {useCases.length > 0 ? (
            <div className="markets_smart_grid__block">
              <h3 className="markets_smart_grid__block_tit">
                {useCasesTitleLines.map((line, index) => (
                  <span key={line}>
                    {index > 0 ? (
                      <>
                        <br />{" "}
                      </>
                    ) : null}
                    {line}
                  </span>
                ))}
              </h3>
              <div className="markets_smart_grid__cards">
                {useCases.map((item) => (
                  <div key={item.id} className="markets_smart_grid__card">
                    <div className="markets_smart_grid__card_body">
                      {item.title ? (
                        <h4 className="markets_smart_grid__card_tit">
                          {item.title}
                        </h4>
                      ) : null}
                      <p className="markets_smart_grid__card_desc">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {operationItems.length > 0 ? (
            <div className="markets_smart_grid__block">
              <h3 className="markets_smart_grid__block_tit">
                {operationTitleLines.map((line, index) => (
                  <span key={line}>
                    {index > 0 ? (
                      <>
                        <br />{" "}
                      </>
                    ) : null}
                    {line}
                  </span>
                ))}
              </h3>
              <div className="markets_smart_grid__cards">
                {operationItems.map((item) => (
                  <div
                    key={item.id}
                    className="markets_smart_grid__card markets_smart_grid__card--text-only"
                  >
                    <p className="markets_smart_grid__card_desc">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <MarketsSmartGridDiagram />
        </div>
      </div>
    </section>
  );
}
