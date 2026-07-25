import { renderMultilineText } from "../../lib/renderMultilineText";

// SW 제품상세 Overview 섹션 공용 컴포넌트.
// scada/xems/micro-grid/smart-factory 4종 Overview의 동일 마크업을 통합한 것으로,
// 이미지 표현 방식만 imageMode로 분기한다(scada는 <img>, 나머지는 background-image).
// title/description 멀티라인 렌더는 공통 함수 renderMultilineText를 재사용한다.
export type SoftwareOverviewData = {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
};

type DevicesSoftwareOverviewProps = {
  data: SoftwareOverviewData;
  // "img": <img> 태그 방식(scada), "bg": background-image div 방식(그 외). 기본값 "bg".
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
          {/* title/image는 대응 필드 없어 정적 유지. description만 product_info.info_description 바인딩. */}
          <h2 className="devices_software_overview__title">
            {renderMultilineText(data.title)}
          </h2>
          <p
            className="devices_software_overview__desc"
            data-slug="product-data"
            data-slugkey="product_info.info_description"
          >
            {renderMultilineText(data.description)}
          </p>
        </div>
      </div>
    </section>
  );
}
