import { hvdcOverview } from "../../data/hvdcContent";

export default function DevicesHvdcOverview() {
  const titleLines = hvdcOverview.title.split("\n");
  const descriptionLines = hvdcOverview.description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section className="devices_software_overview" id="product-overview">
      <div className="inner">
        <div className="devices_software_overview__visual">
          <img loading="lazy" decoding="async" src={hvdcOverview.image} alt={hvdcOverview.imageAlt} />
        </div>
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
