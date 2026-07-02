import type { HvdcApplication } from "../../data/hvdcContent";
import { xemsEnergySolutionsSection } from "../../data/xemsContent";

function renderMultilineText(text: string) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

function SolutionCard({ item }: { item: HvdcApplication }) {
  return (
    <article className="devices_xems_energy_solutions__card">
      <div className="devices_xems_energy_solutions__visual">
        <img loading="lazy" decoding="async" src={item.image} alt={item.title} />
      </div>
      <div className="devices_xems_energy_solutions__body">
        <h3 className="devices_xems_energy_solutions__tit">{item.title}</h3>
        <p className="devices_xems_energy_solutions__sub">{item.subtitle}</p>
        <p className="devices_xems_energy_solutions__desc">
          {renderMultilineText(item.description)}
        </p>
      </div>
    </article>
  );
}

export default function DevicesXemsEnergySolutions() {
  const { title, description, items, diagramImage, diagramAlt } = xemsEnergySolutionsSection;

  return (
    <section className="devices_xems_energy_solutions" id="product-applications">
      <div className="inner">
        <div className="devices_xems_energy_solutions__head">
          <h2 className="section_tit">{title}</h2>
          {description ? <p className="section_desc">{description}</p> : null}
        </div>
        <div className="devices_xems_energy_solutions__grid">
          {items.map((item) => (
            <SolutionCard key={item.id} item={item} />
          ))}
        </div>
        <div className="devices_xems_energy_solutions__diagram">
          <img loading="lazy" decoding="async" src={diagramImage} alt={diagramAlt} />
        </div>
      </div>
    </section>
  );
}
