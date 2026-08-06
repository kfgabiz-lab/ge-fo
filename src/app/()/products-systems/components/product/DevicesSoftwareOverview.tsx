import { renderMultilineText } from "../../lib/renderMultilineText";

export type SoftwareOverviewData = {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
};

type DevicesSoftwareOverviewProps = {
  data: SoftwareOverviewData;
  imageMode?: "img" | "bg";
};

export default function DevicesSoftwareOverview({
  data,
  imageMode = "bg",
}: DevicesSoftwareOverviewProps) {
  return (
    <section className="devices_software_overview" id="product-overview">
      <div className="inner">
        {imageMode === "img" ? (
          <div className="devices_software_overview__visual">
            <img loading="lazy" decoding="async" src={data.image} alt={data.imageAlt} />
          </div>
        ) : (
          <div
            className="devices_software_overview__visual"
            style={{ backgroundImage: `url(${data.image})` }}
            role="img"
            aria-label={data.imageAlt}
          />
        )}
        <div className="devices_software_overview__body">
          <h2 className="devices_software_overview__title">
            {renderMultilineText(data.title)}
          </h2>
          <p className="devices_software_overview__desc">
            {renderMultilineText(data.description)}
          </p>
        </div>
      </div>
    </section>
  );
}
