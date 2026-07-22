import type {
  MarketsSolutionBlock,
  MarketsSolutionCategory,
  MarketsSolutionDiagram,
  MarketsSolutionsPanelProps,
} from "../data/marketsSolutionsPanelTypes";

function SolutionDiagram({ diagram }: { diagram: MarketsSolutionDiagram }) {
  const mobileSrc = diagram.mobileSrc ?? diagram.src;
  const mobileWidth = diagram.mobileWidth ?? diagram.width;
  const mobileHeight = diagram.mobileHeight ?? diagram.height;

  return (
    <figure className="markets_solutions_panel__diagram">
      <img
        className="markets_solutions_panel__diagram-img markets_solutions_panel__diagram-img--pc"
        src={diagram.src}
        alt={diagram.alt}
        width={diagram.width}
        height={diagram.height}
        loading="lazy"
        decoding="async"
      />
      <img
        className="markets_solutions_panel__diagram-img markets_solutions_panel__diagram-img--mo"
        src={mobileSrc}
        alt={diagram.alt}
        width={mobileWidth}
        height={mobileHeight}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}

function SolutionCategory({ category }: { category: MarketsSolutionCategory }) {
  return (
    <article className="markets_solutions_panel__category">
      <h3 className="markets_solutions_panel__category-tit">{category.title}</h3>
      <ul className="markets_solutions_panel__category-list">
        {category.items.map((item) => (
          <li key={item} className="markets_solutions_panel__category-item">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function SolutionBlock({
  block,
  diagram,
}: {
  block: MarketsSolutionBlock;
  diagram?: MarketsSolutionDiagram;
}) {
  return (
    <article
      className={`markets_solutions_panel__block${
        diagram ? " markets_solutions_panel__block--with-diagram" : ""
      }`}
    >
      <div className="markets_solutions_panel__block-body">
        <div className="markets_solutions_panel__block-copy">
          <h3 className="markets_solutions_panel__block-title">{block.title}</h3>
          <p className="markets_solutions_panel__block-text">
            {block.paragraphs.join(" ")}
          </p>
        </div>
        {block.keySolutions ? (
          <p className="markets_solutions_panel__block-key">
            <span className="markets_solutions_panel__block-key-label">Key Solutions:</span>{" "}
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
      {diagram ? <SolutionDiagram diagram={diagram} /> : null}
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
  categories,
}: MarketsSolutionsPanelProps) {
  const attachTrailingDiagramToLastBlock =
    layout === "stacked" && groups.length === 1 && groups[0].blocks.length > 0;

  return (
    <section
      className={`markets_solutions_panel markets_solutions_panel--${layout}${
        categories?.length ? " markets_solutions_panel--categories" : ""
      }`}
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
                  {group.blocks.map((block, blockIndex) => (
                    <SolutionBlock
                      key={block.id}
                      block={block}
                      diagram={
                        attachTrailingDiagramToLastBlock &&
                        blockIndex === group.blocks.length - 1
                          ? trailingDiagram
                          : undefined
                      }
                    />
                  ))}
                </div>
              ) : (
                group.blocks.map((block) => (
                  <SolutionBlock
                    key={block.id}
                    block={block}
                    diagram={attachTrailingDiagramToLastBlock ? trailingDiagram : undefined}
                  />
                ))
              )}
              {group.diagram ? <SolutionDiagram diagram={group.diagram} /> : null}
            </div>
          ))}
          {trailingDiagram && !attachTrailingDiagramToLastBlock ? (
            <SolutionDiagram diagram={trailingDiagram} />
          ) : null}
          {categories?.length ? (
            <div className="markets_solutions_panel__categories">
              {categories.map((category) => (
                <SolutionCategory key={category.id} category={category} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
