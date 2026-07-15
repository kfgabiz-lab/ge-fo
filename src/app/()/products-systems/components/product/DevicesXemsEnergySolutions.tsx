import type { HvdcApplication } from "../../data/hvdcContent";
import { xemsEnergySolutionsSection } from "../../data/xemsContent";
import { renderMultilineText } from "../../lib/renderMultilineText";

function SolutionCard({ item }: { item: HvdcApplication }) {
  return (
    <article className="devices_product_applications__card">
      <div className="devices_product_applications__visual">
        <img loading="lazy" decoding="async" src={item.image} alt={item.title} />
      </div>
      <div className="devices_product_applications__body">
        <div className="devices_product_applications__title-group">
          <h3 className="devices_product_applications__tit">{item.title}</h3>
          <p className="devices_product_applications__sub">{item.subtitle}</p>
        </div>
        <p className="devices_product_applications__desc">
          {renderMultilineText(item.description)}
        </p>
      </div>
    </article>
  );
}

function XemsEnergyDiagramMobile() {
  const { diagramLogo, diagramCapabilities, diagramLevels } = xemsEnergySolutionsSection;

  return (
    <div className="devices_product_applications__diagram-mobile">
      <div className="devices_product_applications__diagram-box">
        <div className="devices_product_applications__diagram-flow">
          <div className="devices_product_applications__diagram-badge">
            <img loading="lazy" decoding="async" src={diagramLogo} alt="Beyond X FEMS" />
          </div>
          <ul className="devices_product_applications__diagram-capabilities">
            {diagramCapabilities.map((item) => (
              <li key={item} className="devices_product_applications__diagram-capability">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="devices_product_applications__diagram-levels">
          <ol className="devices_product_applications__diagram-level-list">
            {diagramLevels.map((level) => (
              <li key={level.id} className="devices_product_applications__diagram-level">
                <div className="devices_product_applications__diagram-level-head">
                  <p className="devices_product_applications__diagram-level-label">
                    {level.label}
                  </p>
                  <p className="devices_product_applications__diagram-level-title">{level.title}</p>
                </div>
                <p className="devices_product_applications__diagram-level-desc">
                  {level.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default function DevicesXemsEnergySolutions() {
  const { title, description, items, diagramImage, diagramAlt } = xemsEnergySolutionsSection;

  return (
    <section
      className="devices_product_applications devices_product_applications--xems"
      id="product-applications"
    >
      <div className="inner">
        <div className="devices_product_applications__head">
          <h2 className="section_tit">{title}</h2>
          {description ? <p className="section_desc">{description}</p> : null}
        </div>
        <div className="devices_product_applications__grid">
          {items.map((item) => (
            <SolutionCard key={item.id} item={item} />
          ))}
        </div>
        <div className="devices_product_applications__diagram">
          <img
            className="devices_product_applications__diagram-picture"
            loading="lazy"
            decoding="async"
            src={diagramImage}
            alt={diagramAlt}
          />
          <XemsEnergyDiagramMobile />
        </div>
      </div>
    </section>
  );
}
