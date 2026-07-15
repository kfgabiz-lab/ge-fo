import { smartFactoryOverview } from "../../data/smartFactoryContent";

export default function DevicesSmartFactoryOverview() {
  const titleLines = smartFactoryOverview.title.split("\n");
  const descriptionLines = smartFactoryOverview.description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section className="devices_software_overview" id="product-overview">
      <div className="inner">
        <div
          className="devices_software_overview__visual"
          style={{ backgroundImage: `url(${smartFactoryOverview.image})` }}
          role="img"
          aria-label={smartFactoryOverview.imageAlt}
        />
        <div className="devices_software_overview__body">
          <h2 className="devices_software_overview__title">
            {titleLines.map((line, index) => (
              <span key={line}>
                {line}
                {index < titleLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>
          <p className="devices_software_overview__desc">
            {descriptionLines.map((line, index) => (
              <span key={line}>
                {line}
                {index < descriptionLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
