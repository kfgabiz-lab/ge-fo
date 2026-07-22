import type { EngineeringTrainingDetail } from "@/data/services/engineeringTrainingDetailContent";

// Training 코스 상세 히어로 (ls-publish EngineeringTrainingDetailHero 이관)
// fo 데이터 컨벤션에 맞춰 description(문자열) → descriptionLines(배열) 렌더로 조정.
export default function TrainingDetailHero({
  detail,
}: {
  detail: EngineeringTrainingDetail;
}) {
  return (
    <section
      className="support_service_training_detail_hero"
      id="engineering-training-detail-hero"
    >
      <div className="inner">
        <div className="support_service_training_detail_hero__media">
          {/* 히어로 이미지: 부모 curriculum.image(파일id 배열) → _fetchedRel8 로 병합 */}
          <img
            loading="lazy"
            decoding="async"
            className="support_service_training_detail_hero__img"
            src={detail.heroImage}
            alt=""
            data-slugkey="_fetchedRel8.curriculum.image"
            data-slugkey-attr="src"
          />
        </div>
        <div className="support_service_training_detail_hero__content">
          <hr className="support_service_training_detail_hero__divider" />
          <div className="support_service_training_detail_hero__text">
            {/* 카테고리: 부모 curriculum.product_category 코드(P/A) → 라벨 변환 */}
            <p
              className="support_service_training_detail_hero__category"
              data-slugkey="_fetchedRel8.curriculum.product_category"
            >
              {detail.category}
            </p>
            {/* 코스 제목: 리스트 카드와 동일하게 부모 curriculum.title 사용(리스트→상세 연속성) */}
            <h1
              className="support_service_training_detail_hero__title"
              data-slugkey="_fetchedRel8.curriculum.title"
            >
              {detail.title}
            </h1>
            {/* 코스 설명: 부모 curriculum.description(카드와 동일 원천).
                curriculum_detail2.description(선택필드)는 상세 전용 오버라이드 후보이나
                리스트 연속성/누락 위험을 고려해 부모 curriculum.description 로 태깅 */}
            <p
              className="support_service_training_detail_hero__desc"
              data-slugkey="_fetchedRel8.curriculum.description"
            >
              {detail.descriptionLines.join(" ")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
