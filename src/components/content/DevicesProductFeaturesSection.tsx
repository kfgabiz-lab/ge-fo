export type DevicesProductFeatureDescItem = {
  id: string;
  title: string;
  description: string;
};

export type DevicesProductFeatureListItem = {
  id: string;
  title: string;
  bullets: string[];
};

export type DevicesProductFeatureItem = DevicesProductFeatureDescItem;

type DevicesProductFeaturesSectionBaseProps = {
  sectionId?: string;
  title?: string;
  subtitle?: string;
};

export type DevicesProductFeaturesSectionProps =
  | (DevicesProductFeaturesSectionBaseProps & {
      variant?: "desc";
      items: DevicesProductFeatureDescItem[];
    })
  | (DevicesProductFeaturesSectionBaseProps & {
      variant: "list";
      items: DevicesProductFeatureListItem[];
    });

export default function DevicesProductFeaturesSection(props: DevicesProductFeaturesSectionProps) {
  const {
    sectionId = "product-key-feature",
    title = "Key Feature",
    subtitle,
    variant = "desc",
    items,
  } = props;

  const sectionClass =
    variant === "list"
      ? "devices_product_features devices_product_features--list"
      : "devices_product_features";

  const isKeyFeatures = sectionId === "product-key-feature";

  return (
    <section
      className={sectionClass}
      id={sectionId}
      data-slug={isKeyFeatures ? "product-data" : undefined}
    >
      <div className="inner">
        {subtitle ? (
          <div className="devices_product_features__head">
            <h2 className="section_tit">{title}</h2>
            <p className="section_desc">{subtitle}</p>
          </div>
        ) : (
          <h2 className="section_tit">{title}</h2>
        )}
        <div className="devices_product_features__grid">
          {items.map((item, index) => (
            <article key={item.id} className="devices_product_features__card">
              <p className="devices_product_features__no">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3
                className="devices_product_features__tit"
                data-slugkey={
                  isKeyFeatures ? `key_feature${index + 1}.key${index + 1}_title` : undefined
                }
              >
                {item.title}
              </h3>
              {"bullets" in item ? (
                <ul className="devices_product_features__list">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : (
                <p
                  className="devices_product_features__desc"
                  data-slugkey={
                    isKeyFeatures ? `key_feature${index + 1}.key${index + 1}_content` : undefined
                  }
                >
                  {item.description}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
