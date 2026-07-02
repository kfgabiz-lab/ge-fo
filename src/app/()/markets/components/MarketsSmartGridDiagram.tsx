const DIAGRAM_SRC = "/img/markets/power-grid/smart-grid/diagram.svg";

export default function MarketsSmartGridDiagram() {
  return (
    <figure className="markets_smart_grid__diagram">
      <img
        className="markets_smart_grid__diagram-img"
        src={DIAGRAM_SRC}
        alt="Microgrid system diagram showing Utility Grid, Load, Energy Storage, Renewable Energy, and Generators connected to a central Microgrid Controller"
        width={1320}
        height={560}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}
