import type {
  MarketsSolutionBlock,
  MarketsSolutionDiagram,
  MarketsSolutionsPanelProps,
} from "../data/marketsSolutionsPanelTypes";

function SolutionDiagram({ diagram }: { diagram: MarketsSolutionDiagram }) {
  return (
    <figure className="markets_solutions_panel__diagram">
      <img
        className="markets_solutions_panel__diagram-img"
        src={diagram.src}
        alt={diagram.alt}
        width={diagram.width}
        height={diagram.height}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}

function SolutionBlock({ block }: { block: MarketsSolutionBlock }) {
  return (
    <article className="markets_solutions_panel__block">
      <h3 className="markets_solutions_panel__block-title">{block.title}</h3>
      <div className="markets_solutions_panel__block-body">
        <p className="markets_solutions_panel__block-text">
          {block.paragraphs.map((paragraph, index) => (
            <span key={paragraph}>
              {index > 0 ? <br /> : null}
              {paragraph}
            </span>
          ))}
        </p>
        {block.keySolutions ? (
          <p className="markets_solutions_panel__block-key">
            <span className="markets_solutions_panel__block-key-label">Key Solutions :</span>{" "}
            {block.keySolutions}
          </p>
        ) : null}
        {block.capabilities ? (
          <div className="markets_solutions_panel__capabilities">
            <p className="markets_solutions_panel__capabilities-label">Key Capabilities</p>
            <ul className="markets_solutions_panel__capabilities-list">
              {block.capabilities.map((item) => (
                <li key={item} className="markets_solutions_panel__capabilities-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function MarketsSolutionsPanel({
  sectionId,
  title,
  description,
  layout,
  groups,
  trailingDiagram,
}: MarketsSolutionsPanelProps) {
  return (
    <section
      className={`markets_solutions_panel markets_solutions_panel--${layout}`}
      id={sectionId}
    >
      <div className="inner">
        <header className="markets_solutions_panel__head">
          <h2 className="section_tit">{title}</h2>
          <p className="section_desc">{description}</p>
        </header>

        <div className="markets_solutions_panel__panel">
          {groups.map((group) => (
            <div key={group.id} className="markets_solutions_panel__group">
              {group.blocks.length > 1 ? (
                <div className="markets_solutions_panel__blocks">
                  {group.blocks.map((block) => (
                    <SolutionBlock key={block.id} block={block} />
                  ))}
                </div>
              ) : (
                group.blocks.map((block) => <SolutionBlock key={block.id} block={block} />)
              )}
              {group.diagram ? <SolutionDiagram diagram={group.diagram} /> : null}
            </div>
          ))}
          {trailingDiagram ? <SolutionDiagram diagram={trailingDiagram} /> : null}
        </div>
      </div>
    </section>
  );
}
