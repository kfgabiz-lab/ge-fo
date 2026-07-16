import { hvdcOverview } from "../../data/hvdcContent";

// description/image 는 product-data(단건) 실데이터로 덮어쓰기, 미지정 시 정적 폴백.
// title/imageAlt 는 product-data 대응 필드 없음(실측) → 정적 유지
type DevicesHvdcOverviewProps = {
  description?: string;
  image?: string;
};

export default function DevicesHvdcOverview({
  description = hvdcOverview.description,
  image = hvdcOverview.image,
}: DevicesHvdcOverviewProps = {}) {
  const titleLines = hvdcOverview.title.split("\n");
  const descriptionLines = description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    // data-slug: product-data (단건 — SW 제품상세 Overview 섹션, hero와 동일 제품 row)
    <section className="devices_software_overview" id="product-overview" data-slug="product-data">
      <div className="inner">
        <div className="devices_software_overview__visual">
          {/* scada 오버뷰 이미지는 <img src> 렌더. product_info.image = 파일ID 배열 → /api/v1/fo/page-files/{id} 프록시 변환 */}
          <img loading="lazy" decoding="async" src={image} alt={hvdcOverview.imageAlt} data-slugKey="product_info.image" data-slugKey-attr="src" />
        </div>
        <div className="devices_software_overview__body">
          {/* overview 제목 = product-data 대응 필드 없음(실측) → 정적 유지, 태그 없음 */}
          <h2 className="devices_software_overview__title">
            {titleLines.map((line, index) => (
              <span key={line}>
                {line}
                {index < titleLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>
          <p className="devices_software_overview__desc" data-slugKey="product_info.info_description">
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
