import { microGridWhySection } from "../../data/microGridContent";
import { renderMultilineText } from "../../lib/renderMultilineText";

export default function DevicesMicroGridHighlights() {
  const { title, items, diagramImage, diagramImageMobile, diagramAlt } = microGridWhySection;

  return (
    <section className="devices_micro_grid_why" id="product-why">
      <div className="inner">
        <h2 className="section_tit">{renderMultilineText(title)}</h2>
        <div className="devices_micro_grid_why__panel">
          <div className="devices_micro_grid_why__items">
            {items.map((item) => (
              <div key={item.id} className="devices_micro_grid_why__item">
                <h3 className="devices_micro_grid_why__item-tit">{item.title}</h3>
                <p className="devices_micro_grid_why__item-desc">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="devices_micro_grid_why__diagram">
            <div className="devices_micro_grid_why__diagram-picture">
              <img loading="lazy" decoding="async" src={diagramImage} alt={diagramAlt} />
            </div>
            <div className="devices_micro_grid_why__diagram-mobile">
              <img loading="lazy" decoding="async" src={diagramImageMobile} alt={diagramAlt} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
