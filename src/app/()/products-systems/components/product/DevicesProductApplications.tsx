import type { HvdcApplication } from "../../data/hvdcContent";

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

type DevicesProductApplicationsProps = {
  title: string;
  description: string;
  items: HvdcApplication[];
};

export default function DevicesProductApplications({
  title,
  description,
  items,
}: DevicesProductApplicationsProps) {
  return (
    <section className="devices_product_applications" id="product-applications">
      <div className="inner">
        <div className="devices_product_applications__head">
          <h2 className="section_tit">{title}</h2>
          {description ? <p className="section_desc">{description}</p> : null}
        </div>
        <div className="devices_product_applications__grid">
          {items.map((item) => (
            <article key={item.id} className="devices_product_applications__card">
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
          ))}
        </div>
      </div>
    </section>
  );
}
