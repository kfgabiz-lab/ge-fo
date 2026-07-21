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

/** @deprecated Use DevicesProductFeatureDescItem */
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

  // 이 컴포넌트는 공용이라 (1) HW 제품상세의 "Key Features"와 (2) SW 제품상세의 Benefits 섹션에 함께 쓰인다.
  // data-slug 바인딩 대상은 (1)뿐이며, 그 사용처만 sectionId 기본값("product-key-feature")을 쓴다
  // (SW Benefits는 sectionId="product-benefits"를 명시적으로 전달 → 제외). title="Key Features"는 SW Benefits도
  // 동일 문구를 쓸 수 있어 판별자로 부적합하므로 sectionId 기본값으로 판별한다.
  // Key Features는 배열이 아니라 product-data 단일 row의 고정 필드 key_feature1~4(각 keyN_title/keyN_content)이므로
  // data-slug-repeat가 아니라 카드 인덱스로 key_feature{N}에 매핑한다(최대 4).
  const isKeyFeatures = sectionId === "product-key-feature";

  return (
    // data-slug: product-data (단건 — HW 제품상세 Key Features, hero와 동일 제품 row). Benefits(SW)에는 미부여.
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
