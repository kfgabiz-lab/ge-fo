import { smartFactoryOverview } from "../../data/smartFactoryContent";

// description/image 는 product-data(단건) 실데이터로 덮어쓰기, 미지정 시 정적 폴백.
// title/imageAlt 는 product-data 대응 필드 없음(실측) → 정적 유지
type DevicesSmartFactoryOverviewProps = {
  description?: string;
  image?: string;
};

export default function DevicesSmartFactoryOverview({
  description = smartFactoryOverview.description,
  image = smartFactoryOverview.image,
}: DevicesSmartFactoryOverviewProps = {}) {
  const titleLines = smartFactoryOverview.title.split("\n");
  const descriptionLines = description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    // data-slug: product-data (단건 — SW 제품상세 Overview, hero와 동일 제품 row)
    <section className="devices_software_overview" id="product-overview" data-slug="product-data">
      <div className="inner">
        {/* product_info.image = 파일ID 배열 → /api/v1/fo/page-files/{id} 프록시 변환.
            이 화면은 CSS background-image로 렌더 → FE 연동 시 style 처리 필요(src attr 아님, scada와 분기) */}
        <div
          className="devices_software_overview__visual"
          style={{ backgroundImage: `url(${image})` }}
          role="img"
          aria-label={smartFactoryOverview.imageAlt}
          data-slugKey="product_info.image"
        />
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
